'use strict';

var React = require("react");
var ReactDom = require("react-dom");
var Day1$ReasonReactExamples = require("./day1/Day1.bs.js");
var Day2$ReasonReactExamples = require("./day2/Day2.bs.js");
var Day3$ReasonReactExamples = require("./day3/Day3.bs.js");
var Day4$ReasonReactExamples = require("./day4/Day4.bs.js");
var ExampleStyles$ReasonReactExamples = require("./ExampleStyles.bs.js");

var style = document.createElement("style");

document.head.appendChild(style);

style.innerHTML = ExampleStyles$ReasonReactExamples.style;

function makeContainer(text) {
  var container = document.createElement("div");
  container.className = "container";
  var title = document.createElement("div");
  title.className = "containerTitle";
  title.innerText = text;
  var content = document.createElement("div");
  content.className = "containerContent";
  container.appendChild(title);
  container.appendChild(content);
  document.body.appendChild(container);
  return content;
}

ReactDom.render(React.createElement(Day1$ReasonReactExamples.make, { }), makeContainer("AoC Day 1"));

ReactDom.render(React.createElement(Day2$ReasonReactExamples.make, { }), makeContainer("AoC Day 2"));

ReactDom.render(React.createElement(Day3$ReasonReactExamples.make, { }), makeContainer("AoC Day 3"));

ReactDom.render(React.createElement(Day4$ReasonReactExamples.make, { }), makeContainer("AoC Day 4"));

exports.style = style;
exports.makeContainer = makeContainer;
/* style Not a pure module */
