import {seq, opt, tok, alt, str, star, Expression, IRunnable} from "../combi";
import {WParenLeftW, WParenRightW, WParenRight} from "../tokens/";
import {Compare} from "./";

export class Cond extends Expression {
  public getRunnable(): IRunnable {
    const operator = alt(str("AND"), str("OR"));

    const another = seq(opt(str("NOT")),
                        tok(WParenLeftW),
                        new Cond(),
                        alt(tok(WParenRightW), tok(WParenRight)));

    const cnd = alt(new Compare(), another);

    const ret = seq(cnd, star(seq(operator, cnd)));

    return ret;
  }
}