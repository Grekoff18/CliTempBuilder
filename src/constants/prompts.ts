// Array<{ [key: string]: string | Function }>
const { projectName, projectExist } = require("../enums/Prompts");
const { validateNameLength: validateName } = require("../utils/index");

const questions: any = [
  {
    type: "text",
    name: "name",
    initial: "project",
    message: projectName,
    validate: validateName,
  },
];

const override: { [key: string]: string | boolean } = {
  type: "confirm",
  name: "value",
  message: projectExist,
  initial: false,
};

module.exports = {
  questions,
  override,
};
