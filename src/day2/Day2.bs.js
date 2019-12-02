'use strict';

var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");
var Input2$ReasonReactExamples = require("./Input2.bs.js");

var UnknownInstruction = Caml_exceptions.create("Day2-ReasonReactExamples.UnknownInstruction");

function compute(_ip, program) {
  while(true) {
    var ip = _ip;
    var match = Caml_array.caml_array_get(program, ip);
    var switcher = match - 1 | 0;
    if (switcher === 0 || switcher === 1) {
      if (switcher !== 0) {
        var x = Caml_array.caml_array_get(program, ip + 1 | 0);
        var y = Caml_array.caml_array_get(program, ip + 2 | 0);
        var z = Caml_array.caml_array_get(program, ip + 3 | 0);
        Caml_array.caml_array_set(program, z, Caml_int32.imul(Caml_array.caml_array_get(program, x), Caml_array.caml_array_get(program, y)));
        _ip = ip + 4 | 0;
        continue ;
      } else {
        var x$1 = Caml_array.caml_array_get(program, ip + 1 | 0);
        var y$1 = Caml_array.caml_array_get(program, ip + 2 | 0);
        var z$1 = Caml_array.caml_array_get(program, ip + 3 | 0);
        Caml_array.caml_array_set(program, z$1, Caml_array.caml_array_get(program, x$1) + Caml_array.caml_array_get(program, y$1) | 0);
        _ip = ip + 4 | 0;
        continue ;
      }
    } else if (switcher !== 98) {
      console.log(/* tuple */[
            "Unknown instruction:",
            Caml_array.caml_array_get(program, ip),
            "at position",
            ip
          ]);
      throw UnknownInstruction;
    } else {
      return /* () */0;
    }
  };
}

function tests(param) {
  var a = /* array */[
    1,
    0,
    0,
    0,
    99
  ];
  var b = /* array */[
    2,
    0,
    0,
    0,
    99
  ];
  compute(0, a);
  if (Caml_obj.caml_notequal(a, b)) {
    console.log("Test 1: ", Caml_obj.caml_equal(a, b));
  }
  var a$1 = /* array */[
    2,
    3,
    0,
    3,
    99
  ];
  var b$1 = /* array */[
    2,
    3,
    0,
    6,
    99
  ];
  compute(0, a$1);
  if (Caml_obj.caml_notequal(a$1, b$1)) {
    console.log("Test 2: ", Caml_obj.caml_equal(a$1, b$1));
  }
  var a$2 = /* array */[
    2,
    4,
    4,
    5,
    99,
    0
  ];
  var b$2 = /* array */[
    2,
    4,
    4,
    5,
    99,
    9801
  ];
  compute(0, a$2);
  if (Caml_obj.caml_notequal(a$2, b$2)) {
    console.log("Test 3: ", Caml_obj.caml_equal(a$2, b$2));
  }
  var a$3 = /* array */[
    1,
    1,
    1,
    4,
    99,
    5,
    6,
    0,
    99
  ];
  var b$3 = /* array */[
    30,
    1,
    1,
    4,
    2,
    5,
    6,
    0,
    99
  ];
  compute(0, a$3);
  if (Caml_obj.caml_notequal(a$3, b$3)) {
    console.log("Test 4: ", Caml_obj.caml_equal(a$3, b$3));
    return /* () */0;
  } else {
    return 0;
  }
}

tests(/* () */0);

var program_array = Belt_List.toArray(Input2$ReasonReactExamples.input);

Caml_array.caml_array_set(program_array, 1, 12);

Caml_array.caml_array_set(program_array, 2, 2);

compute(0, program_array);

var part_1 = Caml_array.caml_array_get(program_array, 0);

function Day2(Props) {
  return React.createElement("div", undefined, "Part 1 " + (String(part_1) + ""));
}

var program = Input2$ReasonReactExamples.input;

var make = Day2;

exports.program = program;
exports.UnknownInstruction = UnknownInstruction;
exports.compute = compute;
exports.tests = tests;
exports.program_array = program_array;
exports.part_1 = part_1;
exports.make = make;
/*  Not a pure module */
