const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const { WelcomeMessage } = require("../enums/CLIMessages");

class Builder {
  public response: any = {};

  constructor() {
    // Clear the console
    clear();
    // Call banner
    this.callBanner(WelcomeMessage);
  }

  callBanner(text: string): void {
    console.log(
      chalk.red(
        figlet.textSync(text, {
          horizontalLayout: true,
        })
      )
    );
  }
}

module.exports = Builder;
