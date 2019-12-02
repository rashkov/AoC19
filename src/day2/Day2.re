let program = Input2.input;

exception UnknownInstruction;
/*
   Program:
   A program is a zero-indexed array of integers, including three opcodes listed below. Step through the program, executing opcodes until reaching opcode 99 (halt).
   Opcodes:
   99 - terminate program
   1 x y z - store program[x]+program[y] at position z
   2 x y z - store program[x]*program[y] at position z

   Test programs:
   1,0,0,0,99 becomes 2,0,0,0,99 (1 + 1 = 2).
   2,3,0,3,99 becomes 2,3,0,6,99 (3 * 2 = 6).
   2,4,4,5,99,0 becomes 2,4,4,5,99,9801 (99 * 99 = 9801).
   1,1,1,4,99,5,6,0,99 becomes 30,1,1,4,2,5,6,0,99

   Actual program:
   Read in the program and replace position 1 with value 12 and position 2 with value 2. After running this program, what is the value at position 0?
 */

/* compute() executes a program
   ip: int -- Instruction Pointer - Position of the next instruction to be executed
   */
let rec compute = (ip: int, program: array(int)) => {
  switch (program[ip]) {
  | 1 =>
    let x = program[ip + 1];
    let y = program[ip + 2];
    let z = program[ip + 3];
    program[z] = program[x] + program[y];
    /* Js.log2("Adding", (program, program[ip + 3], program[ip + 1], program[ip + 2])); */
    compute(ip + 4, program);
  | 2 =>
    let x = program[ip + 1];
    let y = program[ip + 2];
    let z = program[ip + 3];
    program[z] = program[x] * program[y];
    compute(ip + 4, program);
  | 99 => ()
  | _ =>
    Js.log(("Unknown instruction:", program[ip], "at position", ip));
    raise(UnknownInstruction);
  };
};

let tests = () => {
  /* 1,0,0,0,99 becomes 2,0,0,0,99 (1 + 1 = 2). */
  let a = [|1, 0, 0, 0, 99|];
  let b = [|2, 0, 0, 0, 99|];
  compute(0, a);
  if (a != b) {
    Js.log2("Test 1: ", a == b);
  };

  /* 2,3,0,3,99 becomes 2,3,0,6,99 (3 * 2 = 6). */
  let a = [|2, 3, 0, 3, 99|];
  let b = [|2, 3, 0, 6, 99|];
  compute(0, a);
  if (a != b) {
    Js.log2("Test 2: ", a == b);
  };

  /* 2,4,4,5,99,0 becomes 2,4,4,5,99,9801 (99 * 99 = 9801). */
  let a = [|2, 4, 4, 5, 99, 0|];
  let b = [|2, 4, 4, 5, 99, 9801|];
  compute(0, a);
  if (a != b) {
    Js.log2("Test 3: ", a == b);
  };

  /* 1,1,1,4,99,5,6,0,99 becomes 30,1,1,4,2,5,6,0,99 */
  let a = [|1, 1, 1, 4, 99, 5, 6, 0, 99|];
  let b = [|30, 1, 1, 4, 2, 5, 6, 0, 99|];
  compute(0, a);
  if (a != b) {
    Js.log2("Test 4: ", a == b);
  };
};
tests();

/* Calculate part 1 */
let program_array = Belt.List.toArray(program);
program_array[1] = 12;
program_array[2] = 2;
compute(0, program_array);
let part_1 = program_array[0];

[@react.component]
let make = () => {
  <div> {j|Part 1 $(part_1)|j}->ReasonReact.string </div>;
};
