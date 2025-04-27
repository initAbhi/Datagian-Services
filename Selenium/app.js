const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const options = new chrome.Options();

// Path to your Chrome user data directory
options.addArguments(
  "--user-data-dir=C:/Users/Aasus/AppData/Local/Google/Chrome/User Data"
);

// Name of the profile you want to use
options.addArguments("--profile-directory=Profile 9"); // Or 'Default', etc.

(async function launchWithProfile() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.get(
    "https://docs.google.com/forms/d/e/1FAIpQLSfbNkHnqTKjHtDrqlMhNz9GBROPJTcmCL6thgUQl_Mx-EKOPQ/viewform"
  );
})();
