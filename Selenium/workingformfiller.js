const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const options = new chrome.Options();
options.addArguments(
  "--user-data-dir=C:/Users/Aasus/AppData/Local/Google/Chrome/User Data"
);
options.addArguments("--profile-directory=Profile 9");

(async () => {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {

    await driver.get(
      "https://docs.google.com/forms/d/e/1FAIpQLSfbNkHnqTKjHtDrqlMhNz9GBROPJTcmCL6thgUQl_Mx-EKOPQ/viewform"
    );

    // Wait for the checkbox to be clickable, then click it
    const checkbox = await driver.wait(
      until.elementLocated(By.css('div[role="checkbox"]')),
      10000
    );
    await checkbox.click();

    const dropdown = await driver.wait(
      until.elementLocated(By.css('div[role="listbox"]')),
      10000
    );
    await dropdown.click();

    // Wait a bit for the menu to animate open (important!)
    await driver.sleep(500); // short wait

    // Now find the visible "Production" option
    const productionOption = await driver.wait(
      until.elementLocated(
        By.xpath('//div[@role="option"]//span[text()="Production"]')
      ),
      5000
    );
    await productionOption.click();

    await driver.sleep(500); // short wait

    // Click the Next button
    const nextBtn = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="mG61Hd"]/div[2]/div/div[3]/div[1]/div[1]/div/span/span'
        )
      ),
      50000
    );
    await nextBtn.click();

    await driver.sleep(1500); // short wait

    const allDropdowns = await driver.wait(
      until.elementsLocated(By.css('div[role="listbox"]')),
      10000
    );

    // First dropdown: select "SEP"
    await allDropdowns[0].click();
    await driver.sleep(300); // Wait for menu to open

    const sepOption = await driver.wait(
      until.elementLocated(
        By.xpath('//div[@role="option"]//span[text()="SEP"]')
      ),
      5000
    );
    await sepOption.click();
    await driver.sleep(300);

    // --- TEXT INPUTS --- //

    const inputTexts = [
      "example.com", // Ticket link
      "Dmarket", // Payer name
      "xyz", // Payee ID
      "yesterday 9:00", // Timestamp
    ];

    // Get all text input fields (skip the dropdown above)
    const textInputs = await driver.wait(
      until.elementsLocated(By.css('input[type="text"], textarea')),
      10000
    );

    // Fill the 4 input fields
    for (let i = 0; i < 4; i++) {
      await textInputs[i].sendKeys(inputTexts[i]);
      await driver.sleep(300);
    }

    // --- REMAINING 8 DROPDOWNS --- //

    const dropdownOptions = [
      "New",
      "I Frame",
      "Checked",
      "Checked",
      "Verified",
      "Yes",
      "NA",
      "Yeshpal Thakur",
    ];

    // Start from second dropdown (index 1)
    for (let i = 1; i <= dropdownOptions.length; i++) {
      await allDropdowns[i].click();
      await driver.sleep(300);
      let option;
      if (i == 4) {
        option = await driver.wait(
          until.elementLocated(
            By.xpath(
              `//*[@id="mG61Hd"]/div[2]/div/div[2]/div[10]/div/div/div[2]/div/div[2]/div[3]/span`
            )
          ),
          5000
        );
      } else {
        option = await driver.wait(
          until.elementLocated(
            By.xpath(
              `//div[@role="option"]//span[text()="${dropdownOptions[i - 1]}"]`
            )
          ),
          5000
        );
      }

      await option.click();
      await driver.sleep(200);
    }
  } catch (err) {
    console.error("Something went wrong:", err);
  }
})();
