import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import edge from 'selenium-webdriver/edge';
import { AppConfig } from './config';

export async function createDriver(config: AppConfig): Promise<WebDriver> {
  const headless = config.headless;
  const browser = config.browser.toLowerCase();

  switch (browser) {
    case 'chrome': {
      const options = new chrome.Options();
      if (headless) options.addArguments('--headless=new');
      options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
      return new Builder().forBrowser('chrome').setChromeOptions(options).build();
    }
    case 'edge': {
      const options = new edge.Options();
      if (headless) options.addArguments('--headless=new');
      options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
      return new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(options).build();
    }
    case 'firefox': {
      const options = new firefox.Options();
      if (headless) options.addArguments('--headless');
      return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    }
    default:
      throw new Error(`Unsupported browser: ${browser}. Use chrome, edge, or firefox.`);
  }
}
