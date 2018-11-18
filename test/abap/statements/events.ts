import {statementType} from "../_utils";
import * as Statements from "../../../src/abap/statements/";

const tests = [
  "EVENTS foobar.",
  "events CHANGE_PRESSED exporting value(index) type i.",
  "class-events foo exporting value(CONTEXT) type blah.",
  "EVENTS checkbox_click EXPORTING VALUE(ev_value) TYPE abap_bool OPTIONAL.",
];

statementType(tests, "EVENTS", Statements.Events);