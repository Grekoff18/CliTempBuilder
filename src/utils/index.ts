const fs = require("fs-extra");
const { moreThen3: mt3 } = require("../enums/Prompts");

async function isFileExist(fileName: string) {
  return !!(await fs.promises.stat(fileName).catch(() => null));
}

async function copyTemplate(name: string, template: any) {
  // Copy all of the files except the template.json file
  await fs.copy(template, name, {
    filter: (src: string): boolean => {
      console.log("src", src);
      if (src.includes("template.json")) return false;
      return true;
    },
  });
}

function validateNameLength(value: string): string | boolean {
  return value.length < 3 ? mt3 : true;
}

module.exports = {
  isFileExist,
  copyTemplate,
  validateNameLength,
};
