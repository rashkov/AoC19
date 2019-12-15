'use strict';

var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");

function neverDecreases(num) {
  var digitArray = String(num).split("");
  var ret = /* record */[/* contents */true];
  Belt_Array.forEachWithIndex(digitArray, (function (idx, digit) {
          var prevDigitIdx = idx - 1 | 0;
          if (prevDigitIdx >= 0 && Caml_array.caml_array_get(digitArray, prevDigitIdx) > digit) {
            ret[0] = false;
            return /* () */0;
          } else {
            return 0;
          }
        }));
  return ret[0];
}

function twoAdjacent(num) {
  var digitArray = String(num).split("");
  var ret = /* record */[/* contents */false];
  Belt_Array.forEachWithIndex(digitArray, (function (idx, digit) {
          var prevDigitIdx = idx - 1 | 0;
          if (prevDigitIdx >= 0 && Caml_array.caml_array_get(digitArray, prevDigitIdx) === digit) {
            ret[0] = true;
            return /* () */0;
          } else {
            return 0;
          }
        }));
  return ret[0];
}

function getIndexesOfNewDigits(num) {
  var startOfNewDigitIndexes = /* record */[/* contents : array */[0]];
  var digitArray = String(num).split("");
  Belt_Array.forEachWithIndex(digitArray, (function (idx, digit) {
          var prevDigitIdx = idx - 1 | 0;
          if (prevDigitIdx >= 0 && Caml_array.caml_array_get(digitArray, prevDigitIdx) !== digit) {
            startOfNewDigitIndexes[0] = Belt_Array.concat(startOfNewDigitIndexes[0], /* array */[idx]);
            return /* () */0;
          } else {
            return 0;
          }
        }));
  startOfNewDigitIndexes[0] = Belt_Array.concat(startOfNewDigitIndexes[0], /* array */[digitArray.length]);
  return startOfNewDigitIndexes[0];
}

function exactlyTwoAdjacent(num) {
  var startOfNewDigitIndexes = getIndexesOfNewDigits(num);
  var ret = /* record */[/* contents */false];
  Belt_Array.forEach(Belt_Array.range(1, startOfNewDigitIndexes.length - 1 | 0), (function (idx) {
          if ((Caml_array.caml_array_get(startOfNewDigitIndexes, idx) - Caml_array.caml_array_get(startOfNewDigitIndexes, idx - 1 | 0) | 0) === 2) {
            ret[0] = true;
            return /* () */0;
          } else {
            return 0;
          }
        }));
  return ret[0];
}

function meetsRequirements(num) {
  if (neverDecreases(num)) {
    return twoAdjacent(num);
  } else {
    return false;
  }
}

function meetsRequirementsPt2(num) {
  if (neverDecreases(num)) {
    return exactlyTwoAdjacent(num);
  } else {
    return false;
  }
}

var part1 = "Part 1: " + String(Belt_Array.reduce(Belt_Array.range(353096, 843212), 0, (function (acc, item) {
            var match = meetsRequirements(item);
            if (match) {
              return acc + 1 | 0;
            } else {
              return acc;
            }
          })));

var part2 = "Part 2: " + String(Belt_Array.reduce(Belt_Array.range(353096, 843212), 0, (function (acc, item) {
            var match = meetsRequirementsPt2(item);
            if (match) {
              return acc + 1 | 0;
            } else {
              return acc;
            }
          })));

function Day4(Props) {
  return React.createElement("div", undefined, React.createElement("div", undefined, part1), React.createElement("div", undefined, part2));
}

var lower = 353096;

var higher = 843212;

var make = Day4;

exports.lower = lower;
exports.higher = higher;
exports.neverDecreases = neverDecreases;
exports.twoAdjacent = twoAdjacent;
exports.getIndexesOfNewDigits = getIndexesOfNewDigits;
exports.exactlyTwoAdjacent = exactlyTwoAdjacent;
exports.meetsRequirements = meetsRequirements;
exports.meetsRequirementsPt2 = meetsRequirementsPt2;
exports.part1 = part1;
exports.part2 = part2;
exports.make = make;
/* part1 Not a pure module */
