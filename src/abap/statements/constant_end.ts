import {Statement} from "./_statement";
import {str, seq, IRunnable} from "../combi";
import {NamespaceSimpleName} from "../expressions";

export class ConstantEnd extends Statement {

  public getMatcher(): IRunnable {
    const ret = seq(str("CONSTANTS"), str("END"), str("OF"), new NamespaceSimpleName());

    return ret;
  }

}