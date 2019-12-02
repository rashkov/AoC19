let module_masses = Input1.input1;

type nonempty('a) =
  | First('a)
  | ::('a, nonempty('a));

/* Fuel required to launch a given module is based on its mass.
   Specifically, to find the fuel required for a module, take its mass,
   divide by three, round down, and subtract 2. */
let calc_fuel_for_mass = mass => mass / 3 - 2;
let sum_list = lst => lst->Belt.List.reduce(0, (+));
let fuel_required = List.map(calc_fuel_for_mass, module_masses)->sum_list;

/* Part 2 -- Calculate additional fuel required to carry our fuel */
let rec calc_additional_fuel_series = (series: list(int)) => {
  /* let latest_series_item = calc_fuel_for_mass(head); */
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
let additional_fuel = calc_additional_fuel_series([calc_fuel_for_mass(fuel_required)])->sum_list;
let total_fuel = fuel_required + additional_fuel;

[@react.component]
let make = () => {
  let fuel_required_str = fuel_required->Belt.Int.toString;
  let total_fuel_str = total_fuel->Belt.Int.toString;
  <div>
    <div> {j|Fuel Required (part 1): $(fuel_required_str)|j}->ReasonReact.string </div>
    <div> {j|Total Fuel Required (part 2): $(total_fuel_str)|j}->ReasonReact.string </div>
  </div>;
};
