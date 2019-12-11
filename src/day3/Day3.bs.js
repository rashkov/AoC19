'use strict';

var $$Map = require("bs-platform/lib/js/map.js");
var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var Caml_string = require("bs-platform/lib/js/caml_string.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");
var Caml_js_exceptions = require("bs-platform/lib/js/caml_js_exceptions.js");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var Input3$ReasonReactExamples = require("./Input3.bs.js");

var UnknownDirectionInput = Caml_exceptions.create("Day3-ReasonReactExamples.UnknownDirectionInput");

var CollisionFilterFailed = Caml_exceptions.create("Day3-ReasonReactExamples.CollisionFilterFailed");

function tag_coords_with_line_id(coords, line_id) {
  return Belt_List.map(coords, (function (coord) {
                return /* tuple */[
                        coord,
                        line_id
                      ];
              }));
}

function get_position_after_move(start_coord, move) {
  var steps = start_coord[/* steps */2] + move[/* distance */1] | 0;
  var match = move[/* direction */0];
  switch (match) {
    case /* Up */0 :
        return /* record */[
                /* x */start_coord[/* x */0],
                /* y */start_coord[/* y */1] + move[/* distance */1] | 0,
                /* steps */steps
              ];
    case /* Down */1 :
        return /* record */[
                /* x */start_coord[/* x */0],
                /* y */start_coord[/* y */1] - move[/* distance */1] | 0,
                /* steps */steps
              ];
    case /* Left */2 :
        return /* record */[
                /* x */start_coord[/* x */0] - move[/* distance */1] | 0,
                /* y */start_coord[/* y */1],
                /* steps */steps
              ];
    case /* Right */3 :
        return /* record */[
                /* x */start_coord[/* x */0] + move[/* distance */1] | 0,
                /* y */start_coord[/* y */1],
                /* steps */steps
              ];
    
  }
}

function range(a, b) {
  var r = a - b | 0;
  if (r === 0) {
    return /* :: */[
            b,
            /* [] */0
          ];
  } else if (r < 0) {
    return /* :: */[
            a,
            range(a + 1 | 0, b)
          ];
  } else {
    return /* :: */[
            a,
            range(a - 1 | 0, b)
          ];
  }
}

function map_move_to_coords(start_coord, move) {
  var match = move[/* direction */0];
  switch (match) {
    case /* Up */0 :
        var start = start_coord[/* y */1] + 1 | 0;
        var stop = start_coord[/* y */1] + move[/* distance */1] | 0;
        return Belt_List.mapWithIndex(range(start, stop), (function (idx, y) {
                      return /* record */[
                              /* x */start_coord[/* x */0],
                              /* y */y,
                              /* steps */(start_coord[/* steps */2] + idx | 0) + 1 | 0
                            ];
                    }));
    case /* Down */1 :
        var start$1 = start_coord[/* y */1] - 1 | 0;
        var stop$1 = start_coord[/* y */1] - move[/* distance */1] | 0;
        return Belt_List.mapWithIndex(range(start$1, stop$1), (function (idx, y) {
                      return /* record */[
                              /* x */start_coord[/* x */0],
                              /* y */y,
                              /* steps */(start_coord[/* steps */2] + idx | 0) + 1 | 0
                            ];
                    }));
    case /* Left */2 :
        var start$2 = start_coord[/* x */0] - 1 | 0;
        var stop$2 = start_coord[/* x */0] - move[/* distance */1] | 0;
        return Belt_List.mapWithIndex(range(start$2, stop$2), (function (idx, x) {
                      return /* record */[
                              /* x */x,
                              /* y */start_coord[/* y */1],
                              /* steps */(start_coord[/* steps */2] + idx | 0) + 1 | 0
                            ];
                    }));
    case /* Right */3 :
        var start$3 = start_coord[/* x */0] + 1 | 0;
        var stop$3 = start_coord[/* x */0] + move[/* distance */1] | 0;
        return Belt_List.mapWithIndex(range(start$3, stop$3), (function (idx, x) {
                      return /* record */[
                              /* x */x,
                              /* y */start_coord[/* y */1],
                              /* steps */(start_coord[/* steps */2] + idx | 0) + 1 | 0
                            ];
                    }));
    
  }
}

function map_move_list_to_coords(moves) {
  return Belt_List.reduce(moves, /* tuple */[
                /* record */[
                  /* x */0,
                  /* y */0,
                  /* steps */0
                ],
                /* [] */0
              ], (function (param, move) {
                  var position = param[0];
                  var new_coords = map_move_to_coords(position, move);
                  var new_position = get_position_after_move(position, move);
                  return /* tuple */[
                          new_position,
                          Belt_List.concat(new_coords, param[1])
                        ];
                }))[1];
}

function map_str_to_move(move_str) {
  var match = Caml_string.get(move_str, 0);
  var direction;
  switch (match) {
    case 68 :
        direction = /* Down */1;
        break;
    case 76 :
        direction = /* Left */2;
        break;
    case 82 :
        direction = /* Right */3;
        break;
    case 69 :
    case 70 :
    case 71 :
    case 72 :
    case 73 :
    case 74 :
    case 75 :
    case 77 :
    case 78 :
    case 79 :
    case 80 :
    case 81 :
    case 83 :
    case 84 :
        throw UnknownDirectionInput;
    case 85 :
        direction = /* Up */0;
        break;
    default:
      throw UnknownDirectionInput;
  }
  var distance = Caml_format.caml_int_of_string(move_str.slice(1));
  return /* record */[
          /* direction */direction,
          /* distance */distance
        ];
}

function map_input_to_moves_list(input) {
  return Belt_List.map(Belt_List.fromArray(input.split(",")), map_str_to_move);
}

var compare = Caml_obj.caml_compare;

var CoordMap = $$Map.Make({
      compare: compare
    });

var line1_tagged_coords = tag_coords_with_line_id(map_move_list_to_coords(map_input_to_moves_list(Input3$ReasonReactExamples.line1_str)), 1);

var line2_tagged_coords = tag_coords_with_line_id(map_move_list_to_coords(map_input_to_moves_list(Input3$ReasonReactExamples.line2_str)), 2);

var all_tagged_coords = Belt_List.concat(line1_tagged_coords, line2_tagged_coords);

function does_collide(querying_line_id, touches) {
  return Belt_List.some(touches, (function (param) {
                return param[0] !== querying_line_id;
              }));
}

var coord_map = Belt_List.reduce(all_tagged_coords, CoordMap.empty, (function (coord_map, param) {
        var line_id = param[1];
        var coord = param[0];
        var exit = 0;
        var touches;
        try {
          touches = Curry._2(CoordMap.find, /* tuple */[
                coord[/* x */0],
                coord[/* y */1]
              ], coord_map);
          exit = 1;
        }
        catch (exn){
          if (exn === Caml_builtin_exceptions.not_found) {
            return Curry._3(CoordMap.add, /* tuple */[
                        coord[/* x */0],
                        coord[/* y */1]
                      ], /* :: */[
                        /* tuple */[
                          line_id,
                          coord
                        ],
                        /* [] */0
                      ], coord_map);
          } else {
            throw exn;
          }
        }
        if (exit === 1) {
          var previous_touch_coord;
          try {
            previous_touch_coord = List.assoc(line_id, touches);
          }
          catch (exn$1){
            if (exn$1 === Caml_builtin_exceptions.not_found) {
              return Curry._3(CoordMap.add, /* tuple */[
                          coord[/* x */0],
                          coord[/* y */1]
                        ], /* :: */[
                          /* tuple */[
                            line_id,
                            coord
                          ],
                          touches
                        ], coord_map);
            } else {
              throw exn$1;
            }
          }
          if (previous_touch_coord[/* steps */2] < coord[/* steps */2]) {
            return coord_map;
          } else {
            return Curry._3(CoordMap.add, /* tuple */[
                        coord[/* x */0],
                        coord[/* y */1]
                      ], /* :: */[
                        /* tuple */[
                          line_id,
                          coord
                        ],
                        List.remove_assoc(line_id, touches)
                      ], coord_map);
          }
        }
        
      }));

var collisions_coord_map = Curry._2(CoordMap.filter, (function (param, touches) {
        return List.length(touches) === 2;
      }), coord_map);

var collision_manhattan_distances_sorted = List.sort((function (a, b) {
        return a - b | 0;
      }), Curry._3(CoordMap.fold, (function (key, param, acc) {
            return /* :: */[
                    Pervasives.abs(key[0]) + Pervasives.abs(key[1]) | 0,
                    acc
                  ];
          }), collisions_coord_map, /* [] */0));

var collision_output_manhattan_distance;

var exit = 0;

var collision;

try {
  collision = List.hd(collision_manhattan_distances_sorted);
  exit = 1;
}
catch (raw_exn){
  var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
  if (exn[0] === Caml_builtin_exceptions.failure) {
    if (exn[1] === "hd") {
      collision_output_manhattan_distance = "No collisions";
    } else {
      throw exn;
    }
  } else {
    throw exn;
  }
}

if (exit === 1) {
  collision_output_manhattan_distance = "Closest collision has manhattan distance: " + String(collision);
}

var collision_steps_sorted = List.sort(Caml_obj.caml_compare, Curry._3(CoordMap.fold, (function (param, touches, acc) {
            if (touches) {
              var match = touches[1];
              if (match) {
                if (match[1]) {
                  throw CollisionFilterFailed;
                }
                return /* :: */[
                        touches[0][1][/* steps */2] + match[0][1][/* steps */2] | 0,
                        acc
                      ];
              } else {
                throw CollisionFilterFailed;
              }
            } else {
              throw CollisionFilterFailed;
            }
          }), collisions_coord_map, /* [] */0));

var collision_output_steps;

var exit$1 = 0;

var collision$1;

try {
  collision$1 = List.hd(collision_steps_sorted);
  exit$1 = 1;
}
catch (raw_exn$1){
  var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
  if (exn$1[0] === Caml_builtin_exceptions.failure) {
    if (exn$1[1] === "hd") {
      collision_output_steps = "No collisions";
    } else {
      throw exn$1;
    }
  } else {
    throw exn$1;
  }
}

if (exit$1 === 1) {
  collision_output_steps = "Closest collision by number of steps: " + String(collision$1);
}

function Day3(Props) {
  return React.createElement("div", undefined, React.createElement("div", undefined, collision_output_manhattan_distance), React.createElement("div", undefined, collision_output_steps));
}

var line1_input = Input3$ReasonReactExamples.line1_str;

var line2_input = Input3$ReasonReactExamples.line2_str;

var make = Day3;

exports.UnknownDirectionInput = UnknownDirectionInput;
exports.CollisionFilterFailed = CollisionFilterFailed;
exports.tag_coords_with_line_id = tag_coords_with_line_id;
exports.get_position_after_move = get_position_after_move;
exports.range = range;
exports.map_move_to_coords = map_move_to_coords;
exports.map_move_list_to_coords = map_move_list_to_coords;
exports.map_str_to_move = map_str_to_move;
exports.map_input_to_moves_list = map_input_to_moves_list;
exports.CoordMap = CoordMap;
exports.line1_input = line1_input;
exports.line2_input = line2_input;
exports.line1_tagged_coords = line1_tagged_coords;
exports.line2_tagged_coords = line2_tagged_coords;
exports.all_tagged_coords = all_tagged_coords;
exports.does_collide = does_collide;
exports.coord_map = coord_map;
exports.collisions_coord_map = collisions_coord_map;
exports.collision_manhattan_distances_sorted = collision_manhattan_distances_sorted;
exports.collision_output_manhattan_distance = collision_output_manhattan_distance;
exports.collision_steps_sorted = collision_steps_sorted;
exports.collision_output_steps = collision_output_steps;
exports.make = make;
/* CoordMap Not a pure module */
