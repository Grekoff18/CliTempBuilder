const fs = require("fs-extra");
const { moreThen3: mt3 } = require("../enums/Prompts");
const { Created } = require("../enums/CLIMessages");

async function isFileExist(fileName: string) {
  return !!(await fs.promises.stat(fileName).catch(() => null));
}

async function copyTemplate(name: string, template: any) {
  // Copy all of the files except the template.json file
  await fs
    .copy(template, name, {
      filter: (src: string): boolean => {
        if (src.includes("template.json")) return false;
        return true;
      },
    })
    .then(() => console.log(Created))
    .catch((err: any) => console.log(err.message));
}

function validateNameLength(value: string): string | boolean {
  return value.length < 3 ? mt3 : true;
}

function getPathForNewProject(name: string): string {
  const isRequireExist: string | undefined =
    require && require.main && require.main.path;
  if (isRequireExist) {
    const rootFolderPath = isRequireExist.split("/").slice(0, -2).join("/");
    return `${rootFolderPath}/${name}`;
  }
  return "";
}

module.exports = {
  isFileExist,
  copyTemplate,
  validateNameLength,
  getPathForNewProject,
};
