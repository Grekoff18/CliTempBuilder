const { stopPrompting } = require("../enums/Warnings");
const prompts = require("prompts");
const fS = require("fs-extra");
const { questions: Q, override: O } = require("../constants/prompts");
const { isFileExist: iFE, copyTemplate: cT } = require("../utils/index");

class Listener {
  // User response
  //TODO: describe types for class
  response: any;
  templates: any;

  // TODO: add getters/setters for response obj
  constructor(templates: any) {
    // Set templates from TemplateEngine
    this.templates = templates;
    // Set listener on user prompt
    this.listenPrompts();
  }

  async listenPrompts(): Promise<void> {
    this.response = await prompts(Q, { onCancel: this.onCancel });
    this.responseSetTemplate();
    await this.checkIfProjectExist();
  }

  responseSetTemplate() {
    if (typeof this.response.template === "undefined") {
      this.response.template = this.templates[0].dir;
    }
  }

  async checkIfProjectExist() {
    // Check if the project already exist
    if (await iFE(this.response.name)) {
      // Ask if we should override
      const overwrite = await prompts(O);

      // Override the project if the user said yes
      if (overwrite.value) {
        // Remove old files
        await fS.remove(this.response.name);
        // Copy the template
        cT(this.response.name, this.response.template);
      }
    } else {
      // Copy the template
      cT(this.response.name, this.response.template);
    }
  }

  onCancel(prompt: any): boolean {
    console.log(stopPrompting, prompt);
    return true;
  }
}

module.exports = Listener;
