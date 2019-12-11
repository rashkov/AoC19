type direction =
  | Up
  | Down
  | Left
  | Right;
type move = {
  direction,
  distance: int,
};
type coord = {
  x: int,
  y: int,
  steps: int /* Number of steps taken to reach this position */
};
type line_id = int;
type touches = list((line_id, coord));
exception UnknownDirectionInput;

let tag_coords_with_line_id = (coords: list(coord), line_id: line_id) => {
  coords->Belt.List.map(coord => (coord, line_id));
};
let get_position_after_move = (start_coord: coord, move: move) => {
  let steps = start_coord.steps + move.distance;
  switch (move.direction) {
  | Right => {x: start_coord.x + move.distance, y: start_coord.y, steps}
  | Left => {x: start_coord.x - move.distance, y: start_coord.y, steps}
  | Up => {x: start_coord.x, y: start_coord.y + move.distance, steps}
  | Down => {x: start_coord.x, y: start_coord.y - move.distance, steps}
  };
};
let rec range = (a, b) => {
  let r = a - b;
  if (r == 0) {
    [b];
  } else if (r < 0) {
    [a, ...range(a + 1, b)];
  } else {
    [a, ...range(a - 1, b)];
  };
};
let map_move_to_coords = (start_coord: coord, move: move) => {
  switch (move.direction) {
  | Right =>
    let start = start_coord.x + 1;
    let stop = start_coord.x + move.distance;
    range(start, stop)
    ->Belt.List.mapWithIndex((idx, x) =>
        {x, y: start_coord.y, steps: start_coord.steps + idx + 1}
      );
  | Left =>
    let start = start_coord.x - 1;
    let stop = start_coord.x - move.distance;
    range(start, stop)
    ->Belt.List.mapWithIndex((idx, x) =>
        {x, y: start_coord.y, steps: start_coord.steps + idx + 1}
      );
  | Up =>
    let start = start_coord.y + 1;
    let stop = start_coord.y + move.distance;
    range(start, stop)
    ->Belt.List.mapWithIndex((idx, y) =>
        {x: start_coord.x, y, steps: start_coord.steps + idx + 1}
      );
  | Down =>
    let start = start_coord.y - 1;
    let stop = start_coord.y - move.distance;
    range(start, stop)
    ->Belt.List.mapWithIndex((idx, y) =>
        {x: start_coord.x, y, steps: start_coord.steps + idx + 1}
      );
  };
};
let map_move_list_to_coords = (moves: list(move)) => {
  let res: (coord, list(coord)) =
    Belt.List.reduce(
      moves,
      ({x: 0, y: 0, steps: 0}, []),
      ((position: coord, coords: list(coord)), move) => {
        let new_coords = map_move_to_coords(position, move);
        let new_position = get_position_after_move(position, move);
        /* switch (move.direction) { */
        /* | Up => Js.log(("up", position.x, position.y, move.distance)) */
        /* | Down => Js.log(("down", position.x, position.y, move.distance)) */
        /* | Left => Js.log(("left", position.x, position.y, move.distance)) */
        /* | Right => Js.log(("right", position.x, position.y, move.distance)) */
        /* }; */
        /* Belt.List.forEach(new_coords, coord => {Js.log2("new coord: ", (coord.x, coord.y))}); */
        (new_position, Belt.List.concat(new_coords, coords));
      },
    );
  snd(res);
};
let map_str_to_move: string => move =
  move_str => {
    let direction =
      switch (move_str.[0]) {
      | 'R' => Right
      | 'L' => Left
      | 'U' => Up
      | 'D' => Down
      | _ => raise(UnknownDirectionInput)
      };
    let distance = int_of_string(Js.String.sliceToEnd(~from=1, move_str));
    {direction, distance};
  };
let map_input_to_moves_list = (input: string) => {
  (input |> Js.String.split(","))->Belt.List.fromArray->Belt.List.map(map_str_to_move);
};

module CoordMap =
  Map.Make({
    type t = (int, int);
    let compare = compare;
  });

/* The following test data has collision with manhattan distance 6 */
let line1_input = "R8,U5,L5,D3";
let line2_input = "U7,R6,D4,L4";
/* let line1_input = Input3.line1_str; */
/* let line2_input = Input3.line2_str; */
let line1_tagged_coords =
  map_input_to_moves_list(line1_input)->map_move_list_to_coords->tag_coords_with_line_id(1);
let line2_tagged_coords =
  map_input_to_moves_list(line2_input)->map_move_list_to_coords->tag_coords_with_line_id(2);
let all_tagged_coords = Belt.List.concat(line1_tagged_coords, line2_tagged_coords);

let does_collide = (querying_line_id: line_id, touches: touches) => {
  Belt.List.some(touches, ((line_id, _)) => line_id != querying_line_id);
};
let (coord_map: CoordMap.t(touches), collision_touches) =
  /* a "touch" is any time a line visit a coordinate */
  Belt.List.reduce(
    all_tagged_coords,
    (CoordMap.empty, []: list(touches)),
    (acc, (coord, line_id)) => {
      let (coord_map, collision_touches) = acc;
      switch (CoordMap.find((coord.x, coord.y), coord_map)) {
      | exception Not_found =>
        let new_map = CoordMap.add((coord.x, coord.y), [(line_id, coord)], coord_map);
        (new_map, collision_touches);
      | touches when does_collide(line_id, touches) =>
        let new_map =
          CoordMap.add((coord.x, coord.y), [(line_id, coord), ...touches], coord_map);
        (new_map, [[(line_id, coord), ...touches], ...collision_touches]);
      | touches =>
        let new_map =
          CoordMap.add((coord.x, coord.y), [(line_id, coord), ...touches], coord_map);
        (new_map, collision_touches);
      };
    },
  );
let closest_collision_by_manhattan_distance = {
  Belt.List.map(collision_touches, touch => {Belt.List.reduce(touch)});
  Belt.List.map(collision_touches, collision => {collision.x + collision.coord.y})
  ->Belt.List.sort((a, b) => a - b)
  ->Belt.List.head;
};
let collision_output_manhattan_distance =
  switch (closest_collision_by_manhattan_distance) {
  | Some(collision) => "Closest collision has manhattan distance: " ++ string_of_int(collision)
  | None => "No collisions"
  };

let closest_collision_by_steps =
  Belt.List.sort(collisions, (a, b) => compare(a.steps, b.steps))->Belt.List.head;
let collision_output_steps =
  switch (closest_collision_by_steps) {
  | Some(collision) => "Closest collision by number of steps: " ++ string_of_int(collision.steps)
  | None => "No collisions"
  };

[@react.component]
let make = () => {
  <div>
    <div> collision_output_steps->ReasonReact.string </div>
    <div> collision_output_manhattan_distance->ReasonReact.string </div>
  </div>;
};
