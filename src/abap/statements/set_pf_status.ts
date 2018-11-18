import {Statement} from "./_statement";
import {verNot, str, seq, opt, per, IRunnable} from "../combi";
import {Source} from "../expressions";
import {Version} from "../../version";

export class SetPFStatus extends Statement {

  public getMatcher(): IRunnable {
    const program = seq(str("OF PROGRAM"), new Source());

    const options = per(program,
                        str("IMMEDIATELY"),
                        seq(str("EXCLUDING"), new Source()));

    const ret = seq(str("SET PF-STATUS"),
                    new Source(),
                    opt(options));

    return verNot(Version.Cloud, ret);
  }

}