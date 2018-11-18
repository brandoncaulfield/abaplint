import {Statement} from "./_statement";
import {verNot, str, seq, opt, alt, IRunnable} from "../combi";
import {Field, Source} from "../expressions";
import {Version} from "../../version";

export class Break extends Statement {

  public getMatcher(): IRunnable {
    const id = seq(str("ID"), new Field());
    const next = str("AT NEXT APPLICATION STATEMENT");
    const log = new Source();

    const ret = alt(seq(str("BREAK-POINT"), opt(alt(id, next, log))),
                    seq(str("BREAK"), new Field()));

    return verNot(Version.Cloud, ret);
  }

}