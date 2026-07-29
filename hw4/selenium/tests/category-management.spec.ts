import { expect } from 'chai';
import { By, WebDriver, until } from 'selenium-webdriver';
import { loadConfig, AppConfig } from '../utils/config';
import { createDriver } from '../utils/driver';
import {
  loginUser,
  createCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../utils/api';
import { captureBugEvidence, initBugReport } from '../utils/bugReporter';

const testData = require('../data/category-management.data.json');

describe('FR-14: Category Management (Admin CRUD)', function () {
  let config: AppConfig;
  let driver: WebDriver;
  let adminUrl: string;

  before(async function () {
    config = loadConfig();
    adminUrl = process.env.ADMIN_URL || 'http://localhost:5174';
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
        'FR-14 Category Management',
      );
    }
  });

  async function loginAsAdmin(): Promise<void> {
    const d = testData.category_list_default;
    await driver.get(adminUrl + '/');
    await driver.sleep(1000);

    const emailInput = await driver.findElement(By.css(d.adminLoginEmailSelector));
    const passwordInput = await driver.findElement(By.css(d.adminLoginPasswordSelector));
    await emailInput.clear();
    await emailInput.sendKeys(d.adminEmail);
    await passwordInput.clear();
    await passwordInput.sendKeys(d.adminPassword);

    const loginBtns = await driver.findElements(By.css('button'));
    for (const btn of loginBtns) {
      const text = await btn.getText();
      if (text.includes('Login')) {
        await btn.click();
        break;
      }
    }
    await driver.sleep(500);
    try {
      await driver.wait(until.elementLocated(By.css('.w-64')), 10000);
    } catch {
    }
    await driver.sleep(500);
  }

  async function clickCategoriesTab(): Promise<void> {
    const tabs = await driver.findElements(By.css('li'));
    for (const tab of tabs) {
      const text = await tab.getText();
      if (text.includes('Danh mục')) {
        await tab.click();
        await driver.sleep(500);
        try {
          await driver.wait(until.elementLocated(By.css('table tbody tr')), 8000);
        } catch {
        }
        return;
      }
    }
    throw new Error('Could not find "Danh mục" tab in admin sidebar');
  }

  async function getCategoryNames(): Promise<string[]> {
    const names: string[] = [];
    const rows = await driver.findElements(By.css('table tbody tr'));
    for (const row of rows) {
      const cells = await row.findElements(By.css('td'));
      if (cells.length >= 2) {
        const name = await cells[1].getText();
        names.push(name);
      }
    }
    return names;
  }

  async function clickButtonByText(text: string): Promise<void> {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const btnText = await btn.getText();
      if (btnText.includes(text)) {
        await btn.click();
        return;
      }
    }
    throw new Error(`Button with text "${text}" not found`);
  }

  async function createCategoryViaUI(name: string): Promise<void> {
    const input = await driver.findElement(By.css('input[placeholder="Tên danh mục mới"]'));
    await input.clear();
    await input.sendKeys(name);
    const rowCountBefore = (await driver.findElements(By.css('table tbody tr'))).length;
    await clickButtonByText('Thêm mới');
    await driver.sleep(500);
    try {
      await driver.wait(async () => {
        const currentRows = await driver.findElements(By.css('table tbody tr'));
        return currentRows.length > rowCountBefore;
      }, 8000);
    } catch {
    }
    await driver.sleep(500);
  }

  async function getAdminToken(): Promise<string> {
    const d = testData.category_list_default;
    const res = await loginUser(config.apiUrl, d.adminEmail, d.adminPassword);
    return res.token;
  }

  // ─── TC-ADMIN_CATEGORY-001 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-001: FR-14 displays existing categories', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_list_default;
    const names = await getCategoryNames();
    expect(names.length).to.be.at.least(
      d.expectedMinCategoryCount,
      `Expected at least ${d.expectedMinCategoryCount} category in list`,
    );

    for (const seedName of d.expectedSeedCategoryNames) {
      const found = names.some((n) => n.includes(seedName));
      expect(found, `Expected seed category "${seedName}" to be in list`).to.be.true;
    }
  });

  // ─── TC-ADMIN_CATEGORY-002 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-002: FR-14 creates category with valid name', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_create_valid;
    const namesBefore = await getCategoryNames();

    await createCategoryViaUI(d.categoryName);
    const namesAfter = await getCategoryNames();

    const added = namesAfter.find((n) => n === d.categoryName || n.includes(d.categoryName));
    expect(added, `Category "${d.categoryName}" should appear in list after creation`).to.exist;
  });

  // ─── TC-ADMIN_CATEGORY-003 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-003: FR-14 rejects empty category name', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_create_empty_name;
    const namesBefore = await getCategoryNames();

    await createCategoryViaUI(d.categoryName);

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    const hasError = bodyText.includes('Lỗi') || bodyText.includes('error') || bodyText.includes('không');

    const namesAfter = await getCategoryNames();
    const noNewEntry = namesAfter.length === namesBefore.length;

    expect(noNewEntry || hasError).to.be.true;
  });

  // ─── TC-ADMIN_CATEGORY-004 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-004: FR-14 rejects whitespace-only category name', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_create_whitespace_name;
    const namesBefore = await getCategoryNames();

    await createCategoryViaUI(d.categoryName);

    const namesAfter = await getCategoryNames();
    const noNewWhitespaceEntry = namesAfter.length === namesBefore.length ||
      !namesAfter.some((n) => n.trim() === '');

    expect(noNewWhitespaceEntry).to.be.true;
  });

  // ─── TC-ADMIN_CATEGORY-005 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-005: FR-14 supports vietnamese category name', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_create_vietnamese_name;
    await createCategoryViaUI(d.categoryName);

    const namesAfter = await getCategoryNames();
    const found = namesAfter.some((n) => n.includes('Phụ kiện kiểm thử'));
    expect(found, `Vietnamese category name should appear in list`).to.be.true;
  });

  // ─── TC-ADMIN_CATEGORY-006 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-006: FR-14 safely renders html-like category name', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_create_html_safe_name;
    await createCategoryViaUI(d.categoryName);

    let alertTriggered = false;
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      await driver.switchTo().alert().dismiss();
      alertTriggered = true;
    } catch {
    }

    expect(alertTriggered, 'HTML injection in category name triggered alert! XSS vulnerability').to.be.false;
  });

  // ─── TC-ADMIN_CATEGORY-007 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-007: FR-14 updates category name via API', async function () {
    const d = testData.category_update_valid;
    const token = await getAdminToken();

    const createRes = await createCategoryApi(config.apiUrl, token, d.initialName);
    expect(createRes.ok, `POST /api/categories should succeed, got ${createRes.status}`).to.be.true;
    const created: any = await createRes.json();
    const categoryId = created.id || created.category?.id;

    const updateRes = await updateCategoryApi(config.apiUrl, token, categoryId, d.updatedName);
    expect(updateRes.ok, `PUT /api/categories/${categoryId} should succeed, got ${updateRes.status}`).to.be.true;

    const categories = await getCategoriesApi(config.apiUrl, token);
    const updated = categories.find((c: any) => c.id === categoryId);
    expect(updated, `Category id ${categoryId} should still exist`).to.exist;
    expect(updated!.name).to.equal(d.updatedName);
  });

  // ─── TC-ADMIN_CATEGORY-008 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-008: FR-14 rejects empty name on update', async function () {
    const d = testData.category_update_empty_name;
    const token = await getAdminToken();

    const createRes = await createCategoryApi(config.apiUrl, token, d.initialName);
    const created: any = await createRes.json();
    const categoryId = created.id || created.category?.id;

    const updateRes = await updateCategoryApi(config.apiUrl, token, categoryId, d.updatedName);
    expect(updateRes.ok).to.be.false;
  });

  // ─── TC-ADMIN_CATEGORY-009 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-009: FR-14 deletes category after creation', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_delete_valid;

    await createCategoryViaUI(d.categoryName);

    const namesAfterCreate = await getCategoryNames();
    const createdRow = namesAfterCreate.findIndex((n) => n === d.categoryName || n.includes(d.categoryName));
    expect(createdRow, `Category "${d.categoryName}" should exist after creation`).to.not.equal(-1);

    const rows = await driver.findElements(By.css('table tbody tr'));
    const targetRow = rows[createdRow >= 0 ? createdRow : rows.length - 1];
    const deleteBtns = await targetRow.findElements(By.css('button'));
    let deleteBtn: any = null;
    for (const btn of deleteBtns) {
      const t = await btn.getText();
      if (t.includes('Xóa')) { deleteBtn = btn; break; }
    }
    if (!deleteBtn) throw new Error('Delete button not found on target row');
    await deleteBtn.click();
    await driver.sleep(1000);

    const namesAfterDelete = await getCategoryNames();
    const stillExists = namesAfterDelete.some((n) => n === d.categoryName || n.includes(d.categoryName));
    expect(stillExists, `Category "${d.categoryName}" should be removed after delete`).to.be.false;
  });

  // ─── TC-ADMIN_CATEGORY-010 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-010: FR-14 keeps category when delete is cancelled (bug: SUT has no confirmation dialog)', async function () {
    await loginAsAdmin();
    await clickCategoriesTab();

    const d = testData.category_delete_cancel;
    const namesBefore = await getCategoryNames();
    const countBefore = namesBefore.length;

    const rows = await driver.findElements(By.css('table tbody tr'));
    if (rows.length === 0) {
      expect.fail('No category rows to test delete cancel');
    }

    const rowButtons = await rows[0].findElements(By.css('button'));
    let deleteBtn: any = null;
    for (const btn of rowButtons) {
      const t = await btn.getText();
      if (t.includes('Xóa')) { deleteBtn = btn; break; }
    }
    if (!deleteBtn) {
      expect.fail('No delete button found on category row');
    }

    await deleteBtn.click();
    await driver.sleep(500);

    let dialogHandled = false;
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      await driver.switchTo().alert().dismiss();
      dialogHandled = true;
    } catch {
    }

    if (dialogHandled) {
      const namesAfter = await getCategoryNames();
      const countAfter = namesAfter.length;
      expect(countAfter).to.equal(
        countBefore,
        'Category count should stay the same after cancelling delete',
      );
    } else {
      const namesAfter = await getCategoryNames();
      const countAfter = namesAfter.length;
      if (countAfter < countBefore) {
        expect.fail(
          'Category was deleted without confirmation dialog. Per FR-14, delete should have confirmation.',
        );
      }
    }
  });

  // ─── TC-ADMIN_CATEGORY-011 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-011: FR-14 category write APIs require token', async function () {
    const d = testData.api_category_write_requires_token;
    const token = await getAdminToken();
    const uniqueName = d.testName + ' ' + Date.now();

    const resPostNoAuth = await createCategoryApi(config.apiUrl, '', uniqueName);
    expect(
      [401, 403].includes(resPostNoAuth.status),
      `POST /api/categories without token should return 401/403, got ${resPostNoAuth.status}`,
    ).to.be.true;

    const resPostAuth = await createCategoryApi(config.apiUrl, token, uniqueName);
    expect(resPostAuth.ok, `POST /api/categories with token should succeed, got ${resPostAuth.status}`).to.be.true;
    const created: any = await resPostAuth.json();
    const categoryId = created.id || created.category?.id;

    const resPutNoAuth = await updateCategoryApi(config.apiUrl, '', categoryId, 'Hacked');
    expect(
      [401, 403].includes(resPutNoAuth.status),
      `PUT /api/categories/${categoryId} without token should return 401/403, got ${resPutNoAuth.status}`,
    ).to.be.true;

    const resDelNoAuth = await deleteCategoryApi(config.apiUrl, '', categoryId);
    expect(
      [401, 403].includes(resDelNoAuth.status),
      `DELETE /api/categories/${categoryId} without token should return 401/403, got ${resDelNoAuth.status}`,
    ).to.be.true;

    const resDelAuth = await deleteCategoryApi(config.apiUrl, token, categoryId);
    expect(resDelAuth.ok, `DELETE /api/categories/${categoryId} with token should succeed`).to.be.true;
  });

  // ─── TC-ADMIN_CATEGORY-012 ────────────────────────────────────────────
  it('TC-ADMIN_CATEGORY-012: FR-14 category API supports full CRUD flow', async function () {
    const d = testData.api_category_crud_end_to_end;
    const token = await getAdminToken();
    const uniqueName = d.categoryName + ' ' + Date.now();
    const updatedName = d.updatedName + ' ' + Date.now();

    const createRes = await createCategoryApi(config.apiUrl, token, uniqueName);
    expect(createRes.ok, 'POST /api/categories should succeed').to.be.true;
    const created: any = await createRes.json();
    const categoryId = created.id || created.category?.id;
    expect(categoryId, 'Created category should have an id').to.exist;

    const listRes = await getCategoriesApi(config.apiUrl, token);
    const found = listRes.find((c: any) => c.id === categoryId);
    expect(found, 'Created category should appear in GET /api/categories').to.exist;
    expect(found!.name).to.equal(uniqueName);

    const updateRes = await updateCategoryApi(config.apiUrl, token, categoryId, updatedName);
    expect(updateRes.ok, 'PUT /api/categories/:id should succeed').to.be.true;

    const listAfterUpdate = await getCategoriesApi(config.apiUrl, token);
    const updated = listAfterUpdate.find((c: any) => c.id === categoryId);
    expect(updated, 'Category should still exist after update').to.exist;
    expect(updated!.name).to.equal(updatedName);

    const deleteRes = await deleteCategoryApi(config.apiUrl, token, categoryId);
    expect(deleteRes.ok, 'DELETE /api/categories/:id should succeed').to.be.true;

    const listAfterDelete = await getCategoriesApi(config.apiUrl, token);
    const deleted = listAfterDelete.find((c: any) => c.id === categoryId);
    expect(deleted, 'Deleted category should no longer appear in list').to.be.undefined;
  });
});
