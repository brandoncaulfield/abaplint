import {statementType} from "../_utils";
import * as Statements from "../../../src/abap/statements/";

const tests = [
  "CLASS zcl_foo_super DEFINITION LOAD.",
];

statementType(tests, "CLASS Definition Load", Statements.ClassDefinitionLoad);