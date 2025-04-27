const { Builder, By, Key, until } = require("selenium-webdriver");
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
    // Go to dashboard
    await driver.get("https://tipalti.zendesk.com/agent/dashboard");

    // Click "New" button
    const newBtn = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="ember1788"]/div/div[1]/div/div/button/div/span')
      ),
      10000
    );
    await newBtn.click();

    // Wait for new ticket to open
    await driver.wait(until.urlContains("/agent/tickets/new"), 10000);
    await driver.sleep(3000);

    // --- BRAND DROPDOWN: Select "Tipalti" ---
    const brandDropdown = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id=":rg:--trigger"]/div/svg[2]')
      ),
      10000
    );
    await brandDropdown.click();
    await driver.sleep(1000);

    const tipaltiOption = await driver.wait(
      until.elementLocated(By.xpath('//*[@id=":rg:--option-0"]/div')),
      5000
    );
    await tipaltiOption.click();

    // --- REQUESTED: Enter email ---
    const requestedDropdown = await driver.wait(
      until.elementLocated(
        By.css('[data-testid="requester-field"] input[type="email"]')
      ),
      10000
    );
    await requestedDropdown.sendKeys("someone@example.com", Key.ENTER);

    // --- ASSIGNEE: Click "Take it" ---
    const takeItBtn = await driver.wait(
      until.elementLocated(By.xpath('//button[contains(text(), "Take it")]')),
      10000
    );
    await takeItBtn.click();

    // --- COMPONENT: Scroll down & select "login" (second option) ---
    await driver.executeScript(
      "window.scrollTo(0, document.body.scrollHeight)"
    );

    const componentDropdown = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//div[contains(@data-testid, "component-field")]//div[@role="button"]'
        )
      ),
      10000
    );
    await componentDropdown.click();

    const inputField = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Search…"]')),
      5000
    );

    await inputField.sendKeys("login");
    await driver.sleep(1000); // wait for suggestions

    const secondOption = await driver.wait(
      until.elementsLocated(By.xpath('//div[@role="option"]')),
      5000
    );
    if (secondOption[1]) {
      await secondOption[1].click(); // pick 2nd option
    }

    console.log("✅ Zendesk ticket fields filled.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
