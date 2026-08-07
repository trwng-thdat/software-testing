import { WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { buildDriver } from '../utils/driver';
import { loadCases, TestCase } from '../utils/dataLoader';
import { dismissAnyAlert, actAndReadAlertIfAny } from '../utils/alerts';
import { captureBug } from '../utils/bugReporter';
import { config, RUN_BY, RUN_TIMESTAMP } from '../utils/config';
import { AdminOrdersPage } from '../utils/adminOrdersPage';
import {
  ensureUser,
  login,
  seedOrder,
  getOrder,
  getAdminOrdersRaw,
  updateOrderStatusRaw,
  UserRecord,
  OrderRecord,
} from '../utils/api';

const FEATURE = 'fr18-admin-orders';
const cases = loadCases<any, any>(FEATURE); // throws if < 12

/** A second buyer, so "admin sees every user's orders" is actually provable. */
const SECOND_USER = {
  email: 'hw04.buyer2@eshop.test',
  password: 'Fixture@123',
  name: 'HW04 Second Buyer',
};

describe(`${FEATURE} [${config.browser}] - ${RUN_BY}`, function () {
  let driver: WebDriver;
  let page: AdminOrdersPage;
  let adminToken: string;
  let userToken: string;
  let user: UserRecord;
  let secondToken: string;

  before(async function () {
    // Seed sessions through the API rather than the login form: /api/login adds
    // 2 to login_attempts on failure and locks the account at 3
    // (server.js:55-60), so driving the form per case is a real lockout risk.
    const admin = await login(config.adminEmail, config.adminPassword);
    adminToken = admin.token;
    expect(admin.user.role, 'precondition: the admin fixture really is an admin').to.equal('admin');

    const buyer = await ensureUser(config.userEmail, config.userPassword);
    userToken = buyer.token;
    user = buyer.user;

    const second = await ensureUser(SECOND_USER.email, SECOND_USER.password, SECOND_USER.name);
    secondToken = second.token;

    driver = await buildDriver();
    page = new AdminOrdersPage(driver);
    await page.openAsAdmin(adminToken);
  });

  after(async function () {
    await driver?.quit();
  });

  afterEach(async function () {
    await dismissAnyAlert(driver); // admin uses alert() heavily; a leak poisons later tests
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
      case 'TC-ADMIN-01':
        return adminSeesAllUsersOrders(c);
      case 'TC-ADMIN-02':
      case 'TC-ADMIN-03':
      case 'TC-ADMIN-04':
      case 'TC-ADMIN-05':
      case 'TC-ADMIN-06':
        return validTransitionViaUi(c);
      case 'TC-ADMIN-07':
      case 'TC-ADMIN-08':
      case 'TC-ADMIN-09':
      case 'TC-ADMIN-10':
      case 'TC-ADMIN-11':
        return illegalTransitionRejected(c);
      case 'TC-ADMIN-12':
      case 'TC-ADMIN-13':
        return adminApiRequiresAdminRole(c);
      case 'TC-ADMIN-14':
        return addressRenderedAsText(c);
      case 'TC-ADMIN-15':
        return unknownOrderReturns404(c);
      case 'TC-ADMIN-16':
        return terminalStatesOfferNoActions(c);
      default:
        throw new Error(`No scenario implemented for ${c.tcId} — add it or mark skipReason.`);
    }
  }

  // ---------------------------------------------------------------------------
  // Pattern 1 (UI state) + Pattern 2 (API persistence cross-check)
  // ---------------------------------------------------------------------------

  async function adminSeesAllUsersOrders(c: TestCase<any, any>): Promise<void> {
    // Two different buyers, so a table showing only one user's orders fails.
    await seedOrder(userToken, adminToken);
    await seedOrder(secondToken, adminToken);
    await page.reload(adminToken);

    const buyers = await page.distinctBuyers();
    expect(
      buyers.length,
      `SRS FR-18: admin must see orders from every user (found buyers: ${buyers.join(', ')})`,
    ).to.be.at.least(c.expected.minDistinctUsers);
  }

  async function validTransitionViaUi(c: TestCase<any, any>): Promise<void> {
    const order = await seedOrder(userToken, adminToken, { status: c.input.seedStatus });
    await page.reload(adminToken);

    await page.clickAction(order.id, c.input.buttonLabel);

    // Pattern 1 — the operator must see the new label.
    expect(
      await page.waitForStatusLabel(order.id, c.expected.statusLabel),
      `order #${order.id} must show "${c.expected.statusLabel}" after "${c.input.buttonLabel}"`,
    ).to.equal(true);

    // Pattern 2 — the UI label is not evidence the record changed.
    const stored = await getOrder(order.id);
    expect(stored?.status, 'stored status must match the label shown').to.equal(c.expected.storedStatus);
  }

  // ---------------------------------------------------------------------------
  // Pattern 3 (rejection) + Pattern 4 (state-machine integrity)
  // ---------------------------------------------------------------------------

  async function illegalTransitionRejected(c: TestCase<any, any>): Promise<void> {
    const order = await seedOrder(userToken, adminToken, { status: c.input.seedStatus });

    // Drive the API directly: the endpoint is the authority on the state
    // machine, and several illegal transitions have no UI button at all, so a
    // UI-only check would silently pass without ever exercising the rule.
    const res = await updateOrderStatusRaw(adminToken, order.id, c.input.targetStatus);

    expect(
      res.status,
      `SRS FR-10 forbids ${c.input.seedStatus} -> ${c.input.targetStatus}, so it must be refused ` +
        `(server said: ${JSON.stringify(res.body)})`,
    ).to.not.equal(200);

    // Rejection is only real if the record did not move.
    const stored = await getOrder(order.id);
    expect(stored?.status, 'a refused transition must leave the status untouched')
      .to.equal(c.expected.storedStatus);
  }

  async function terminalStatesOfferNoActions(c: TestCase<any, any>): Promise<void> {
    const offenders: string[] = [];

    for (const status of c.input.seedStatuses as string[]) {
      const order = await seedOrder(userToken, adminToken, { status });
      await page.reload(adminToken);

      const buttons = await page.actionButtonsOf(order.id);
      if (buttons.length !== c.expected.actionButtonCount) {
        offenders.push(`#${order.id} (${status}) offers: ${buttons.join(', ')}`);
      }
    }

    // Pattern 1/4 — a terminal state must not invite a further transition.
    expect(
      offenders,
      `SRS FR-10: delivered and canceled are terminal, so no status button may be offered. ${offenders.join(' | ')}`,
    ).to.deep.equal([]);
  }

  // ---------------------------------------------------------------------------
  // Pattern 5 (security behaviour)
  // ---------------------------------------------------------------------------

  async function adminApiRequiresAdminRole(c: TestCase<any, any>): Promise<void> {
    if (c.input.useNoToken) {
      const res = await getAdminOrdersRaw();
      expect(res.status, 'SRS FR-12: an admin endpoint must reject an unauthenticated request')
        .to.equal(c.expected.httpStatus);
      return;
    }

    // A normal user's JWT is valid but carries role="user".
    expect(user.role, 'precondition: the fixture buyer is not an admin').to.equal('user');
    const res = await getAdminOrdersRaw(userToken);

    expect(
      c.expected.httpStatusOneOf as number[],
      `SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be ` +
        `refused with 401/403 but got HTTP ${res.status}`,
    ).to.include(res.status);
  }

  async function addressRenderedAsText(c: TestCase<any, any>): Promise<void> {
    const order = await seedOrder(userToken, adminToken, {
      status: c.input.seedStatus,
      shippingAddress: c.input.shippingAddress,
    });

    const boldBefore = await page.countBoldElementsInTable();
    await page.reload(adminToken);
    const boldAfter = await page.countBoldElementsInTable();

    // The payload must come back as literal text...
    expect(
      await page.addressTextOf(order.id),
      'SRS FR-18: the shipping address must be displayed as plain text',
    ).to.equal(c.expected.renderedAsText);

    // ...and must not have been parsed into real markup.
    expect(
      boldAfter - boldBefore,
      'an HTML payload in the address must not be rendered as an element',
    ).to.equal(c.expected.boldElementsAdded);
  }

  async function unknownOrderReturns404(c: TestCase<any, any>): Promise<void> {
    const missing = await getOrder(c.input.orderId);
    expect(missing, `precondition: order ${c.input.orderId} must not exist`).to.equal(null);

    const res = await updateOrderStatusRaw(adminToken, c.input.orderId, c.input.targetStatus);
    expect(res.status, 'updating a non-existent order must report 404').to.equal(c.expected.httpStatus);
  }
});
