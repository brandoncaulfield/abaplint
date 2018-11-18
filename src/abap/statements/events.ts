import {Statement} from "./_statement";
import {str, seq, opt, alt, plus, IRunnable} from "../combi";
import {MethodParam, Field} from "../expressions";

export class Events extends Statement {

  public getMatcher(): IRunnable {
    const par = seq(new MethodParam(), opt(str("OPTIONAL")));

    const exporting = seq(str("EXPORTING"), plus(par));

    return seq(alt(str("CLASS-EVENTS"), str("EVENTS")), new Field(), opt(exporting));
  }

}