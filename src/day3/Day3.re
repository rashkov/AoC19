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
};
type line_id = int;
exception UnknownDirectionInput;

let tag_coords_with_line_id = (coords: list(coord), line_id: line_id) => {
  coords->Belt.List.map(coord => (coord, line_id));
};
let get_position_after_move = (start_coord: coord, move: move) => {
  switch (move.direction) {
  | Right => {x: start_coord.x + move.distance, y: start_coord.y}
  | Left => {x: start_coord.x - move.distance, y: start_coord.y}
  | Up => {x: start_coord.x, y: start_coord.y + move.distance}
  | Down => {x: start_coord.x, y: start_coord.y - move.distance}
  };
};
let map_move_to_coords = (start_coord: coord, move: move) => {
  switch (move.direction) {
  | Right =>
    let start = start_coord.x + 1;
    let stop = start_coord.x + move.distance;
    Belt.Array.range(min(start, stop), max(start, stop))
    ->Belt.List.fromArray
    ->Belt.List.map(x => {x, y: start_coord.y});
  | Left =>
    let start = start_coord.x - 1;
    let stop = start_coord.x - move.distance;
    Belt.Array.range(min(start, stop), max(start, stop))
    ->Belt.List.fromArray
    ->Belt.List.map(x => {x, y: start_coord.y});
  | Up =>
    let start = start_coord.y + 1;
    let stop = start_coord.y + move.distance;
    Belt.Array.range(min(start, stop), max(start, stop))
    ->Belt.List.fromArray
    ->Belt.List.map(y => {x: start_coord.x, y});
  | Down =>
    let start = start_coord.y - 1;
    let stop = start_coord.y - move.distance;
    Belt.Array.range(min(start, stop), max(start, stop))
    ->Belt.List.fromArray
    ->Belt.List.map(y => {x: start_coord.x, y});
  };
};
let map_move_list_to_coords = (moves: list(move)) => {
  let res: (coord, list(coord)) =
    Belt.List.reduce(
      moves,
      ({x: 0, y: 0}, []),
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
/* let line1_input = "R8,U5,L5,D3"; */
/* let line2_input = "U7,R6,D4,L4"; */
let line1_input = Input3.line1_str;
let line2_input = Input3.line2_str;
let line1_tagged_coords =
  map_input_to_moves_list(line1_input)->map_move_list_to_coords->tag_coords_with_line_id(1);
let line2_tagged_coords =
  map_input_to_moves_list(line2_input)->map_move_list_to_coords->tag_coords_with_line_id(2);
let all_tagged_coords = Belt.List.concat(line1_tagged_coords, line2_tagged_coords);

let does_collide = (querying_line_id, line_ids) => {
  Belt.List.some(line_ids, line_id => line_id != querying_line_id);
};
let (coord_map, collisions) =
  Belt.List.reduce(
    all_tagged_coords,
    (CoordMap.empty, []),
    (acc, (coord, line_id)) => {
      let (coord_map, collisions) = acc;
      switch (CoordMap.find((coord.x, coord.y), coord_map)) {
      | exception Not_found =>
        let new_map = CoordMap.add((coord.x, coord.y), [line_id], coord_map);
        (new_map, collisions);
      | line_ids =>
        does_collide(line_id, line_ids)
          ? {
            let new_map = CoordMap.add((coord.x, coord.y), [line_id, ...line_ids], coord_map);
            (new_map, [coord, ...collisions]);
          }
          : (coord_map, collisions)
      };
    },
  );
let closest_collision =
  Belt.List.map(collisions, collision_coord => {collision_coord.x + collision_coord.y})
  ->Belt.List.sort((a, b) => a - b)
  ->Belt.List.head;
let collision_output =
  switch (closest_collision) {
  | Some(collision) => "Closest collision has manhattan distance: " ++ string_of_int(collision)
  | None => "No collisions"
  };

[@react.component]
let make = () => {
  <div> collision_output->ReasonReact.string </div>;
};
