open Belt;

let module_masses = Input1.input1;

/* Fuel required to launch a given module is based on its mass.
   Specifically, to find the fuel required for a module, take its mass,
   divide by three, round down, and subtract 2. */
let calc_fuel_for_mass = mass => mass / 3 - 2;
let sum_list = lst => lst->List.reduce(0, (+));
let fuel_required = List.map(module_masses, calc_fuel_for_mass)->sum_list;

/* Part 2 -- Calculate additional fuel required to carry our fuel */
let rec calc_additional_fuel_series = (series: list(int)) => {
  switch (series) {
  | [] => []
  | [head, ..._] =>
    if (calc_fuel_for_mass(head) > 0) {
      calc_additional_fuel_series([calc_fuel_for_mass(head), ...series]);
    } else {
      series;
    }
  };
};
let total_fuel =
  List.map(module_masses, calc_fuel_for_mass)
  ->List.map(fuel_for_mass => calc_additional_fuel_series([fuel_for_mass]))
  ->List.map(sum_list)
  ->sum_list;

[@react.component]
let make = () => {
  let fuel_required_str = fuel_required->Belt.Int.toString;
  let total_fuel_str = total_fuel->Belt.Int.toString;
  <div>
    <div> {j|Fuel Required (part 1): $(fuel_required_str)|j}->ReasonReact.string </div>
    <div> {j|Total Fuel Required (part 2): $(total_fuel_str)|j}->ReasonReact.string </div>
  </div>;
};

/* TODO: Explore use of this nonempty data type to exclude the [] => [] case
   in calc_additional_fuel_series() */
/* https://stackoverflow.com/questions/58868493/how-to-represent-a-non-empty-list-type */
/* type nonempty('a) = */
/*   | First('a) */
/*   | ::('a, nonempty('a)); */
