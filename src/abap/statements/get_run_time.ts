import {Statement} from "./_statement";
import {verNot, str, seq, IRunnable} from "../combi";
import {Target} from "../expressions";
import {Version} from "../../version";

export class GetRunTime extends Statement {

  public getMatcher(): IRunnable {
    const ret = seq(str("GET RUN TIME FIELD"), new Target());

    return verNot(Version.Cloud, ret);
  }

}