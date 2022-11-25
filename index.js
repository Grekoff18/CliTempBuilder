#!/usr/bin/env node
// index.js

// Import dependencies
const prompts = require("prompts");
const fs = require("fs-extra");

/**
 * Check if file with given name is already exist
 * @param {String} fileName
 * @returns {Boolean}
 */
async function isFileExist(fileName) {
  return !!(await fs.promises.stat(fileName).catch(() => null));
}

/**
 * Copy the template
 * @param {String} name
 * @param {any} template
 * @returns {Boolean}
 */
async function copyTemplate(name, template) {
  // Copy all of the files except the template.json file
  console.log(template, name);
  await fs.copy(template, name, {
    filter: (src) => {
      if (src.includes("template.json")) return false;
      return true;
    },
  });
}

(async () => {
  // Store of user response
  let response = {};
  const pathToTemplates = `${require.main.path}/templates`;

  // Get all templates from templates directory
  const templates = (await fs.readdir(pathToTemplates)).map((t) => {
    let info = require(`${pathToTemplates}/${t}/template.json`);

    if (typeof info === "undefined") {
      info = require(`${pathToTemplates}/${t}/package.json`);
    }

    info.dir = `${pathToTemplates}/${t}`;

    return info;
  });

  // All of the questions
  const questions = [
    {
      type: "text",
      name: "name",
      initial: "project",
      message: "project name?",
      validate: (value) =>
        value.length < 3 ? "Name have to be more than 3 characters" : true,
    },
  ];

  // Ask which template to use if there's more than one
  if (templates.length > 1) {
    questions.push({
      type: "select",
      name: "template",
      message: "Pick a template",
      choices: templates.map((t) => ({
        title: t.name,
        description: t.description,
        value: t.dir,
      })),
      initial: 0,
    });
  }

  // Cancel handler
  const onCancel = (prompt) => {
    console.log("Never stop prompting!", prompt);
    return true;
  };

  // Listening for response
  response = await prompts(questions, { onCancel });

  // If there is only one template then set the first template to be the
  // template on the response
  if (typeof response.template === "undefined") {
    response.template = templates[0].dir;
  }

  // Check if the project already exist
  if (await isFileExist(response.name)) {
    // Ask if we should override
    const overwrite = await prompts({
      type: "confirm",
      name: "value",
      message:
        "You already have a project with that name. Do you want to overwrite it ?",
      initial: false,
    });

    // Override the project if the user said yes
    if (overwrite.value) {
      // Remove old files
      await fs.remove(response.name);
      // Copy the template
      copyTemplate(response.name, response.template);
    }
  } else {
    // Copy the template
    copyTemplate(response.name, response.template);
  }
})();
