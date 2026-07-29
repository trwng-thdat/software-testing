import { expect } from 'chai';
import { By, WebDriver, until } from 'selenium-webdriver';
import { loadConfig, AppConfig } from '../utils/config';
import { createDriver } from '../utils/driver';
import { addToCartApi, getCartApi, loginUser } from '../utils/api';
import { captureBugEvidence, initBugReport } from '../utils/bugReporter';

const testData = require('../data/shopping-cart.data.json');

describe('FR-07: Shopping Cart', function () {
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
        'FR-07 Shopping Cart',
      );
    }
  });

  async function fullLoadHome(): Promise<void> {
    await driver.get(config.frontendUrl + '/');
    await driver.wait(until.elementLocated(By.css('.grid')), 15000);
    await driver.sleep(500);
  }

  async function clickCartNav(): Promise<void> {
    let clicked = false;
    const navLinks = await driver.findElements(By.css('nav a'));
    for (const link of navLinks) {
      const text = await link.getText();
      if (text.includes('Giỏ hàng')) {
        await link.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      await driver.get(config.frontendUrl + '/cart');
      await driver.sleep(500);
    }
    await driver.sleep(1000);
  }

  async function clickHomeLogo(): Promise<void> {
    const logoLinks = await driver.findElements(By.css('header a.text-2xl'));
    if (logoLinks.length > 0) {
      await logoLinks[0].click();
    } else {
      await driver.get(config.frontendUrl + '/');
    }
    await driver.sleep(500);
  }

  async function addProductToCartByIndex(index: number): Promise<void> {
    const cards = await driver.findElements(By.css('.border.rounded.shadow-sm'));
    expect(cards.length).to.be.at.least(index + 1, `Not enough product cards to add index ${index}`);
    const addButtons = await cards[index].findElements(By.css('button'));
    let clicked = false;
    for (const btn of addButtons) {
      const text = await btn.getText();
      if (text.includes('Thêm vào giỏ')) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      await addButtons[addButtons.length - 1].click();
    }
    await driver.sleep(500);
  }

  async function getCartRowCount(): Promise<number> {
    const rows = await driver.findElements(By.css('table tbody tr'));
    return rows.length;
  }

  // ─── TC-CART-001 ──────────────────────────────────────────────────────
  it('TC-CART-001: FR-07 displays empty cart state', async function () {
    await driver.get(config.frontendUrl + '/cart');
    const d = testData.cart_empty_state;

    await driver.sleep(500);
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    expect(bodyText).to.include(
      d.expectedEmptyHeading,
      `Expected "${d.expectedEmptyHeading}" in empty cart, got "${bodyText.substring(0, 200)}"`,
    );

    const links = await driver.findElements(By.css('a[href="/"]'));
    let foundContinue = false;
    for (const link of links) {
      const text = await link.getText();
      if (text.includes('Tiếp tục mua sắm')) {
        foundContinue = true;
        break;
      }
    }
    expect(foundContinue).to.be.true;
  });

  // ─── TC-CART-002 ──────────────────────────────────────────────────────
  it('TC-CART-002: FR-07 adds one product to cart', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);

    await clickCartNav();
    const rowCount = await getCartRowCount();
    expect(rowCount).to.equal(
      testData.cart_add_single_product.expectedRowCount,
      `Expected ${testData.cart_add_single_product.expectedRowCount} row(s) in cart after adding one product`,
    );

    if (rowCount > 0) {
      const nameCell = await driver.findElement(By.css('table tbody tr td:nth-child(1)'));
      const nameText = await nameCell.getText();
      expect(nameText.length).to.be.greaterThan(0, 'Cart row should have a product name');

      const priceCell = await driver.findElement(By.css('table tbody tr td:nth-child(2)'));
      const priceText = await priceCell.getText();
      expect(priceText.length).to.be.greaterThan(0, 'Cart row should have a price');

      const qtyCell = await driver.findElement(By.css('table tbody tr td:nth-child(3)'));
      const qtyText = await qtyCell.getText();
      expect(Number(qtyText)).to.be.at.least(1, 'Cart row should have quantity >= 1');

      const deleteButtons = await driver.findElements(By.css('button.text-red-500'));
      expect(deleteButtons.length).to.be.at.least(1, 'Cart should have a delete button');
    }
  });

  // ─── TC-CART-003 ──────────────────────────────────────────────────────
  it('TC-CART-003: FR-07 merges duplicate product quantity (bug: SUT does not merge)', async function () {
    await fullLoadHome();
    const d = testData.cart_add_same_product_twice;

    await addProductToCartByIndex(0);
    await addProductToCartByIndex(0);

    await clickCartNav();
    const rowCount = await getCartRowCount();
    expect(rowCount).to.equal(
      d.expectedRowCountMerged,
      `Expected ${d.expectedRowCountMerged} row(s) (merged) but found ${rowCount}. SUT does not merge duplicate products in cart`,
    );

    if (rowCount === d.expectedRowCountMerged) {
      const qtyCell = await driver.findElement(By.css('table tbody tr td:nth-child(3)'));
      const qtyText = await qtyCell.getText();
      expect(Number(qtyText)).to.equal(
        d.expectedQuantityIfMerged,
        `Expected quantity ${d.expectedQuantityIfMerged} after merging, got ${qtyText}`,
      );
    }
  });

  // ─── TC-CART-004 ──────────────────────────────────────────────────────
  it('TC-CART-004: FR-07 displays distinct cart rows for different products', async function () {
    await fullLoadHome();
    const d = testData.cart_add_two_distinct_products;

    await addProductToCartByIndex(d.productACardIndex);
    await addProductToCartByIndex(d.productBCardIndex);

    await clickCartNav();
    const rowCount = await getCartRowCount();
    expect(rowCount).to.equal(
      d.expectedRowCount,
      `Expected ${d.expectedRowCount} distinct row(s) for 2 different products, got ${rowCount}`,
    );
  });

  // ─── TC-CART-005 ──────────────────────────────────────────────────────
  it('TC-CART-005: FR-07 increments item quantity with + button (bug: SUT has no +/- buttons)', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_increment_quantity;
    const allButtons = await driver.findElements(By.css('button'));
    const incButtons = [];
    for (const btn of allButtons) {
      const t = await btn.getText();
      if (d.incrementButtonLabels.some((label: string) => t.includes(label))) {
        incButtons.push(btn);
      }
    }
    expect(incButtons.length).to.be.at.least(
      1,
      'No increment button (+) found. Per FR-07, cart should have +/- controls for quantity.',
    );
  });

  // ─── TC-CART-006 ──────────────────────────────────────────────────────
  it('TC-CART-006: FR-07 decrements item quantity with - button (bug: SUT has no +/- buttons)', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_decrement_quantity;
    const allBtns = await driver.findElements(By.css('button'));
    const decButtons = [];
    for (const btn of allBtns) {
      const t = await btn.getText();
      if (d.decrementButtonLabels.some((label: string) => t.includes(label))) {
        decButtons.push(btn);
      }
    }
    expect(decButtons.length).to.be.at.least(
      1,
      'No decrement button (-) found. Per FR-07, cart should have +/- controls for quantity.',
    );
  });

  // ─── TC-CART-007 ──────────────────────────────────────────────────────
  it('TC-CART-007: FR-07 enforces minimum quantity 1 (bug: SUT has no quantity controls)', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_quantity_min_one;
    const allBtns = await driver.findElements(By.css('button'));
    const decButtons = [];
    for (const btn of allBtns) {
      const t = await btn.getText();
      if (d.decrementButtonLabels.some((label: string) => t.includes(label))) {
        decButtons.push(btn);
      }
    }

    if (decButtons.length > 0) {
      await decButtons[0].click();
      await driver.sleep(300);
      const qtyCell = await driver.findElement(By.css('table tbody tr td:nth-child(3)'));
      const qtyText = await qtyCell.getText();
      expect(Number(qtyText)).to.be.at.least(
        d.minimumQuantity,
        `Quantity should not go below ${d.minimumQuantity}`,
      );
    } else {
      expect(decButtons.length).to.be.at.least(
        1,
        'Cannot test min quantity: no decrement button found. SUT missing quantity controls per FR-07.',
      );
    }
  });

  // ─── TC-CART-008 ──────────────────────────────────────────────────────
  it('TC-CART-008: FR-07 keeps item when delete is cancelled (bug: SUT has no delete confirmation)', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_delete_cancel;
    const deleteButtons = await driver.findElements(By.css(d.deleteButtonSelector));
    expect(deleteButtons.length).to.be.at.least(1, 'No delete button found');

    const rowCountBefore = await getCartRowCount();

    await deleteButtons[0].click();
    await driver.sleep(500);

    let dialogHandled = false;
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      await driver.switchTo().alert().dismiss();
      dialogHandled = true;
    } catch {
    }

    if (dialogHandled) {
      const rowCountAfter = await getCartRowCount();
      expect(rowCountAfter).to.equal(
        rowCountBefore,
        'Item should remain after dismissing delete confirmation',
      );
    } else {
      expect.fail(
        'No delete confirmation dialog appeared. Per FR-07, delete must have confirmation dialog.',
      );
    }
  });

  // ─── TC-CART-009 ──────────────────────────────────────────────────────
  it('TC-CART-009: FR-07 removes item after delete confirmation (bug: SUT has no confirmation dialog)', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_delete_confirm;
    const deleteButtons = await driver.findElements(By.css(d.deleteButtonSelector));
    expect(deleteButtons.length).to.be.at.least(1, 'No delete button found');

    await deleteButtons[0].click();
    await driver.sleep(500);

    let dialogHandled = false;
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      await driver.switchTo().alert().accept();
      dialogHandled = true;
    } catch {
    }

    if (dialogHandled) {
      await driver.sleep(500);
      const rowCountAfter = await getCartRowCount();
      expect(rowCountAfter).to.be.lessThan(
        1,
        'Item should be removed after confirming deletion',
      );
    } else {
      expect.fail(
        'No delete confirmation dialog appeared. Per FR-07, delete must have confirmation dialog.',
      );
    }
  });

  // ─── TC-CART-010 ──────────────────────────────────────────────────────
  it('TC-CART-010: FR-07 displays total label "Tổng tạm tính"', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_total_label;
    const bodyText = await driver.findElement(By.tagName('body')).getText();

    expect(bodyText).to.include(
      d.expectedTotalLabel,
      `Expected total label "${d.expectedTotalLabel}" in cart page`,
    );
  });

  // ─── TC-CART-011 ──────────────────────────────────────────────────────
  it('TC-CART-011: FR-07 navigates back to home from cart', async function () {
    await fullLoadHome();
    await addProductToCartByIndex(0);
    await clickCartNav();

    const d = testData.cart_continue_shopping;
    await driver.sleep(500);

    const links = await driver.findElements(By.css('a'));
    let clicked = false;
    for (const link of links) {
      const text = await link.getText();
      if (text.includes('Mua tiếp')) {
        await link.click();
        clicked = true;
        break;
      }
    }
    expect(clicked, 'Could not find "Mua tiếp" link').to.be.true;

    await driver.sleep(1000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include(
      d.expectedUrl,
      `Expected URL to contain "${d.expectedUrl}" after clicking continue shopping, got "${currentUrl}"`,
    );
  });

  // ─── TC-CART-012 ──────────────────────────────────────────────────────
  it('TC-CART-012: FR-07 API cart requires auth and stores cart item', async function () {
    const d = testData.api_cart_add_requires_token;

    const resNoAuth = await addToCartApi(config.apiUrl, '', d.cartItem);
    expect(resNoAuth.status).to.equal(
      d.expectedStatusWithoutToken,
      `Expected ${d.expectedStatusWithoutToken} for POST /api/cart without token, got ${resNoAuth.status}`,
    );

    const loginRes = await loginUser(config.apiUrl, d.testUserEmail, d.testUserPassword);
    expect(loginRes.token).to.exist;

    const resWithAuth = await addToCartApi(config.apiUrl, loginRes.token, d.cartItem);
    expect(resWithAuth.status).to.equal(
      d.expectedStatusWithToken,
      `Expected ${d.expectedStatusWithToken} for POST /api/cart with valid token, got ${resWithAuth.status}`,
    );

    const getRes = await getCartApi(config.apiUrl, loginRes.token);
    expect(getRes.ok, `GET /api/cart should succeed, got ${getRes.status}`).to.be.true;
    const cartData = await getRes.json();

    if (Array.isArray(cartData)) {
      const found = cartData.some(
        (item: any) => item.name && item.name.includes('iPhone'),
      );
      expect(found).to.be.true;
    } else {
      expect(cartData).to.have.property('id', d.cartItem.id);
    }
  });
});
