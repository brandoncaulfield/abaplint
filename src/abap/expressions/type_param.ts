import {seq, opt, alt, str, Expression, IRunnable} from "../combi";
import {Constant, FieldChain, TypeName} from "./";

export class TypeParam extends Expression {
  public getRunnable(): IRunnable {
    const def = seq(str("DEFAULT"), alt(new Constant(), new FieldChain()));

    const table = seq(alt(str("STANDARD"), str("HASHED"), str("INDEX"), str("SORTED"), str("ANY")),
                      str("TABLE"));

    const foo = seq(opt(seq(table, str("OF"))), opt(str("REF TO")));

    const typeLine = str("LINE OF");

    const ret = seq(alt(foo, typeLine),
                    new TypeName(),
                    opt(def));

    const like = seq(str("LIKE"), opt(str("LINE OF")), new FieldChain(), opt(def));

    return alt(seq(str("TYPE"), alt(table, ret)), like);
  }
}