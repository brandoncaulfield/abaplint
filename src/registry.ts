import {IObject} from "./objects/_iobject";
import {IRule} from "./rules/_irule";
import {IFile} from "./files/_ifile";
import {ABAPObject} from "./objects/_abap_object";
import {ABAPFile} from "./files";
import {Config} from "./config";
import {Issue} from "./issue";
import {Artifacts} from "./artifacts";


export interface IProgress {
  set(total: number, text: string): void;
  tick(info: any): void;
}

class NoProgress implements IProgress {
  public set(_total: number, _text: string): undefined {
    return undefined;
  }

  public tick(_options: any): undefined {
    return undefined;
  }
}

export class Registry {
  private dirty = false;
  private conf: Config;
  private macros: string[] = [];
  private objects: IObject[] = [];
  private issues: Issue[] = [];

  constructor(conf?: Config) {
    this.conf = conf ? conf : Config.getDefault();
  }

  public getObjects(): Array<IObject> {
    return this.objects;
  }

  /*
  public getObject(): IObject {
todo
  }
  */

  public getConfig() {
    return this.conf;
  }

  public setConfig(conf: Config) {
    this.setDirty();
    this.conf = conf;
  }

  public getABAPObjects(): Array<ABAPObject> {
    return this.objects.filter((obj) => { return obj instanceof ABAPObject; }) as Array<ABAPObject>;
  }

  public getABAPFiles(progress?: IProgress): Array<ABAPFile> {
    if (this.isDirty()) {
      this.parse(progress);
    }
    let ret: Array<ABAPFile> = [];
    this.getABAPObjects().forEach((a) => {ret = ret.concat(a.getParsedFiles()); });
    return ret;
  }

  public addFile(file: IFile): Registry {
    this.setDirty();
    return this.addFiles([file]);
  }

  public updateFile(file: IFile): Registry {
    this.setDirty();
    const obj = this.find(file.getObjectName(), file.getObjectType());
    obj.updateFile(file);
    return this;
  }

  public removeFile(file: IFile): Registry {
    this.setDirty();
    const obj = this.find(file.getObjectName(), file.getObjectType());
    obj.removeFile(file);
    if (obj.getFiles().length === 0) {
      this.removeObject(obj);
    }
    return this;
  }

  public addFiles(files: Array<IFile>): Registry {
    this.setDirty();
    files.forEach((f) => {
      try {
        this.findOrCreate(f.getObjectName(), f.getObjectType()).addFile(f);
      } catch (error) {
        this.issues.push(new Issue({file: f, message: error, code: "registry_add"}));
      }
    });
    return this;
  }

  public setDirty() {
    this.dirty = true;
    this.issues = [];
  }

  public isDirty(): boolean {
    return this.dirty;
  }

  public findIssues(progress?: IProgress): Array<Issue> {
    if (this.isDirty()) {
      this.parse(progress);
    }
    progress = progress ? progress : new NoProgress();

    let issues = this.issues.slice(0);
    const objects = this.getObjects();

    const rules: IRule[] = [];
    for (const rule of Artifacts.getRules()) {
      if (this.conf.readByKey(rule.getKey(), "enabled") === true) {
        rule.setConfig(this.conf.readByRule(rule.getKey()));
        rules.push(rule);
      }
    }

    progress.set(objects.length, ":percent - Finding Issues - :object");
    for (const obj of objects) {
      progress.tick({object: obj.getType() + " " + obj.getName()});
      for (const rule of rules) {
        issues = issues.concat(rule.run(obj, this));
      }
    }

    return issues;
  }

  public parse(progress?: IProgress): Registry {
    if (!this.isDirty()) {
      return this;
    }
    const pro = progress ? progress : new NoProgress();

    const objects = this.getABAPObjects();

    pro.set(objects.length, ":percent - Lexing and parsing - :object");
    objects.forEach((obj) => {
      pro.tick({object: obj.getType() + " " + obj.getName()});
      obj.parseFirstPass(this.conf.getVersion(), this);
    });

    pro.set(objects.length, ":percent - Second pass - :object");
    objects.forEach((obj) => {
      pro.tick({object: obj.getType() + " " + obj.getName()});
      this.issues = this.issues.concat(obj.parseSecondPass(this));
    });

    return this;
  }

  public addMacro(name: string) {
// todo, handle scoping for macros
    if (this.isMacro(name)) {
      return;
    }
    this.macros.push(name.toUpperCase());
  }

  public isMacro(name: string): boolean {
    for (const mac of this.macros) {
      if (mac === name.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  private findOrCreate(name: string, type: string): IObject {
    try {
      return this.find(name, type);
    } catch {
      const add = Artifacts.newObject(name, type);
      this.objects.push(add);
      return add;
    }
  }

  private removeObject(remove: IObject | undefined): void {
    if (remove === undefined) {
      return;
    }

    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i] === remove) {
        this.objects.splice(i, 1);
        return;
      }
    }
    throw new Error("removeObject: object not found");
  }

  private find(name: string, type: string): IObject {
    for (const obj of this.objects) { // todo, this is slow
      if (obj.getType() === type && obj.getName() === name) {
        return obj;
      }
    }
    throw new Error("find: object not found");
  }

}
