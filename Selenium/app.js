// https://docs.google.com/forms/d/e/1FAIpQLSfbNkHnqTKjHtDrqlMhNz9GBROPJTcmCL6thgUQl_Mx-EKOPQ/viewform OFFICE
// https://docs.google.com/forms/d/e/1FAIpQLSf4E0fnUfEpynaEaKswEBpKl_c7R-2CiMSVQU9K9v6a-fx54A/viewform?usp=header
const { google } = require("googleapis");
const fs = require("fs");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Setup browser with profile
const options = new chrome.Options();
options.addArguments(
  "--user-data-dir=C:/Users/Aasus/AppData/Local/Google/Chrome/User Data"
);
options.addArguments("--profile-directory=Profile 9");

// Load Google Sheets data
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function getSheetData() {
  const client = await auth.getClient();
  3;
  const sheets = google.sheets({ version: "v4", auth: client });

  const sheetId = "1NrzdtIrhHyUyCA0pZyneawUWVeVclUIbRbMsmsSf988"; // Replace with your real Sheet ID
  //   const range = "Sheet1!A2:D"; // Adjust based on your columns
  const range = "testing"; // Adjust based on your columns

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return res.data.values || [];
}

// Main automation loop
(async () => {
  //   const rows = await getSheetData();
  const rows = (await getSheetData()).slice(1);

  for (const row of rows) {
    const [ticketLink, payerName, payeeId, timestamp] = row;

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    try {
      await driver.get(
        "https://docs.google.com/forms/d/e/1FAIpQLSfbNkHnqTKjHtDrqlMhNz9GBROPJTcmCL6thgUQl_Mx-EKOPQ/viewform"
      );

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
      await driver.sleep(500);

      const productionOption = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@role="option"]//span[text()="Production"]')
        ),
        5000
      );
      await productionOption.click();
      await driver.sleep(500);

      const nextBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[@id="mG61Hd"]/div[2]/div/div[3]/div[1]/div[1]/div/span/span'
          )
        ),
        10000
      );
      await nextBtn.click();
      await driver.sleep(1500);

      const allDropdowns = await driver.wait(
        until.elementsLocated(By.css('div[role="listbox"]')),
        10000
      );

      // First dropdown: "SEP"
      await allDropdowns[0].click();
      await driver.sleep(300);
      const sepOption = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@role="option"]//span[text()="SEP"]')
        ),
        5000
      );
      await sepOption.click();
      await driver.sleep(300);

      // Fill text fields
      const inputTexts = [ticketLink, payerName, payeeId, timestamp];
      const textInputs = await driver.wait(
        until.elementsLocated(By.css('input[type="text"], textarea')),
        10000
      );

      for (let i = 0; i < 4; i++) {
        await textInputs[i].sendKeys(inputTexts[i]);
        await driver.sleep(300);
      }

      // Remaining dropdowns
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

      for (let i = 1; i <= dropdownOptions.length; i++) {
        await allDropdowns[i].click();
        await driver.sleep(300);

        let option;
        if (i === 4) {
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
                `//div[@role="option"]//span[text()="${
                  dropdownOptions[i - 1]
                }"]`
              )
            ),
            5000
          );
        }

        await option.click();
        await driver.sleep(200);
      }

      const submitBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[@id="mG61Hd"]/div[2]/div/div[3]/div[2]/div[1]/div[2]/span/span'
          )
        ),
        5000
      );

      await submitBtn.click();
      await driver.sleep(2000);

      console.log("✅ Submitted form for:", ticketLink);
    } catch (err) {
      console.error("❌ Error processing row:", row, "\n", err);
    } finally {
      await driver.quit();
    }
  }
})();
