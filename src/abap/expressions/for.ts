import {seq, opt, str, alt, ver, plus, Expression, IRunnable} from "../combi";
import {Source, Field, FieldSymbol, Cond} from "./";
import {Version} from "../../version";
import {Let} from "./let";

export class For extends Expression {
  public getRunnable(): IRunnable {
    const where = seq(str("WHERE"), new Cond());
    const inn = seq(str("IN"), new Source(), opt(where));
    const then = seq(str("THEN"), new Source());
    const whil = seq(alt(str("UNTIL"), str("WHILE")), new Cond());
    const itera = seq(str("="), new Source(), opt(then), whil);
    const f = seq(str("FOR"), alt(new Field(), new FieldSymbol()), alt(itera, inn));
    return ver(Version.v740sp05, plus(seq(f, opt(new Let()))));
  }
}