import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';
import firefox from 'selenium-webdriver/firefox';
import { config, BrowserName } from './config';

export async function buildDriver(browser: BrowserName = config.browser): Promise<WebDriver> {
  const builder = new Builder();
  switch (browser) {
    // Note: `addArguments` is declared on the shared chromium.Options supertype and
    // returns it, so the fluent form loses the concrete Chrome/Edge type. Mutate a
    // held reference instead of chaining off the constructor.
    case 'chrome': {
      const o = new chrome.Options();
      o.addArguments('--window-size=1440,900', '--disable-gpu');
      if (config.headless) o.addArguments('--headless=new');
      builder.forBrowser('chrome').setChromeOptions(o);
      break;
    }
    case 'edge': {
      const o = new edge.Options();
      o.addArguments('--window-size=1440,900', '--disable-gpu');
      if (config.headless) o.addArguments('--headless=new');
      builder.forBrowser('MicrosoftEdge').setEdgeOptions(o);
      break;
    }
    case 'firefox': {
      const o = new firefox.Options().addArguments('--width=1440', '--height=900');
      if (config.headless) o.addArguments('-headless');
      builder.forBrowser('firefox').setFirefoxOptions(o);
      break;
    }
  }
  const driver = await builder.build();
  // Implicit wait stays at 0 — mixing implicit and explicit waits is a classic flakiness source.
  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 60000, script: 30000 });
  return driver;
}
