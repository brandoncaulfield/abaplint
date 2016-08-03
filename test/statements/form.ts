import {statementType} from "../utils";
import * as Statements from "../../src/statements/";

let tests = [
  "FORM name TABLES tt_fields TYPE ty_sval_tt USING pv_code TYPE clike CHANGING cs_error TYPE svale RAISING lcx_exception.",
  "FORM exit RAISING lcx_exception.",
];

statementType(tests, "FORM", Statements.Form);