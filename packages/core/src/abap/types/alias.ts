import {Identifier} from "../4_file_information/_identifier";
import {Token} from "../1_lexer/tokens/_token";
import {Visibility} from "../4_file_information/visibility";

export class Alias extends Identifier {
  private readonly visibility: Visibility;
  private readonly component: string;

  public constructor(token: Token, visibility: Visibility, component: string, filename: string) {
    super(token, filename);
    this.component = component;
    this.visibility = visibility;
  }

  public getComponent(): string {
    return this.component;
  }

  public getVisibility(): Visibility {
    return this.visibility;
  }
}