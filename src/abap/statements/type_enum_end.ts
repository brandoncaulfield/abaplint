import {Statement} from "./_statement";
import {str, opt, seq, IRunnable} from "../combi";
import {NamespaceSimpleName} from "../expressions";

export class TypeEnumEnd extends Statement {

  public getMatcher(): IRunnable {
    const structure = seq(str("STRUCTURE"), new NamespaceSimpleName());

    const em = seq(str("ENUM"), new NamespaceSimpleName(), opt(structure));

    const end = seq(str("END OF"), em);

    const ret = seq(str("TYPES"), end);

    return ret;
  }

}