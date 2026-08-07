import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import { config } from './config';

/**
 * Page object for the FR-08 checkout flow across three routes:
 *   /product/:id  (frontend-web/src/pages/ProductDetail.jsx) — the ONLY way to fill the cart
 *   /cart         (frontend-web/src/pages/Cart.jsx)
 *   /checkout     (frontend-web/src/pages/Checkout.jsx)
 *
 * Why the cart is seeded through the UI and not the API
 * ----------------------------------------------------
 * CartContext.jsx holds the cart in a bare `useState([])`. There is no
 * localStorage persistence and no server round-trip, so the cart cannot be
 * injected the way FR-04 injects the auth token. `POST /api/cart` exists on the
 * backend but writes to an in-memory `userCarts` map that Checkout.jsx never
 * reads. The cart therefore only exists inside one live SPA session: it must be
 * built by clicking, and any full page load (driver.get, refresh) empties it.
 * Every navigation below is client-side for that reason.
 *
 * Selector notes (SUT has ZERO data-testid and no `name` attributes):
 *  - coupon input  -> tier 2, placeholder="Nhập mã giảm giá..." (Checkout.jsx:111).
 *  - total input   -> tier 3, the only input[type=number] on /checkout (Checkout.jsx:93).
 *  - quantity      -> tier 3, the only input[type=number] on /product/:id.
 *  - buttons       -> tier 4, XPath on the exact Vietnamese label. The page has
 *                     several unlabelled <button> elements with only Tailwind
 *                     utility classes, so text is the only stable discriminator.
 *                     COUPLING: translating the UI breaks these.
 */
export class CheckoutPage {
  constructor(private driver: WebDriver) {}

  // --- /product/:id ---------------------------------------------------------
  private readonly QTY_INPUT = By.css('input[type="number"]');
  private readonly ADD_TO_CART = By.xpath(
    "//button[contains(normalize-space(),'Thêm vào giỏ hàng') or contains(normalize-space(),'Đã thêm')]",
  );

  // --- /cart ---------------------------------------------------------------
  private readonly CART_ROWS = By.css('table tbody tr');
  private readonly GO_CHECKOUT = By.xpath("//button[normalize-space()='Tiến hành thanh toán']");
  private readonly EMPTY_CART_HEADING = By.xpath(
    "//h2[normalize-space()='Giỏ hàng của bạn đang trống']",
  );

  // --- /checkout -----------------------------------------------------------
  private readonly CHECKOUT_HEADING = By.xpath("//h2[normalize-space()='Xác Nhận Đơn Hàng']");
  private readonly TOTAL_INPUT = By.css('input[type="number"]');
  private readonly LINE_ITEMS = By.css('ul.list-disc li');
  private readonly COUPON_INPUT = By.css('input[placeholder="Nhập mã giảm giá..."]');
  private readonly APPLY_COUPON = By.xpath("//button[normalize-space()='Áp dụng' or normalize-space()='...']");
  private readonly COUPON_ERROR = By.css('p.text-red-600.text-sm');
  private readonly COUPON_SUCCESS = By.css('div.text-green-700');
  private readonly CONFIRM = By.xpath(
    "//button[normalize-space()='Xác Nhận Thanh Toán' or normalize-space()='Đang xử lý...']",
  );
  private readonly SUCCESS_HEADING = By.xpath("//h2[normalize-space()='Thanh toán thành công!']");

  /** Elements are re-located on every access — React re-renders invalidate cached handles. */
  private el(by: By): Promise<WebElement> {
    return this.driver.wait(until.elementLocated(by), config.timeout);
  }

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  /**
   * Hard-load the SPA at the site root. This RESETS the cart (see class comment),
   * so call it once per test before seeding, never between seeding and checkout.
   */
  async openSite(): Promise<void> {
    await this.driver.get(`${config.webUrl}/`);
    await this.driver.wait(until.elementLocated(By.css('body')), config.timeout);
  }

  /**
   * Client-side navigation via react-router's history, which preserves the
   * in-memory cart. `driver.get()` would remount CartProvider and wipe it.
   */
  private async navigate(path: string): Promise<void> {
    await this.driver.executeScript(
      `window.history.pushState({}, '', arguments[0]);
       window.dispatchEvent(new PopStateEvent('popstate'));`,
      path,
    );
  }

  async goToProduct(productId: number): Promise<void> {
    await this.navigate(`/product/${productId}`);
    await this.driver.wait(until.elementLocated(this.ADD_TO_CART), config.timeout);
  }

  async goToCart(): Promise<void> {
    await this.navigate('/cart');
    // Either the table or the empty-state heading renders — wait for whichever.
    await this.driver.wait(async () => {
      const rows = await this.driver.findElements(this.CART_ROWS);
      const empty = await this.driver.findElements(this.EMPTY_CART_HEADING);
      return rows.length > 0 || empty.length > 0;
    }, config.timeout);
  }

  async goToCheckout(): Promise<void> {
    await this.navigate('/checkout');
    await this.driver.wait(until.elementLocated(this.CHECKOUT_HEADING), config.timeout);
  }

  // -------------------------------------------------------------------------
  // Cart seeding
  // -------------------------------------------------------------------------

  /**
   * Add one product to the cart from its detail page.
   *
   * ProductDetail.jsx:24-32 carries a seeded defect: `clickCount` swallows the
   * FIRST click entirely and only the second one calls addToCart. This helper
   * therefore clicks until the button flips to "Đã thêm", rather than assuming
   * one click works. That is a deliberate workaround for a known SUT bug so the
   * FR-08 cases can reach checkout at all — it is NOT an assertion, and the
   * defect itself belongs to the FR-06 add-to-cart feature, out of scope here.
   */
  async addProductToCart(productId: number, quantity: number): Promise<void> {
    await this.goToProduct(productId);

    const qty = await this.el(this.QTY_INPUT);
    await qty.clear();
    await qty.sendKeys(String(quantity));

    // Up to 3 attempts: 1 swallowed by clickCount, 1 real, 1 spare for a slow render.
    for (let attempt = 0; attempt < 3; attempt++) {
      await (await this.el(this.ADD_TO_CART)).click();
      const added = await this.driver
        .wait(until.elementLocated(By.xpath("//button[normalize-space()='Đã thêm']")), 1500)
        .then(() => true)
        .catch(() => false);
      if (added) return;
    }
    throw new Error(
      `Could not add product ${productId} to the cart after 3 clicks — the "Đã thêm" state never appeared.`,
    );
  }

  /** Seed the whole cart in one session. Assumes openSite() already ran. */
  async seedCart(items: { productId: number; quantity: number }[]): Promise<void> {
    for (const item of items) {
      await this.addProductToCart(item.productId, item.quantity);
      // "Đã thêm" reverts after 2s (setTimeout in ProductDetail.jsx:31). Wait it
      // out so the next product's button starts from the normal label, otherwise
      // the added-state probe above would match the previous product's flash.
      await this.driver
        .wait(until.elementLocated(By.xpath("//button[normalize-space()='Thêm vào giỏ hàng']")), 3000)
        .catch(() => undefined);
    }
  }

  // -------------------------------------------------------------------------
  // /cart queries
  // -------------------------------------------------------------------------

  async cartRowCount(): Promise<number> {
    return (await this.driver.findElements(this.CART_ROWS)).length;
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.driver.findElements(this.EMPTY_CART_HEADING)).length > 0;
  }

  async clickProceedToCheckout(): Promise<void> {
    await (await this.el(this.GO_CHECKOUT)).click();
  }

  // -------------------------------------------------------------------------
  // /checkout queries and actions
  // -------------------------------------------------------------------------

  async lineItemCount(): Promise<number> {
    return (await this.driver.findElements(this.LINE_ITEMS)).length;
  }

  async lineItemTexts(): Promise<string[]> {
    const els = await this.driver.findElements(this.LINE_ITEMS);
    return Promise.all(els.map((e) => e.getText()));
  }

  async getTotal(): Promise<number> {
    return Number((await (await this.el(this.TOTAL_INPUT)).getAttribute('value')) ?? '0');
  }

  /** True when the rendered total is a user-editable control (SRS says it must not be). */
  async isTotalEditable(): Promise<boolean> {
    const els = await this.driver.findElements(this.TOTAL_INPUT);
    if (!els.length) return false; // rendered as text — the SRS-compliant shape
    const el = els[0];
    return (await el.isEnabled()) && (await el.getAttribute('readonly')) === null;
  }

  /**
   * Overwrite the total field, driving React's own onChange so the component
   * state (and therefore the value posted to /api/checkout) really changes.
   * A plain `el.value = x` would be discarded on the next render.
   */
  async tamperTotal(value: number): Promise<void> {
    const el = await this.el(this.TOTAL_INPUT);
    await this.driver.executeScript(
      `const el = arguments[0], value = arguments[1];
       const setter = Object.getOwnPropertyDescriptor(
         window.HTMLInputElement.prototype, 'value').set;
       setter.call(el, String(value));
       el.dispatchEvent(new Event('input', { bubbles: true }));`,
      el,
      value,
    );
  }

  async applyCoupon(code: string): Promise<void> {
    const input = await this.el(this.COUPON_INPUT);
    await input.clear();
    await input.sendKeys(code);
    await (await this.el(this.APPLY_COUPON)).click();
    // handleApplyCoupon is async; wait for either outcome to render.
    await this.driver.wait(async () => {
      const err = await this.driver.findElements(this.COUPON_ERROR);
      const ok = await this.driver.findElements(this.COUPON_SUCCESS);
      return err.length > 0 || ok.length > 0;
    }, config.timeout);
  }

  async couponError(): Promise<string | null> {
    const els = await this.driver.findElements(this.COUPON_ERROR);
    return els.length ? els[0].getText() : null;
  }

  async couponSuccessText(): Promise<string | null> {
    const els = await this.driver.findElements(this.COUPON_SUCCESS);
    return els.length ? els[0].getText() : null;
  }

  async isCouponApplied(): Promise<boolean> {
    return (await this.driver.findElements(this.COUPON_SUCCESS)).length > 0;
  }

  /**
   * Amounts shown in the coupon success block, parsed back out of the localised
   * strings ("Tiết kiệm: 50.000 ₫").
   *
   * Match on the LABEL, not on position: the block renders three ₫ amounts, and
   * the first is inside the confirmation message ("Áp dụng thành công! Giảm
   * 50,000 ₫"). Taking amounts positionally read that message as the discount
   * and the real discount as the final amount, which produced a spurious
   * failure on a case the SUT actually handles correctly.
   */
  async couponAmounts(): Promise<{ discount: number; final: number } | null> {
    const text = await this.couponSuccessText();
    if (!text) return null;

    const amountOn = (label: string): number | null => {
      const line = text.split('\n').find((l) => l.includes(label));
      if (!line) return null;
      // toLocaleString() may emit '.' or ',' as the group separator depending on
      // the browser locale, so drop everything except digits and a leading '-'.
      const m = line.match(/(-?[\d.,\s]+)\s*₫/);
      return m ? Number(m[1].replace(/[^\d-]/g, '')) : null;
    };

    const discount = amountOn('Tiết kiệm');
    const final = amountOn('Thành tiền');
    if (discount === null || final === null) return null;
    return { discount, final };
  }

  /** The grand total the page says the user will pay. */
  async displayedGrandTotal(): Promise<number> {
    const el = await this.el(By.xpath("//span[contains(normalize-space(),'Tổng thanh toán')]"));
    const text = await el.getText();
    const m = text.match(/(-?[\d.,\s]+)\s*₫/);
    return m ? Number(m[1].replace(/[^\d-]/g, '')) : NaN;
  }

  async confirmCheckout(): Promise<void> {
    await (await this.el(this.CONFIRM)).click();
  }

  /** Wait for the success state to swap in; false if it never does. */
  async waitForSuccess(timeoutMs = config.timeout): Promise<boolean> {
    return this.driver
      .wait(until.elementLocated(this.SUCCESS_HEADING), timeoutMs)
      .then(() => true)
      .catch(() => false);
  }

  async isSuccessShown(): Promise<boolean> {
    return (await this.driver.findElements(this.SUCCESS_HEADING)).length > 0;
  }

  /** True when /checkout is still showing the confirmation form (no success swap). */
  async isStillOnCheckoutForm(): Promise<boolean> {
    return (await this.driver.findElements(this.CHECKOUT_HEADING)).length > 0;
  }
}
