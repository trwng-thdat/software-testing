import { WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { buildDriver } from '../utils/driver';
import { loadCases, TestCase } from '../utils/dataLoader';
import { dismissAnyAlert, actAndReadAlertIfAny } from '../utils/alerts';
import { captureBug } from '../utils/bugReporter';
import { config, RUN_BY, RUN_TIMESTAMP } from '../utils/config';
import { CheckoutPage } from '../utils/checkoutPage';
import {
  ensureUser,
  getProduct,
  getLatestOrder,
  checkoutRaw,
  applyCouponRaw,
  recordCouponUsage,
  getCouponByCode,
  createCoupon,
  deleteCoupon,
  deleteCouponsByCode,
  UserRecord,
  OrderRecord,
} from '../utils/api';

const FEATURE = 'fr08-checkout';
const cases = loadCases<any, any>(FEATURE); // throws if < 12

describe(`${FEATURE} [${config.browser}] - ${RUN_BY}`, function () {
  let driver: WebDriver;
  let page: CheckoutPage;
  let token: string;
  let user: UserRecord;

  /** Seeded product prices, read from the API so the oracle is not hardcoded. */
  const prices = new Map<number, number>();

  before(async function () {
    // Seed the session through the API, not the login form: /api/login adds 2 to
    // login_attempts on failure and locks the account at 3 (server.js:55-60), so
    // driving the form 16 times is a real lockout risk.
    const session = await ensureUser(config.userEmail, config.userPassword);
    token = session.token;
    user = session.user;

    driver = await buildDriver();
    page = new CheckoutPage(driver);

    await driver.get(config.webUrl);
    await driver.executeScript('window.localStorage.setItem("token", arguments[0]);', token);

    // Cache the real prices of every product referenced by the data file, so the
    // expected totals are computed from the SUT's own catalogue rather than
    // duplicated as magic numbers in the spec.
    const ids = new Set<number>();
    for (const c of cases) {
      for (const item of (c.input.cart ?? []) as { productId: number }[]) ids.add(item.productId);
    }
    for (const id of ids) prices.set(id, (await getProduct(id)).price);
  });

  after(async function () {
    await driver?.quit();
  });

  beforeEach(async function () {
    // A hard load resets CartContext's in-memory state, guaranteeing every case
    // starts from an empty cart regardless of what the previous one left behind.
    await page.openSite();
    await driver.executeScript('window.localStorage.setItem("token", arguments[0]);', token);
    await page.openSite();
  });

  afterEach(async function () {
    await dismissAnyAlert(driver); // never let an alert leak into the next test
    if (this.currentTest?.state === 'failed') {
      const tcId = this.currentTest.title.split(' ')[0];
      const c = cases.find((x) => x.tcId === tcId);
      const shot = await captureBug(driver, {
        tcId,
        feature: FEATURE,
        expected: c?.srs ?? 'see data file',
        actual: this.currentTest.err?.message ?? 'unknown',
      });
      addContext(this, { title: 'Screenshot', value: shot });
    }
  });

  for (const c of cases) {
    it(`${c.tcId} - ${c.title}`, async function () {
      if (c.skipReason) this.skip();
      addContext(this, {
        title: 'Run metadata',
        value: {
          runBy: RUN_BY,
          browser: config.browser,
          timestamp: RUN_TIMESTAMP,
          type: c.type,
          srs: c.srs,
        },
      });
      await run(c);
    });
  }

  /** Dispatch each TC ID to its scenario. Data always comes from the loaded case. */
  async function run(c: TestCase<any, any>): Promise<void> {
    switch (c.tcId) {
      case 'TC-CHECKOUT-01':
        return checkoutSingleItem(c);
      case 'TC-CHECKOUT-02':
        return checkoutMultipleItems(c);
      case 'TC-CHECKOUT-03':
        return cartClearedAfterCheckout(c);
      case 'TC-CHECKOUT-04':
      case 'TC-CHECKOUT-05':
      case 'TC-CHECKOUT-06':
        return couponApplied(c);
      case 'TC-CHECKOUT-07':
        return totalNotUserEditable(c);
      case 'TC-CHECKOUT-08':
      case 'TC-CHECKOUT-09':
      case 'TC-CHECKOUT-10':
      case 'TC-CHECKOUT-14':
        return couponRejected(c);
      case 'TC-CHECKOUT-11':
        return guestCannotCheckout(c);
      case 'TC-CHECKOUT-12':
        return couponUsageLimit(c);
      case 'TC-CHECKOUT-13':
        return couponBoundaryAccepted(c);
      case 'TC-CHECKOUT-15':
        return discountNeverExceedsTotal(c);
      case 'TC-CHECKOUT-16':
        return emptyCartCannotCheckout(c);
      default:
        throw new Error(`No scenario implemented for ${c.tcId} — add it or mark skipReason.`);
    }
  }

  /** Expected subtotal for a cart, computed from the catalogue's real prices. */
  function subtotalOf(cart: { productId: number; quantity: number }[]): number {
    return cart.reduce((sum, i) => sum + (prices.get(i.productId) ?? 0) * i.quantity, 0);
  }

  /** Orders are only ever appended, so "new" means a higher id than the pre-action max. */
  async function latestOrderId(): Promise<number> {
    return (await getLatestOrder(token))?.id ?? 0;
  }

  /**
   * Make sure `code` still has per-user allowance left, re-minting it if not.
   *
   * `coupon_usage` rows are keyed by coupon_id and the SUT exposes no endpoint to
   * delete them, so once the fixture account exhausts a single-use seeded code it
   * stays exhausted for every future run. Re-creating the code yields a new
   * coupon_id that the old usage rows no longer match, which restores the
   * allowance without touching the discount rules under test — the replacement
   * copies the original's type, value, threshold, expiry and usage cap verbatim.
   *
   * This resets FIXTURE state only. It does not weaken any assertion: the C5
   * limit itself is still proven, on its own disposable code, by TC-CHECKOUT-12.
   */
  async function ensureCouponAllowance(code: string, totalAmount: number): Promise<void> {
    const existing = await getCouponByCode(token, code);
    const probe = await applyCouponRaw({ code, total_amount: totalAmount, user_id: user.id });
    // Only a spent allowance warrants a reset; every other rejection is a finding.
    if (probe.status === 200 || !String(probe.body?.error ?? '').includes('giới hạn')) return;

    await deleteCoupon(token, existing.id);
    await createCoupon(token, {
      code: existing.code,
      type: existing.type,
      discount_value: existing.discount_value,
      min_order_amount: existing.min_order_amount,
      expired_at: existing.expired_at,
      max_uses_per_user: existing.max_uses_per_user,
    });
  }

  // ---------------------------------------------------------------------------
  // Pattern 1 (UI state) + Pattern 2 (API persistence cross-check)
  // ---------------------------------------------------------------------------

  async function checkoutSingleItem(c: TestCase<any, any>): Promise<void> {
    const beforeId = await latestOrderId();

    await page.seedCart(c.input.cart);
    await page.goToCheckout();
    await page.confirmCheckout();

    // Pattern 1 — the component swaps to the success state rather than toasting.
    expect(await page.waitForSuccess(), 'checkout must reach the success state').to.equal(true);

    // Pattern 2 — the UI claiming success is not evidence the order was stored.
    const order = await getLatestOrder(token);
    expect(order, 'an order record must exist after checkout').to.not.equal(null);
    expect((order as OrderRecord).id, 'checkout must create a NEW order').to.be.greaterThan(beforeId);
    expect((order as OrderRecord).status, 'new orders start as pending (SRS FR-08)')
      .to.equal(c.expected.orderStatus);
    expect((order as OrderRecord).total_amount, 'stored total must match the cart subtotal')
      .to.equal(subtotalOf(c.input.cart));
  }

  // ---------------------------------------------------------------------------
  // Pattern 4 (structural / data integrity)
  // ---------------------------------------------------------------------------

  async function checkoutMultipleItems(c: TestCase<any, any>): Promise<void> {
    const beforeId = await latestOrderId();
    const expectedSubtotal = subtotalOf(c.input.cart);

    await page.seedCart(c.input.cart);
    await page.goToCheckout();

    // Pattern 4 — every cart line must be listed, and the total must equal the
    // sum of the line items, not an independently-computed number.
    expect(await page.lineItemCount(), 'every cart line must appear on the confirmation page')
      .to.equal(c.expected.lineItemCount);
    expect(await page.getTotal(), 'displayed total must equal the sum of line items')
      .to.equal(expectedSubtotal);

    await page.confirmCheckout();
    expect(await page.waitForSuccess(), 'checkout must reach the success state').to.equal(true);

    const order = await getLatestOrder(token);
    expect((order as OrderRecord).id, 'checkout must create a NEW order').to.be.greaterThan(beforeId);
    expect((order as OrderRecord).total_amount, 'stored total must equal the sum of line items')
      .to.equal(expectedSubtotal);
  }

  async function cartClearedAfterCheckout(c: TestCase<any, any>): Promise<void> {
    await page.seedCart(c.input.cart);
    await page.goToCheckout();
    await page.confirmCheckout();
    expect(await page.waitForSuccess(), 'checkout must reach the success state').to.equal(true);

    // SRS FR-08 requires the cart to be emptied once payment succeeds. Navigate
    // client-side so the assertion reflects the app's own state, not a reload
    // (a reload would empty the in-memory cart on its own and mask the defect).
    await page.goToCart();
    expect(
      await page.isCartEmpty(),
      'SRS FR-08: the cart must be emptied after a successful checkout',
    ).to.equal(true);
  }

  async function couponApplied(c: TestCase<any, any>): Promise<void> {
    // Guard the oracle: a positive coupon case is only meaningful if the code
    // still has allowance left for this user. `coupon_usage` rows accumulate and
    // there is no API to clear them, so a seeded single-use code is permanently
    // spent for this account after the first checkout that redeems it — the
    // rejection would then look like a defect when it is stale fixture state.
    await ensureCouponAllowance(c.input.coupon, c.input.subtotal);

    await page.seedCart(c.input.cart);
    await page.goToCheckout();

    const subtotal = await page.getTotal();
    expect(subtotal, 'precondition: cart subtotal matches the catalogue').to.equal(c.input.subtotal);

    await page.applyCoupon(c.input.coupon);

    // Pattern 1 — a lowercase code must still be accepted (TC-CHECKOUT-06).
    expect(
      await page.isCouponApplied(),
      `coupon "${c.input.coupon}" is valid for this order, so it must be accepted ` +
        `(error shown: ${await page.couponError()})`,
    ).to.equal(true);

    // Pattern 4 — discount and final amount must satisfy the FR-09 formula.
    const amounts = await page.couponAmounts();
    expect(amounts, 'coupon block must show the discount and the final amount').to.not.equal(null);
    expect(amounts!.discount, 'discount computed per SRS FR-09').to.equal(c.expected.discountAmount);
    expect(amounts!.final, 'final = subtotal - discount').to.equal(c.expected.finalAmount);
    expect(
      amounts!.final,
      'internal consistency: final must equal subtotal minus the stated discount',
    ).to.equal(subtotal - amounts!.discount);

    expect(await page.displayedGrandTotal(), 'grand total must match the discounted amount')
      .to.equal(c.expected.finalAmount);
  }

  async function couponBoundaryAccepted(c: TestCase<any, any>): Promise<void> {
    // The cart cannot be composed to land on an arbitrary boundary amount (the
    // catalogue's cheapest product is far above 300.000₫), so this case drives
    // the coupon endpoint directly with the exact boundary total. The rule under
    // test — C3's comparison operator — lives entirely in that endpoint.
    const coupon = await getCouponByCode(token, c.input.coupon);
    expect(c.input.subtotal, 'precondition: total is exactly at the threshold')
      .to.equal(coupon.min_order_amount);

    const res = await applyCouponRaw({
      code: c.input.coupon,
      total_amount: c.input.subtotal,
      user_id: user.id,
    });

    // Pattern 3/4 — SRS FR-09 C3 reads `total_amount >= min_order_amount`, so a
    // total exactly on the threshold must be accepted, not rejected.
    expect(
      res.status,
      `SRS FR-09 C3 is ">=", so a total of exactly ${coupon.min_order_amount} must be accepted ` +
        `(server said: ${JSON.stringify(res.body)})`,
    ).to.equal(200);
    expect(res.body?.discount_amount, 'discount per SRS FR-09').to.equal(c.expected.discountAmount);
    expect(res.body?.final_amount, 'final = subtotal - discount').to.equal(c.expected.finalAmount);
  }

  // ---------------------------------------------------------------------------
  // Pattern 3 (negative / rejection — assert the ABSENCE of an effect)
  // ---------------------------------------------------------------------------

  async function couponRejected(c: TestCase<any, any>): Promise<void> {
    await page.seedCart(c.input.cart);
    await page.goToCheckout();

    const subtotalBefore = await page.getTotal();
    // Boundary cases specify a total the catalogue cannot produce; set it on the
    // form so the endpoint sees the exact amount under test. (The field being
    // editable at all is itself the defect asserted by TC-CHECKOUT-07.)
    if (c.input.subtotal !== undefined && c.input.subtotal !== subtotalBefore) {
      await page.tamperTotal(c.input.subtotal);
    }

    await page.applyCoupon(c.input.coupon);

    // Rejection must be visible...
    const error = await page.couponError();
    expect(error, `invalid coupon "${c.input.coupon}" must produce an error message`).to.not.equal(null);
    expect(error!.toLowerCase(), 'error must state the actual reason')
      .to.contain(String(c.expected.errorContains).toLowerCase());

    // ...and no discount may be applied.
    expect(await page.isCouponApplied(), 'a rejected coupon must not apply a discount')
      .to.equal(c.expected.discountApplied);
    expect(await page.couponAmounts(), 'no discount amounts may be shown').to.equal(null);
  }

  async function couponUsageLimit(c: TestCase<any, any>): Promise<void> {
    const spec = c.input.disposableCoupon;

    // Proving C5 requires SPENDING a coupon's whole per-user allowance. Doing
    // that to a seeded code would exhaust it for every later case and for every
    // re-run of the matrix, so mint a private code instead and drop it after.
    await deleteCouponsByCode(token, spec.code); // clean up a crashed earlier run
    const coupon = await createCoupon(token, spec);

    try {
      // First use must succeed — otherwise the rejection below would prove nothing.
      const firstUse = await applyCouponRaw({
        code: spec.code,
        total_amount: c.input.subtotal,
        user_id: user.id,
      });
      expect(firstUse.status, 'precondition: the first use of the coupon is allowed').to.equal(200);

      // Consume the entire allowance.
      for (let i = 0; i < coupon.max_uses_per_user; i++) {
        await recordCouponUsage(token, coupon.id);
      }

      const res = await applyCouponRaw({
        code: spec.code,
        total_amount: c.input.subtotal,
        user_id: user.id,
      });

      // Pattern 3 — SRS FR-09 C5: past the per-user limit the coupon is refused.
      expect(
        res.status,
        `coupon reused past max_uses_per_user=${coupon.max_uses_per_user} must be refused`,
      ).to.not.equal(200);
      expect(String(res.body?.error ?? '').toLowerCase(), 'error must cite the usage limit')
        .to.contain(String(c.expected.errorContains).toLowerCase());
      expect(res.body?.discount_amount, 'no discount may be returned').to.equal(undefined);
    } finally {
      // Always remove the disposable code, even when the assertion fails.
      await deleteCouponsByCode(token, spec.code);
    }
  }

  async function emptyCartCannotCheckout(c: TestCase<any, any>): Promise<void> {
    const beforeId = await latestOrderId();

    // Reach /checkout with nothing in the cart. /cart offers no button in the
    // empty state, so navigate directly — which is exactly the bypass a user
    // could perform, and the server must still refuse to create the order.
    await page.goToCheckout();
    expect(await page.lineItemCount(), 'precondition: the cart is empty').to.equal(0);

    await page.confirmCheckout();

    // Pattern 3 — the absence of an order is the assertion, not the UI message.
    const reachedSuccess = await page.waitForSuccess(4000);
    const afterId = await latestOrderId();
    expect(
      afterId,
      `SRS FR-08: an empty cart must not create an order (success shown: ${reachedSuccess})`,
    ).to.equal(beforeId);
  }

  // ---------------------------------------------------------------------------
  // Pattern 5 (security behaviour)
  // ---------------------------------------------------------------------------

  async function totalNotUserEditable(c: TestCase<any, any>): Promise<void> {
    const beforeId = await latestOrderId();
    const trueSubtotal = subtotalOf(c.input.cart);

    await page.seedCart(c.input.cart);
    await page.goToCheckout();

    // SRS FR-08: the payable amount is derived, never user input. Assert the UI
    // does not even offer the control.
    expect(
      await page.isTotalEditable(),
      'SRS FR-08: the order total must not be a user-editable field',
    ).to.equal(c.expected.totalFieldEditable);

    // Defence in depth: even if the client is tampered with, the server must
    // recompute the total from the cart rather than trusting the posted value.
    await page.tamperTotal(c.input.tamperedTotal);
    await page.confirmCheckout();
    await page.waitForSuccess(6000);

    const order = await getLatestOrder(token);
    if (order && order.id > beforeId) {
      expect(
        order.total_amount,
        `SRS FR-08: the backend must recompute the total from the cart, ` +
          `not store the client-supplied ${c.input.tamperedTotal}`,
      ).to.equal(c.expected.orderTotal ?? trueSubtotal);
    } else {
      // Refusing the tampered request outright also satisfies the SRS.
      expect(order?.id ?? 0, 'a tampered checkout must not create an order').to.equal(beforeId);
    }
  }

  async function guestCannotCheckout(c: TestCase<any, any>): Promise<void> {
    // Two surfaces, both must hold.
    // (a) API layer — an unauthenticated POST /api/checkout must be refused.
    const res = await checkoutRaw({
      items: c.input.cart,
      total_amount: subtotalOf(c.input.cart),
      coupon_id: null,
    });
    expect(res.status, 'SRS FR-08: checkout requires authentication').to.equal(c.expected.httpStatus);

    // (b) UI layer — a signed-out visitor must be stopped before /checkout.
    await driver.executeScript('window.localStorage.removeItem("token");');
    await page.openSite();
    await page.seedCart(c.input.cart);
    await page.goToCart();

    const alertText = await actAndReadAlertIfAny(driver, () => page.clickProceedToCheckout(), 4000);
    expect(alertText, 'a guest must be told to log in rather than reaching /checkout').to.not.equal(null);
    expect(await driver.getCurrentUrl(), 'a guest must not land on /checkout').to.not.contain('/checkout');

    // Restore the session for the remaining cases (beforeEach re-injects it too).
    await driver.executeScript('window.localStorage.setItem("token", arguments[0]);', token);
  }

  async function discountNeverExceedsTotal(c: TestCase<any, any>): Promise<void> {
    // VIP100 takes 100.000₫ off an order whose threshold is only 300.000₫, so a
    // near-threshold order is where a negative payable amount would surface.
    const res = await applyCouponRaw({
      code: c.input.coupon,
      total_amount: c.input.subtotal,
      user_id: user.id,
    });

    expect(res.status, `precondition: ${c.input.coupon} applies at ${c.input.subtotal}`).to.equal(200);

    // Pattern 4 — a payable amount can never be negative, whatever the discount.
    expect(
      res.body?.final_amount,
      'SRS FR-08: the amount payable must never go below zero',
    ).to.be.at.least(c.expected.finalAmountAtLeast);
    expect(
      res.body?.discount_amount,
      'the discount must never exceed the order total',
    ).to.be.at.most(c.input.subtotal);
  }
});
