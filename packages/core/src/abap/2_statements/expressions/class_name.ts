import {regex as reg, Expression} from "../combi";
import {IStatementRunnable} from "../statement_runnable";

export class ClassName extends Expression {
  public getRunnable(): IStatementRunnable {
    return reg(/^\w*(\/\w{3,}\/)?\w+$/);
  }
}