import { expect, use } from 'chai';
import { By, WebDriver, until } from 'selenium-webdriver';
import { loadConfig, AppConfig } from '../utils/config';
import { createDriver } from '../utils/driver';
import { fetchProducts } from '../utils/api';
import { captureBugEvidence, initBugReport } from '../utils/bugReporter';

const testData = require('../data/product-listing-search.data.json');

describe('FR-05: Product Listing & Search', function () {
  let config: AppConfig;
  let driver: WebDriver;

  before(async function () {
    config = loadConfig();
    driver = await createDriver(config);
    initBugReport();
    await driver.manage().window().setRect({ width: 1280, height: 900 });
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === 'failed') {
      const tcId = (this.currentTest.title || '').split(':')[0].trim();
      await captureBugEvidence(
        driver,
        tcId || this.currentTest.title,
        'See expected in test case',
        this.currentTest.err?.message || 'Assertion failed',
        config.browser,
        'FR-05 Product Listing & Search',
      );
    }
  });

  async function navigateToHome(): Promise<void> {
    await driver.get(config.frontendUrl + '/');
    await driver.wait(until.elementLocated(By.css('.grid')), 15000);
    await driver.sleep(500);
  }

  async function getProductCards(): Promise<number> {
    const cards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    return cards.length;
  }

  async function searchFor(keyword: string): Promise<void> {
    const input = await driver.findElement(By.css('input[type=text]'));
    await input.clear();
    await input.sendKeys(keyword);
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.sleep(800);
  }

  // ─── TC-PRODUCT_SEARCH-001 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-001: FR-05 displays product grid on home page', async function () {
    await navigateToHome();
    const cardCount = await getProductCards();
    const d = testData.product_list_default;
    expect(cardCount).to.be.at.least(
      d.minProductCount,
      `Expected at least ${d.minProductCount} product(s) but found ${cardCount}`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-002 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-002: FR-05 product card shows image name and price', async function () {
    await navigateToHome();
    const cards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    expect(cards.length).to.be.at.least(1, 'No product cards to inspect');

    const firstCard = cards[0];

    const imgs = await firstCard.findElements(By.css('img'));
    expect(imgs.length).to.be.at.least(1, 'Product card missing image');
    const altText = await imgs[0].getAttribute('alt');
    expect(altText).to.match(
      /.+/,
      `Product image alt text should not be empty, got "${altText}"`,
    );

    const names = await firstCard.findElements(By.css('h2'));
    expect(names.length).to.be.at.least(1, 'Product card missing name');

    const prices = await firstCard.findElements(By.css('.text-red-500'));
    expect(prices.length).to.be.at.least(1, 'Product card missing price');
  });

  // ─── TC-PRODUCT_SEARCH-003 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-003: FR-05 product price uses VND format', async function () {
    await navigateToHome();
    const d = testData.product_price_format_vnd;
    const priceEls = await driver.findElements(By.css(d.priceSelector));
    expect(priceEls.length).to.be.at.least(1, 'No price elements found');
    const priceText = await priceEls[0].getText();
    expect(priceText).to.include(
      d.expectedCurrency,
      `Price "${priceText}" should contain "${d.expectedCurrency}"`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-004 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-004: FR-05 page has exactly one h1', async function () {
    await navigateToHome();
    const d = testData.page_single_h1;
    const h1s = await driver.findElements(By.css('h1'));
    expect(h1s.length).to.equal(
      d.expectedH1Count,
      `Expected ${d.expectedH1Count} h1 on page but found ${h1s.length}`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-005 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-005: FR-05 shows loading state while fetching products', async function () {
    await driver.get(config.frontendUrl + '/');
    const d = testData.product_loading_state;
    await driver.sleep(300);
    const loadingEls = await driver.findElements(By.css(d.loadingSelector));
    expect(loadingEls.length).to.be.at.least(
      1,
      'No loading indicator found – the app should show a loading state while fetching products',
    );
  });

  // ─── TC-PRODUCT_SEARCH-006 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-006: FR-05 searches products by matching keyword', async function () {
    await navigateToHome();
    const d = testData.search_valid_keyword;
    await searchFor(d.keyword);
    await driver.sleep(500);
    const cards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    expect(cards.length).to.be.at.least(
      d.expectedMinResults,
      `Expected at least ${d.expectedMinResults} product(s) for keyword "${d.keyword}"`,
    );
    if (cards.length > 0) {
      const firstCardText = await cards[0].getText();
      expect(firstCardText.toLowerCase()).to.include(
        d.expectedKeywordInResults.toLowerCase(),
        `First result should contain "${d.expectedKeywordInResults}"`,
      );
    }
  });

  // ─── TC-PRODUCT_SEARCH-007 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-007: FR-05 search is case insensitive', async function () {
    await navigateToHome();
    const d = testData.search_case_insensitive;

    await searchFor(d.keywordLower);
    await driver.sleep(500);
    const lowerCards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    const lowerCount = lowerCards.length;

    await searchFor(d.keywordUpper);
    await driver.sleep(500);
    const upperCards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    const upperCount = upperCards.length;

    expect(upperCount).to.equal(
      lowerCount,
      `Lowercase "${d.keywordLower}" gave ${lowerCount} result(s), uppercase "${d.keywordUpper}" gave ${upperCount} result(s)`,
    );
    expect(lowerCount).to.be.at.least(
      d.expectedMinResults,
      `Expected at least ${d.expectedMinResults} result(s) for keyword "${d.keywordLower}"`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-008 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-008: FR-05 trims search keyword whitespace', async function () {
    await navigateToHome();
    const d = testData.search_trimmed_keyword;

    await searchFor(d.keyword);
    await driver.sleep(500);
    const trimmedCards = await driver.findElements(By.css('.border.rounded.shadow-sm'));

    const input = await driver.findElement(By.css('input[type=text]'));
    await input.clear();
    await input.sendKeys(d.trimmedKeyword);
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.sleep(500);
    const normalCards = await driver.findElements(By.css('.border.rounded.shadow-sm'));

    expect(trimmedCards.length).to.equal(
      normalCards.length,
      `Keyword with spaces "${d.keyword}" gave ${trimmedCards.length} result(s), trimmed "${d.trimmedKeyword}" gave ${normalCards.length}`,
    );
    expect(trimmedCards.length).to.be.at.least(
      d.expectedMinResults,
      `Expected at least ${d.expectedMinResults} result(s) for trimmed keyword`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-009 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-009: FR-05 shows empty state for no result', async function () {
    await navigateToHome();
    const d = testData.search_no_result;

    await searchFor(d.keyword);
    await driver.sleep(500);

    const cards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    expect(cards.length).to.equal(
      d.expectedProductCards,
      `Expected ${d.expectedProductCards} product card(s) for non-existent keyword, but found ${cards.length}`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-010 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-010: FR-05 empty search restores all products', async function () {
    await navigateToHome();
    const d = testData.search_empty_keyword;

    const initialCount = await getProductCards();
    expect(initialCount).to.be.at.least(
      d.expectedDefaultMinResults,
      `Expected at least ${d.expectedDefaultMinResults} product(s) initially`,
    );

    await searchFor(d.keyword);
    await driver.sleep(500);
    const searchCount = await getProductCards();

    const input = await driver.findElement(By.css('input[type=text]'));
    await input.clear();
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.sleep(800);
    const restoredCount = await getProductCards();

    expect(restoredCount).to.be.at.least(
      d.expectedDefaultMinResults,
      `Expected restored list to have at least ${d.expectedDefaultMinResults} product(s)`,
    );
    expect(restoredCount).to.be.at.least(
      searchCount,
      `Cleared search returned ${restoredCount} product(s) which is fewer than search results (${searchCount})`,
    );
  });

  // ─── TC-PRODUCT_SEARCH-011 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-011: FR-05 safely renders html search keyword', async function () {
    await navigateToHome();
    const d = testData.search_html_injection_safe_render;

    await searchFor(d.keyword);
    await driver.sleep(1000);

    let alertTriggered = false;
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      const alert = await driver.switchTo().alert();
      await alert.dismiss();
      alertTriggered = true;
    } catch {
      // No alert was triggered
    }

    expect(alertTriggered).to.be.false;

    const displayEls = await driver.findElements(By.css('.text-gray-600'));
    let hasInjectedImg = false;
    for (const el of displayEls) {
      const innerHtml = await el.getAttribute('innerHTML');
      if (innerHtml && innerHtml.includes('<img')) {
        hasInjectedImg = true;
        break;
      }
      const tagName = await el.getTagName();
      if (tagName === 'img') {
        hasInjectedImg = true;
        break;
      }
      const children = await el.findElements(By.css('img'));
      if (children.length > 0) {
        hasInjectedImg = true;
        break;
      }
    }
    expect(hasInjectedImg).to.be.false;
  });

  // ─── TC-PRODUCT_SEARCH-012 ────────────────────────────────────────────
  it('TC-PRODUCT_SEARCH-012: FR-05 API search returns matching products', async function () {
    const d = testData.api_search_keyword;
    const products = await fetchProducts(config.apiUrl, d.keyword);
    expect(products.length).to.be.at.least(
      d.expectedMinResults,
      `Expected at least ${d.expectedMinResults} product(s) from API for "${d.keyword}"`,
    );
    if (products.length > 0) {
      const hasMatch = products.some((p) =>
        p.name.toLowerCase().includes(d.expectedKeywordInResults.toLowerCase()),
      );
      expect(hasMatch).to.be.true;
    }
  });
});
