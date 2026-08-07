import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import { config } from './config';

/**
 * Page object for the FR-18 admin order screen (frontend-admin/src/App.jsx,
 * served from ADMIN_URL on port 5174).
 *
 * Why navigation is click-driven
 * ------------------------------
 * frontend-admin has no react-router at all. The whole console is one component
 * whose sections are switched by an `activeTab` useState. There is no /orders
 * route to visit — navigating to one serves the same SPA and lands on the
 * default "dashboard" tab. The orders table only appears after clicking the
 * "Đơn hàng" item in the sidebar.
 *
 * Auth is injected rather than typed: the app reads `localStorage.adminToken`
 * on mount and sets `axios.defaults.headers.common.Authorization` from it
 * (App.jsx:34-37), so seeding the key and reloading logs us in without touching
 * the login form. That matters because /api/login adds 2 to login_attempts per
 * failure and locks at 3 (server.js:55-60).
 *
 * Selector notes (SUT has ZERO data-testid and no `name` attributes):
 *  - tabs    -> tier 4, XPath on the exact Vietnamese label. Sidebar items are
 *               bare <li> elements carrying only Tailwind utility classes, so
 *               the visible text is the only stable discriminator.
 *               COUPLING: translating the UI breaks these.
 *  - rows    -> tier 3, `table tbody tr` scoped to the orders table, which is
 *               located first by its "Đơn hàng" heading.
 *  - cells   -> tier 3, positional. The table has a fixed 6-column header
 *               (ID / Người đặt / Tổng tiền / Địa chỉ / Trạng thái / Hành động)
 *               declared at App.jsx:783-789; the indices below mirror it.
 */

/** Column order of the orders table, per App.jsx:783-789. */
const COL = { id: 0, user: 1, total: 2, address: 3, status: 4, actions: 5 };

export class AdminOrdersPage {
  constructor(private driver: WebDriver) {}

  private readonly ORDERS_TAB = By.xpath("//li[normalize-space()='Đơn hàng']");
  private readonly ORDERS_HEADING = By.xpath("//h2[contains(normalize-space(),'Đơn hàng')]");
  private readonly TABLE = By.css('table');
  private readonly ROWS = By.css('table tbody tr');
  private readonly LOGIN_FORM = By.xpath("//h2[normalize-space()='Admin Login']");

  private el(by: By): Promise<WebElement> {
    return this.driver.wait(until.elementLocated(by), config.timeout);
  }

  /**
   * Load the console already authenticated, then open the orders tab.
   * The token is written before the reload so the mount effect picks it up.
   */
  async openAsAdmin(adminToken: string): Promise<void> {
    await this.driver.get(config.adminUrl);
    await this.driver.executeScript(
      'window.localStorage.setItem("adminToken", arguments[0]);',
      adminToken,
    );
    await this.driver.navigate().refresh();

    // On a 401/403 the app silently clears the token and drops to the login
    // form. Failing here with a clear message beats a confusing "no such
    // element" further down.
    await this.driver.wait(async () => {
      const tabs = await this.driver.findElements(this.ORDERS_TAB);
      const login = await this.driver.findElements(this.LOGIN_FORM);
      return tabs.length > 0 || login.length > 0;
    }, config.timeout);

    if ((await this.driver.findElements(this.LOGIN_FORM)).length > 0) {
      throw new Error(
        'Admin console fell back to the login form — the seeded adminToken was rejected.',
      );
    }
    await this.openOrdersTab();
  }

  /** Click the sidebar tab and wait for the orders table itself to render. */
  async openOrdersTab(): Promise<void> {
    await (await this.el(this.ORDERS_TAB)).click();
    await this.driver.wait(until.elementLocated(this.ORDERS_HEADING), config.timeout);
    await this.driver.wait(until.elementLocated(this.TABLE), config.timeout);
  }

  /**
   * Re-fetch the orders list. `updateOrderStatus` calls fetchData() itself, but
   * a test that changed data through the API needs the UI pulled again; the tab
   * round-trip is the app's only refresh affordance short of a full reload.
   */
  async reload(adminToken: string): Promise<void> {
    await this.driver.navigate().refresh();
    await this.driver.wait(async () => {
      const tabs = await this.driver.findElements(this.ORDERS_TAB);
      return tabs.length > 0;
    }, config.timeout);
    await this.openOrdersTab();
  }

  async rowCount(): Promise<number> {
    return (await this.driver.findElements(this.ROWS)).length;
  }

  /** Locate the row for an order id, or null when it is not on screen. */
  private async rowFor(orderId: number): Promise<WebElement | null> {
    const rows = await this.driver.findElements(this.ROWS);
    for (const row of rows) {
      const cells = await row.findElements(By.css('td'));
      if (!cells.length) continue;
      const idText = (await cells[COL.id].getText()).trim();
      if (idText === `#${orderId}`) return row;
    }
    return null;
  }

  private async requireRow(orderId: number): Promise<WebElement> {
    const row = await this.rowFor(orderId);
    if (!row) throw new Error(`Order #${orderId} is not present in the admin orders table.`);
    return row;
  }

  private async cellText(orderId: number, col: number): Promise<string> {
    const cells = await (await this.requireRow(orderId)).findElements(By.css('td'));
    return (await cells[col].getText()).trim();
  }

  /** The Vietnamese status label the operator actually sees. */
  async statusLabelOf(orderId: number): Promise<string> {
    return this.cellText(orderId, COL.status);
  }

  async addressTextOf(orderId: number): Promise<string> {
    return this.cellText(orderId, COL.address);
  }

  async buyerOf(orderId: number): Promise<string> {
    return this.cellText(orderId, COL.user);
  }

  /** Distinct buyer names across the table — evidence admin sees every user's orders. */
  async distinctBuyers(): Promise<string[]> {
    const rows = await this.driver.findElements(this.ROWS);
    const names: string[] = [];
    for (const row of rows) {
      const cells = await row.findElements(By.css('td'));
      if (cells.length > COL.user) names.push((await cells[COL.user].getText()).trim());
    }
    return [...new Set(names.filter(Boolean))];
  }

  /** Labels of every action button offered for an order. */
  async actionButtonsOf(orderId: number): Promise<string[]> {
    const cells = await (await this.requireRow(orderId)).findElements(By.css('td'));
    if (cells.length <= COL.actions) return [];
    const buttons = await cells[COL.actions].findElements(By.css('button'));
    return Promise.all(buttons.map((b) => b.getText().then((t) => t.trim())));
  }

  /** Click a named action button in an order's row. */
  async clickAction(orderId: number, label: string): Promise<void> {
    const cells = await (await this.requireRow(orderId)).findElements(By.css('td'));
    const buttons = await cells[COL.actions].findElements(By.css('button'));
    for (const b of buttons) {
      if ((await b.getText()).trim() === label) {
        await b.click();
        return;
      }
    }
    const available = await this.actionButtonsOf(orderId);
    throw new Error(
      `No "${label}" button on order #${orderId}. Available: ${available.join(', ') || '(none)'}`,
    );
  }

  /**
   * Wait for a row's status label to become `expected`.
   *
   * updateOrderStatus() re-fetches the whole list on success, so the table is
   * replaced wholesale — re-locate the row on each poll instead of caching a
   * WebElement, which React would have invalidated (StaleElementReferenceError).
   */
  async waitForStatusLabel(orderId: number, expected: string, timeoutMs = config.timeout): Promise<boolean> {
    return this.driver
      .wait(async () => {
        try {
          return (await this.statusLabelOf(orderId)) === expected;
        } catch {
          return false; // row briefly absent while the list re-renders
        }
      }, timeoutMs)
      .then(() => true)
      .catch(() => false);
  }

  /** Count real <b> elements — pattern 5 (an XSS payload must render as text). */
  async countBoldElementsInBody(): Promise<number> {
    return (await this.driver.findElements(By.css('body b'))).length;
  }

  /** Bold elements inside the orders table only, scoping out unrelated page chrome. */
  async countBoldElementsInTable(): Promise<number> {
    return (await this.driver.findElements(By.css('table b'))).length;
  }
}
