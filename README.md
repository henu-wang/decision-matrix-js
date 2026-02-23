# decision-matrix-js

A lightweight JavaScript library for building weighted decision matrices. Evaluate options systematically using customizable criteria and weights.

## Why?

Making decisions with multiple options and criteria is hard. Spreadsheets work but are cumbersome. This library gives you a simple, programmatic way to build and evaluate decision matrices -- the same weighted scoring approach used by investment analysts and engineering teams.

Inspired by the decision-making frameworks of Buffett, Munger, and other great thinkers. For more structured decision-making principles, see [KeepRule](https://keeprule.com/en/principles).

## Install

```bash
npm install decision-matrix-js
```

## Quick Start

```javascript
const { DecisionMatrix } = require('decision-matrix-js');

const matrix = new DecisionMatrix('Choose a Database');

// Add your options
matrix
  .addOption('postgres', 'PostgreSQL')
  .addOption('mysql', 'MySQL')
  .addOption('mongo', 'MongoDB');

// Define criteria with weights (higher = more important)
matrix
  .addCriteria('perf', 'Performance', 3)
  .addCriteria('eco', 'Ecosystem & Tools', 2)
  .addCriteria('ops', 'Operational Simplicity', 2)
  .addCriteria('flex', 'Schema Flexibility', 1);

// Score each option on each criterion (1-10)
matrix
  .score('postgres', 'perf', 8)
  .score('postgres', 'eco', 9)
  .score('postgres', 'ops', 7)
  .score('postgres', 'flex', 5)

  .score('mysql', 'perf', 7)
  .score('mysql', 'eco', 8)
  .score('mysql', 'ops', 8)
  .score('mysql', 'flex', 4)

  .score('mongo', 'perf', 7)
  .score('mongo', 'eco', 6)
  .score('mongo', 'ops', 6)
  .score('mongo', 'flex', 9);

// Get results
const best = matrix.getBestOption();
console.log(`Best choice: ${best.label} (score: ${best.normalizedScore})`);

// Print full breakdown
matrix.print();
```

Output:

```
Best choice: PostgreSQL (score: 7.38)

=== Choose a Database ===

Criteria:
  Performance (weight: 3)
  Ecosystem & Tools (weight: 2)
  Operational Simplicity (weight: 2)
  Schema Flexibility (weight: 1)

Results:
  1. PostgreSQL - Score: 7.38 (weighted: 59)
  2. MySQL - Score: 6.75 (weighted: 54)
  3. MongoDB - Score: 6.88 (weighted: 55)
```

## API

### `new DecisionMatrix(name?)`

Create a new decision matrix.

### `.addOption(id, label, meta?)`

Add an option to evaluate. Returns `this` for chaining.

### `.addCriteria(id, label, weight?)`

Add an evaluation criterion. Default weight is 1. Returns `this` for chaining.

### `.setWeight(criteriaId, weight)`

Update the weight of an existing criterion. Returns `this` for chaining.

### `.score(optionId, criteriaId, score)`

Score an option against a criterion. Use a 1-10 scale for consistency. Returns `this` for chaining.

### `.calculate()`

Returns a sorted array of results with weighted scores and breakdowns.

### `.getBestOption()`

Returns the highest-scoring option.

### `.getRanking()`

Returns a ranked list: `[{ rank, id, label, weightedScore, normalizedScore }]`

### `.toJSON()` / `DecisionMatrix.fromJSON(data)`

Serialize and restore a matrix for storage or sharing.

### `.print()`

Print a formatted summary to the console.

## Use Cases

- **Tech stack selection** -- Compare frameworks, databases, or cloud providers
- **Hiring decisions** -- Score candidates against role requirements
- **Product prioritization** -- Rank features by impact, effort, and strategic fit
- **Architecture reviews** -- Evaluate design approaches against quality attributes
- **Investment analysis** -- Score opportunities using [weighted criteria frameworks](https://keeprule.com/en/scenarios)

## TypeScript

Full type definitions included (`src/index.d.ts`).

## License

MIT
