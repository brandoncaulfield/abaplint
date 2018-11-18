import {Statement} from "./_statement";
import {str, seq, alt, opt, IRunnable, per} from "../combi";
import {NamespaceSimpleName, FieldLength, Type, Value, Length, Decimals} from "../expressions";

export class Constant extends Statement {

  public getMatcher(): IRunnable {
    const def = seq(new NamespaceSimpleName(),
                    opt(new FieldLength()),
                    per(new Type(), new Value(), new Decimals(), new Length()));

    const ret = seq(alt(str("CONSTANT"), str("CONSTANTS")), def);

    return ret;
  }

}