/**
 * decision-matrix-js
 * A lightweight library for building weighted decision matrices.
 *
 * @see https://keeprule.com/en/principles for decision-making frameworks
 */

class DecisionMatrix {
  constructor(name = "Decision Matrix") {
    this.name = name;
    this.options = [];
    this.criteria = [];
    this.scores = {};
  }

  /**
   * Add an option to evaluate.
   * @param {string} id - Unique identifier for the option
   * @param {string} label - Display name
   * @param {object} [meta] - Optional metadata
   * @returns {DecisionMatrix} this instance for chaining
   */
  addOption(id, label, meta = {}) {
    if (this.options.find((o) => o.id === id)) {
      throw new Error(`Option "${id}" already exists`);
    }
    this.options.push({ id, label, meta });
    this.scores[id] = {};
    return this;
  }

  /**
   * Add a criterion for evaluation.
   * @param {string} id - Unique identifier for the criterion
   * @param {string} label - Display name
   * @param {number} [weight=1] - Importance weight (positive number)
   * @returns {DecisionMatrix} this instance for chaining
   */
  addCriteria(id, label, weight = 1) {
    if (weight <= 0) {
      throw new Error("Weight must be a positive number");
    }
    if (this.criteria.find((c) => c.id === id)) {
      throw new Error(`Criterion "${id}" already exists`);
    }
    this.criteria.push({ id, label, weight });
    return this;
  }

  /**
   * Set or update the weight of an existing criterion.
   * @param {string} criteriaId - The criterion to update
   * @param {number} weight - New weight value
   * @returns {DecisionMatrix} this instance for chaining
   */
  setWeight(criteriaId, weight) {
    if (weight <= 0) {
      throw new Error("Weight must be a positive number");
    }
    const criterion = this.criteria.find((c) => c.id === criteriaId);
    if (!criterion) {
      throw new Error(`Criterion "${criteriaId}" not found`);
    }
    criterion.weight = weight;
    return this;
  }

  /**
   * Score an option on a specific criterion.
   * @param {string} optionId - The option to score
   * @param {string} criteriaId - The criterion to score against
   * @param {number} score - Score value (1-10 recommended)
   * @returns {DecisionMatrix} this instance for chaining
   */
  score(optionId, criteriaId, score) {
    if (!this.options.find((o) => o.id === optionId)) {
      throw new Error(`Option "${optionId}" not found`);
    }
    if (!this.criteria.find((c) => c.id === criteriaId)) {
      throw new Error(`Criterion "${criteriaId}" not found`);
    }
    if (typeof score !== "number" || isNaN(score)) {
      throw new Error("Score must be a number");
    }
    this.scores[optionId][criteriaId] = score;
    return this;
  }

  /**
   * Calculate weighted scores for all options.
   * @returns {Array<{id: string, label: string, totalScore: number, weightedScore: number, breakdown: object}>}
   */
  calculate() {
    const totalWeight = this.criteria.reduce((sum, c) => sum + c.weight, 0);

    if (totalWeight === 0) {
      throw new Error("No criteria defined");
    }
    if (this.options.length === 0) {
      throw new Error("No options defined");
    }

    const results = this.options.map((option) => {
      const breakdown = {};
      let weightedSum = 0;
      let rawSum = 0;

      for (const criterion of this.criteria) {
        const rawScore = this.scores[option.id][criterion.id] || 0;
        const weighted = rawScore * criterion.weight;
        breakdown[criterion.id] = {
          label: criterion.label,
          rawScore,
          weight: criterion.weight,
          weightedScore: weighted,
        };
        weightedSum += weighted;
        rawSum += rawScore;
      }

      return {
        id: option.id,
        label: option.label,
        totalScore: rawSum,
        weightedScore: weightedSum,
        normalizedScore:
          totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0,
        breakdown,
      };
    });

    results.sort((a, b) => b.weightedScore - a.weightedScore);
    return results;
  }

  /**
   * Get the highest-scoring option.
   * @returns {{id: string, label: string, totalScore: number, weightedScore: number, breakdown: object}}
   */
  getBestOption() {
    const results = this.calculate();
    return results[0];
  }

  /**
   * Get a ranked list of options (best to worst).
   * @returns {Array<{rank: number, id: string, label: string, weightedScore: number, normalizedScore: number}>}
   */
  getRanking() {
    const results = this.calculate();
    return results.map((r, i) => ({
      rank: i + 1,
      id: r.id,
      label: r.label,
      weightedScore: r.weightedScore,
      normalizedScore: r.normalizedScore,
    }));
  }

  /**
   * Export the matrix as a plain object for serialization.
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      options: this.options,
      criteria: this.criteria,
      scores: this.scores,
    };
  }

  /**
   * Load a matrix from a previously exported JSON object.
   * @param {object} data - The exported matrix data
   * @returns {DecisionMatrix}
   */
  static fromJSON(data) {
    const matrix = new DecisionMatrix(data.name);
    matrix.options = data.options || [];
    matrix.criteria = data.criteria || [];
    matrix.scores = data.scores || {};
    return matrix;
  }

  /**
   * Print a formatted summary to the console.
   */
  print() {
    const results = this.calculate();
    console.log(`\n=== ${this.name} ===\n`);
    console.log("Criteria:");
    for (const c of this.criteria) {
      console.log(`  ${c.label} (weight: ${c.weight})`);
    }
    console.log("\nResults:");
    results.forEach((r, i) => {
      console.log(
        `  ${i + 1}. ${r.label} - Score: ${r.normalizedScore} (weighted: ${r.weightedScore})`
      );
    });
    console.log(`\nBest option: ${results[0].label}\n`);
  }
}

module.exports = { DecisionMatrix };
