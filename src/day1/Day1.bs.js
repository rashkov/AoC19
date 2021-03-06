'use strict';

var React = require("react");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Input1$ReasonReactExamples = require("./Input1.bs.js");

function calc_fuel_for_mass(mass) {
  return (mass / 3 | 0) - 2 | 0;
}

function sum_list(lst) {
  return Belt_List.reduce(lst, 0, (function (prim, prim$1) {
                return prim + prim$1 | 0;
              }));
}

var fuel_required = sum_list(Belt_List.map(Input1$ReasonReactExamples.input1, calc_fuel_for_mass));

function calc_additional_fuel_series(_series) {
  while(true) {
    var series = _series;
    if (series) {
      var head = series[0];
      if (calc_fuel_for_mass(head) > 0) {
        _series = /* :: */[
          calc_fuel_for_mass(head),
          series
        ];
        continue ;
      } else {
        return series;
      }
    } else {
      return /* [] */0;
    }
  };
}

var total_fuel = sum_list(Belt_List.map(Belt_List.map(Belt_List.map(Input1$ReasonReactExamples.input1, calc_fuel_for_mass), (function (fuel_for_mass) {
                return calc_additional_fuel_series(/* :: */[
                            fuel_for_mass,
                            /* [] */0
                          ]);
              })), sum_list));

function Day1(Props) {
  var fuel_required_str = String(fuel_required);
  var total_fuel_str = String(total_fuel);
  return React.createElement("div", undefined, React.createElement("div", undefined, "Fuel Required (part 1): " + (String(fuel_required_str) + "")), React.createElement("div", undefined, "Total Fuel Required (part 2): " + (String(total_fuel_str) + "")));
}

var module_masses = Input1$ReasonReactExamples.input1;

var make = Day1;

exports.module_masses = module_masses;
exports.calc_fuel_for_mass = calc_fuel_for_mass;
exports.sum_list = sum_list;
exports.fuel_required = fuel_required;
exports.calc_additional_fuel_series = calc_additional_fuel_series;
exports.total_fuel = total_fuel;
exports.make = make;
/* fuel_required Not a pure module */
