const filesystem = require("fs-extra");
const { questions: q } = require("../constants/prompts");
const { chooseTemplate } = require("../enums/Prompts");
const listener = require("./Listener");

class TemplateEngine {
  pathToTemplates: string = "";
  templates: any = [];

  constructor() {
    this.setPathToTemplates();
    this.setTemplates();
  }

  isSetRequireMainPath(): string {
    return (require && require.main && require.main.path) || "";
  }

  getTemplateByPath(path: string): any {
    return require(path);
  }

  setPathToTemplates(): void {
    if (this.isSetRequireMainPath() && this.isSetRequireMainPath().length > 3) {
      let rootFolderPath = this.isSetRequireMainPath()
        .split("/")
        .slice(0, -1)
        .join("/");
      this.pathToTemplates = `${rootFolderPath}/templates`;
    }
  }

  async setTemplates() {
    // Get all templates from templates folder
    const templatesArray = await filesystem.readdir(this.pathToTemplates);
    const sortedTemplates = templatesArray.map((t: string) => {
      const getJsonByName = (name: string) =>
        `${this.pathToTemplates}/${t}/${name}.json`;

      if (this.getTemplateByPath(getJsonByName("template"))) {
        const result = this.getTemplateByPath(getJsonByName("template"));
        result.dir = getJsonByName("template");
        return result;
      }

      return this.getTemplateByPath(getJsonByName("package"));
    });

    this.templates = sortedTemplates;
    // If more than one template ask user which template to use
    this.whichTemplateToUse();
    // Call Listener class for selecting project setup
    new listener(this.templates);
  }

  whichTemplateToUse() {
    if (this.templates.length > 1) {
      q.push({
        type: "select",
        name: "template",
        message: chooseTemplate,
        choices: this.templates.map((t: any) => ({
          title: t.name,
          description: t.description,
          value: t.dir,
        })),
        initial: 0,
      });
    }
  }
}

module.exports = TemplateEngine;
