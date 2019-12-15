let lower = 353096;
let higher = 843212;

let neverDecreases = (num: int) => {
  let digitArray = string_of_int(num) |> Js.String.split("");
  let ret = ref(true);
  digitArray->Belt.Array.forEachWithIndex((idx, digit) => {
    let prevDigitIdx = idx - 1;
    if (prevDigitIdx >= 0) {
      if (digitArray[prevDigitIdx] > digit) {
        ret := false;
      };
    };
  });
  ret^;
};

let twoAdjacent = (num: int) => {
  let digitArray = string_of_int(num) |> Js.String.split("");
  let ret = ref(false);
  digitArray->Belt.Array.forEachWithIndex((idx, digit) => {
    let prevDigitIdx = idx - 1;
    if (prevDigitIdx >= 0) {
      if (digitArray[prevDigitIdx] == digit) {
        ret := true;
      };
    };
  });
  ret^;
};

let getIndexesOfNewDigits = num => {
  let startOfNewDigitIndexes = ref([|0|]);
  let digitArray = string_of_int(num) |> Js.String.split("");
  digitArray->Belt.Array.forEachWithIndex((idx, digit) => {
    let prevDigitIdx = idx - 1;
    if (prevDigitIdx >= 0) {
      if (digitArray[prevDigitIdx] != digit) {
        startOfNewDigitIndexes :=
          Belt.Array.concat(startOfNewDigitIndexes^, [|idx|]);
      };
    };
  });
  startOfNewDigitIndexes :=
    Belt.Array.concat(startOfNewDigitIndexes^, [|Array.length(digitArray)|]);
  startOfNewDigitIndexes^;
};

let exactlyTwoAdjacent = (num: int) => {
  let startOfNewDigitIndexes = getIndexesOfNewDigits(num);
  let ret = ref(false);
  Belt.Array.range(1, Array.length(startOfNewDigitIndexes) - 1)
  ->Belt.Array.forEach(idx =>
      if (startOfNewDigitIndexes[idx] - startOfNewDigitIndexes[idx - 1] == 2) {
        ret := true;
      }
    )
  ->ignore;
  ret^;
};

let meetsRequirements = num => neverDecreases(num) && twoAdjacent(num);
let meetsRequirementsPt2 = num =>
  neverDecreases(num) && exactlyTwoAdjacent(num);

let part1 =
  "Part 1: "
  ++ Belt.Array.range(lower, higher)
     ->Belt.Array.reduce(0, (acc, item) =>
         meetsRequirements(item) ? acc + 1 : acc
       )
     ->string_of_int;

let part2 =
  "Part 2: "
  ++ Belt.Array.range(lower, higher)
     ->Belt.Array.reduce(0, (acc, item) =>
         meetsRequirementsPt2(item) ? acc + 1 : acc
       )
     ->string_of_int;

[@react.component]
let make = () => {
  <div>
    <div> part1->ReasonReact.string </div>
    <div> part2->ReasonReact.string </div>
  </div>;
};
