'use strict';

var $$Map = require("bs-platform/lib/js/map.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var Caml_string = require("bs-platform/lib/js/caml_string.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var Input3$ReasonReactExamples = require("./Input3.bs.js");

var UnknownDirectionInput = Caml_exceptions.create("Day3-ReasonReactExamples.UnknownDirectionInput");

function tag_coords_with_line_id(coords, line_id) {
  return Belt_List.map(coords, (function (coord) {
                return /* tuple */[
                        coord,
                        line_id
                      ];
              }));
}

function get_position_after_move(start_coord, move) {
  var match = move[/* direction */0];
  switch (match) {
    case /* Up */0 :
        return /* record */[
                /* x */start_coord[/* x */0],
                /* y */start_coord[/* y */1] + move[/* distance */1] | 0
              ];
    case /* Down */1 :
        return /* record */[
                /* x */start_coord[/* x */0],
                /* y */start_coord[/* y */1] - move[/* distance */1] | 0
              ];
    case /* Left */2 :
        return /* record */[
                /* x */start_coord[/* x */0] - move[/* distance */1] | 0,
                /* y */start_coord[/* y */1]
              ];
    case /* Right */3 :
        return /* record */[
                /* x */start_coord[/* x */0] + move[/* distance */1] | 0,
                /* y */start_coord[/* y */1]
              ];
    
  }
}

function map_move_to_coords(start_coord, move) {
  var match = move[/* direction */0];
  switch (match) {
    case /* Up */0 :
        var start = start_coord[/* y */1] + 1 | 0;
        var stop = start_coord[/* y */1] + move[/* distance */1] | 0;
        return Belt_List.map(Belt_List.fromArray(Belt_Array.range(start < stop ? start : stop, start > stop ? start : stop)), (function (y) {
                      return /* record */[
                              /* x */start_coord[/* x */0],
                              /* y */y
                            ];
                    }));
    case /* Down */1 :
        var start$1 = start_coord[/* y */1] - 1 | 0;
        var stop$1 = start_coord[/* y */1] - move[/* distance */1] | 0;
        return Belt_List.map(Belt_List.fromArray(Belt_Array.range(start$1 < stop$1 ? start$1 : stop$1, start$1 > stop$1 ? start$1 : stop$1)), (function (y) {
                      return /* record */[
                              /* x */start_coord[/* x */0],
                              /* y */y
                            ];
                    }));
    case /* Left */2 :
        var start$2 = start_coord[/* x */0] - 1 | 0;
        var stop$2 = start_coord[/* x */0] - move[/* distance */1] | 0;
        return Belt_List.map(Belt_List.fromArray(Belt_Array.range(start$2 < stop$2 ? start$2 : stop$2, start$2 > stop$2 ? start$2 : stop$2)), (function (x) {
                      return /* record */[
                              /* x */x,
                              /* y */start_coord[/* y */1]
                            ];
                    }));
    case /* Right */3 :
        var start$3 = start_coord[/* x */0] + 1 | 0;
        var stop$3 = start_coord[/* x */0] + move[/* distance */1] | 0;
        return Belt_List.map(Belt_List.fromArray(Belt_Array.range(start$3 < stop$3 ? start$3 : stop$3, start$3 > stop$3 ? start$3 : stop$3)), (function (x) {
                      return /* record */[
                              /* x */x,
                              /* y */start_coord[/* y */1]
                            ];
                    }));
    
  }
}

function map_move_list_to_coords(moves) {
  return Belt_List.reduce(moves, /* tuple */[
                /* record */[
                  /* x */0,
                  /* y */0
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

function does_collide(querying_line_id, line_ids) {
  return Belt_List.some(line_ids, (function (line_id) {
                return Caml_obj.caml_notequal(line_id, querying_line_id);
              }));
}

var match = Belt_List.reduce(all_tagged_coords, /* tuple */[
      CoordMap.empty,
      /* [] */0
    ], (function (acc, param) {
        var collisions = acc[1];
        var coord_map = acc[0];
        var line_id = param[1];
        var coord = param[0];
        var line_ids;
        try {
          line_ids = Curry._2(CoordMap.find, /* tuple */[
                coord[/* x */0],
                coord[/* y */1]
              ], coord_map);
        }
        catch (exn){
          if (exn === Caml_builtin_exceptions.not_found) {
            var new_map = Curry._3(CoordMap.add, /* tuple */[
                  coord[/* x */0],
                  coord[/* y */1]
                ], /* :: */[
                  line_id,
                  /* [] */0
                ], coord_map);
            return /* tuple */[
                    new_map,
                    collisions
                  ];
          } else {
            throw exn;
          }
        }
        var match = does_collide(line_id, line_ids);
        if (match) {
          var new_map$1 = Curry._3(CoordMap.add, /* tuple */[
                coord[/* x */0],
                coord[/* y */1]
              ], /* :: */[
                line_id,
                line_ids
              ], coord_map);
          return /* tuple */[
                  new_map$1,
                  /* :: */[
                    coord,
                    collisions
                  ]
                ];
        } else {
          return /* tuple */[
                  coord_map,
                  collisions
                ];
        }
      }));

var collisions = match[1];

var closest_collision = Belt_List.head(Belt_List.sort(Belt_List.map(collisions, (function (collision_coord) {
                return collision_coord[/* x */0] + collision_coord[/* y */1] | 0;
              })), (function (a, b) {
            return a - b | 0;
          })));

var collision_output = closest_collision !== undefined ? "Closest collision has manhattan distance: " + String(closest_collision) : "No collisions";

function Day3(Props) {
  return React.createElement("div", undefined, collision_output);
}

var line1_input = Input3$ReasonReactExamples.line1_str;

var line2_input = Input3$ReasonReactExamples.line2_str;

var coord_map = match[0];

var make = Day3;

exports.UnknownDirectionInput = UnknownDirectionInput;
exports.tag_coords_with_line_id = tag_coords_with_line_id;
exports.get_position_after_move = get_position_after_move;
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
exports.collisions = collisions;
exports.closest_collision = closest_collision;
exports.collision_output = collision_output;
exports.make = make;
/* CoordMap Not a pure module */
