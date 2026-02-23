const { DecisionMatrix } = require("../src/index");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message}`);
  }
}

console.log("Testing DecisionMatrix\n");

// Test: Basic creation
const dm = new DecisionMatrix("Tech Stack Decision");
assert(dm.name === "Tech Stack Decision", "Constructor sets name");

// Test: Add options
dm.addOption("react", "React");
dm.addOption("vue", "Vue.js");
dm.addOption("svelte", "Svelte");
assert(dm.options.length === 3, "Added 3 options");

// Test: Duplicate option throws
try {
  dm.addOption("react", "React Again");
  assert(false, "Duplicate option should throw");
} catch (e) {
  assert(true, "Duplicate option throws error");
}

// Test: Add criteria
dm.addCriteria("perf", "Performance", 3);
dm.addCriteria("eco", "Ecosystem", 2);
dm.addCriteria("learn", "Learning Curve", 1);
assert(dm.criteria.length === 3, "Added 3 criteria");

// Test: Invalid weight throws
try {
  dm.addCriteria("bad", "Bad Criterion", -1);
  assert(false, "Negative weight should throw");
} catch (e) {
  assert(true, "Negative weight throws error");
}

// Test: Set weight
dm.setWeight("perf", 5);
assert(dm.criteria.find((c) => c.id === "perf").weight === 5, "setWeight updates weight");

// Test: Score options
dm.score("react", "perf", 7);
dm.score("react", "eco", 9);
dm.score("react", "learn", 6);
dm.score("vue", "perf", 7);
dm.score("vue", "eco", 7);
dm.score("vue", "learn", 8);
dm.score("svelte", "perf", 9);
dm.score("svelte", "eco", 5);
dm.score("svelte", "learn", 9);
assert(dm.scores["react"]["perf"] === 7, "Score recorded correctly");

// Test: Calculate
const results = dm.calculate();
assert(results.length === 3, "Calculate returns all options");
assert(results[0].weightedScore >= results[1].weightedScore, "Results sorted by weighted score");

// Test: getBestOption
const best = dm.getBestOption();
assert(best.id === results[0].id, "getBestOption returns highest scorer");

// Test: getRanking
const ranking = dm.getRanking();
assert(ranking[0].rank === 1, "First rank is 1");
assert(ranking.length === 3, "Ranking has all options");

// Test: Chaining
const dm2 = new DecisionMatrix("Chaining Test")
  .addOption("a", "Option A")
  .addOption("b", "Option B")
  .addCriteria("c1", "Criterion 1", 2)
  .score("a", "c1", 8)
  .score("b", "c1", 6);
assert(dm2.getBestOption().id === "a", "Chaining works correctly");

// Test: toJSON / fromJSON
const json = dm.toJSON();
const restored = DecisionMatrix.fromJSON(json);
assert(restored.name === dm.name, "fromJSON restores name");
assert(restored.options.length === dm.options.length, "fromJSON restores options");
const restoredBest = restored.getBestOption();
assert(restoredBest.id === best.id, "Restored matrix produces same result");

// Test: print (just ensure it doesn't throw)
try {
  dm.print();
  assert(true, "print() runs without error");
} catch (e) {
  assert(false, "print() should not throw");
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
