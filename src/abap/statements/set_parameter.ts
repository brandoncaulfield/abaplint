import {Statement} from "./_statement";
import {verNot, str, seq, IRunnable} from "../combi";
import {Source} from "../expressions";
import {Version} from "../../version";

export class SetParameter extends Statement {

  public getMatcher(): IRunnable {
    const ret = seq(str("SET PARAMETER ID"),
                    new Source(),
                    str("FIELD"),
                    new Source());

    return verNot(Version.Cloud, ret);
  }

}