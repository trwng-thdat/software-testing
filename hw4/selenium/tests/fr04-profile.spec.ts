import { WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { buildDriver } from '../utils/driver';
import { loadCases, TestCase } from '../utils/dataLoader';
import { dismissAnyAlert, actAndReadAlert, actAndReadAlertIfAny } from '../utils/alerts';
import { captureBug } from '../utils/bugReporter';
import { config, RUN_BY, RUN_TIMESTAMP } from '../utils/config';
import { ProfilePage } from '../utils/profilePage';
import { ensureUser, getMe, putMeRaw, resetProfile, UserRecord } from '../utils/api';

const FEATURE = 'fr04-profile';
const cases = loadCases<any, any>(FEATURE); // throws if < 12

/**
 * Baseline the fixture profile is restored to before every case.
 *
 * The phone is deliberately `912345678` — a value the CURRENT build's client-side
 * regex (Profile.jsx:43, /^[1-9][0-9]{8,9}$/) accepts. It is NOT SRS-valid, and
 * that is the point: cases which are not about phone validation (name, address,
 * Unicode, XSS) must be able to reach submit instead of being blocked by the
 * seeded phone defect. The SRS phone rule stays fully asserted, unweakened, by
 * TC-PROFILE-04..09, which set their own phone values.
 */
const BASELINE = {
  name: 'HW04 Fixture User',
  phone: '912345678',
  shipping_address: 'Baseline address',
};

describe(`${FEATURE} [${config.browser}] - ${RUN_BY}`, function () {
  let driver: WebDriver;
  let page: ProfilePage;
  let token: string;
  let user: UserRecord;

  before(async function () {
    // Seed the account through the API rather than the login form: the SUT's
    // /api/login increments login_attempts by 2 on failure and locks at 3, so
    // driving the UI form 15 times is a real lockout risk (server.js:55-60).
    const session = await ensureUser(config.userEmail, config.userPassword);
    token = session.token;
    user = session.user;

    driver = await buildDriver();
    page = new ProfilePage(driver);

    // Inject the token the way AuthContext expects (localStorage key "token").
    // Must land on the origin first — localStorage is origin-scoped.
    await driver.get(config.webUrl);
    await driver.executeScript('window.localStorage.setItem("token", arguments[0]);', token);
  });

  after(async function () {
    if (token) await resetProfile(token, BASELINE);
    await driver?.quit();
  });

  beforeEach(async function () {
    // Every case starts from the same stored state, so ordering cannot mask a defect.
    await resetProfile(token, BASELINE);
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
      case 'TC-PROFILE-01':
        return updateAllThreeFields(c);
      case 'TC-PROFILE-02':
        return updateNameOnly(c);
      case 'TC-PROFILE-03':
        return persistsAcrossReload(c);
      case 'TC-PROFILE-04':
      case 'TC-PROFILE-05':
        return phoneAccepted(c);
      case 'TC-PROFILE-06':
      case 'TC-PROFILE-07':
      case 'TC-PROFILE-08':
      case 'TC-PROFILE-09':
        return phoneRejected(c);
      case 'TC-PROFILE-10':
        return emptyNameBlocked(c);
      case 'TC-PROFILE-11':
        return emailNotEditable(c);
      case 'TC-PROFILE-12':
        return roleEscalationBlocked(c);
      case 'TC-PROFILE-13':
        return unicodeName(c);
      case 'TC-PROFILE-14':
        return longAddress(c);
      case 'TC-PROFILE-15':
        return htmlPayloadRenderedAsText(c);
      default:
        throw new Error(`No scenario implemented for ${c.tcId} — add it or mark skipReason.`);
    }
  }

  // ---------------------------------------------------------------------------
  // Pattern 1 (UI state) + Pattern 2 (API persistence cross-check)
  // ---------------------------------------------------------------------------

  async function updateAllThreeFields(c: TestCase<any, any>): Promise<void> {
    await page.open();
    await page.setName(c.input.name);
    await page.setPhone(c.input.phone);
    await page.setAddress(c.input.address);

    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'success alert text').to.equal(c.expected.alert);

    const stored = await getMe(token);
    expect(stored.name, 'persisted name').to.equal(c.expected.persisted.name);
    expect(stored.phone, 'persisted phone').to.equal(c.expected.persisted.phone);
    expect(stored.shipping_address, 'persisted address').to.equal(c.expected.persisted.shipping_address);
  }

  async function updateNameOnly(c: TestCase<any, any>): Promise<void> {
    const before = await getMe(token);

    await page.open();
    await page.setName(c.input.name);
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'success alert text').to.equal(c.expected.alert);

    const after = await getMe(token);
    expect(after.name, 'persisted name').to.equal(c.expected.persisted.name);
    for (const field of c.expected.unchangedFields as string[]) {
      expect(after[field], `${field} must be untouched`).to.equal(before[field]);
    }
  }

  async function persistsAcrossReload(c: TestCase<any, any>): Promise<void> {
    await page.open();
    await page.setName(c.input.name);
    await page.setPhone(c.input.phone);
    await page.setAddress(c.input.address);
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'success alert text').to.equal(c.expected.alert);

    await driver.navigate().refresh();
    await page.waitLoaded();

    expect(await page.getName(), 'name after reload').to.equal(c.expected.formAfterReload.name);
    expect(await page.getPhone(), 'phone after reload').to.equal(c.expected.formAfterReload.phone);
    expect(await page.getAddress(), 'address after reload').to.equal(c.expected.formAfterReload.address);
  }

  async function phoneAccepted(c: TestCase<any, any>): Promise<void> {
    await page.open();
    await page.setPhone(c.input.phone);

    // Per SRS a phone starting with 0 and 10-11 digits long is VALID, so the
    // success alert is the expectation. If the SUT rejects it, that is a defect.
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, `SRS says "${c.input.phone}" is a valid phone number`).to.equal(c.expected.alert);

    const stored = await getMe(token);
    expect(stored.phone, 'persisted phone').to.equal(c.expected.persisted.phone);
  }

  async function unicodeName(c: TestCase<any, any>): Promise<void> {
    await page.open();
    await page.setName(c.input.name);
    await page.setPhone(c.input.phone);
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'success alert text').to.equal(c.expected.alert);

    const stored = await getMe(token);
    expect(stored.name, 'Vietnamese diacritics must survive the round trip').to.equal(c.expected.persisted.name);

    await driver.navigate().refresh();
    await page.waitLoaded();
    expect(await page.getName(), 'name rendered back in the form').to.equal(c.expected.persisted.name);
  }

  async function longAddress(c: TestCase<any, any>): Promise<void> {
    const address = String(c.input.addressFill).repeat(c.input.addressLength);

    await page.open();
    await page.setPhone(c.input.phone);
    await page.setAddress(address);
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'success alert text').to.equal(c.expected.alert);

    const stored = await getMe(token);
    expect(stored.shipping_address, 'address must not be truncated')
      .to.have.lengthOf(c.expected.persistedLength);
  }

  // ---------------------------------------------------------------------------
  // Pattern 3 (negative / rejection — assert the ABSENCE of a change)
  // ---------------------------------------------------------------------------

  async function phoneRejected(c: TestCase<any, any>): Promise<void> {
    const before = await getMe(token);

    await page.open();
    await page.setPhone(c.input.phone);

    const alertText = await actAndReadAlertIfAny(driver, () => page.submit());
    expect(alertText, `invalid phone "${c.input.phone}" must raise the validation alert`)
      .to.equal(c.expected.alert);

    // Rejection is only real if nothing was written.
    const after = await getMe(token);
    expect(after.phone, 'phone must remain unchanged after a rejected submit').to.equal(before.phone);
  }

  async function emptyNameBlocked(c: TestCase<any, any>): Promise<void> {
    const before = await getMe(token);

    await page.open();
    await page.setName(c.input.name); // clears the field

    // `required` on the name input must stop submission at the browser level,
    // before handleUpdate ever runs — so no alert should appear at all.
    expect(await page.isNameValid(), 'empty required field must fail HTML5 validation').to.equal(false);
    expect(await page.nameValidationMessage(), 'browser must surface a validation message').to.not.be.empty;

    const alertText = await actAndReadAlertIfAny(driver, () => page.submit(), 2000);
    expect(alertText, 'submit must be blocked, so no success alert may fire').to.not.equal('Cập nhật thành công!');

    const after = await getMe(token);
    expect(after.name, 'name must not be blanked out').to.equal(before.name);
  }

  async function emailNotEditable(c: TestCase<any, any>): Promise<void> {
    await page.open();
    const emailBefore = await page.getEmail();

    expect(await page.isEmailDisabled(), 'email field must be disabled').to.equal(true);

    // A disabled input rejects sendKeys; assert the value is untouched either way.
    try {
      const el = await driver.findElement({ css: 'form input[disabled]' });
      await el.sendKeys(c.input.attemptEmail);
    } catch {
      /* expected: WebDriver refuses to type into a disabled element */
    }

    expect(await page.getEmail(), 'email must not change via the UI').to.equal(emailBefore);
    const stored = await getMe(token);
    expect(stored.email, 'stored email must be unchanged').to.equal(emailBefore);
  }

  // ---------------------------------------------------------------------------
  // Pattern 5 (security behaviour)
  // ---------------------------------------------------------------------------

  async function roleEscalationBlocked(c: TestCase<any, any>): Promise<void> {
    // beforeEach resets role to 'user'; assert that precondition holds so a
    // failure below can only mean the escalation attempt itself succeeded.
    const before = await getMe(token);
    expect(before.role, 'precondition: fixture starts as a normal user').to.equal('user');

    // Hit the API directly — the UI offers no role field, so the escalation
    // surface is PUT /api/users/me accepting a `role` key from the body.
    const res = await putMeRaw(token, c.input.apiBody);

    const after = await getMe(token);
    try {
      expect(after.role, `SRS FR-04 forbids self-service role changes (HTTP ${res.status})`)
        .to.equal(c.expected.roleAfter);
    } finally {
      // Undo any escalation immediately, even when the assertion fails, so the
      // fixture cannot leak admin rights into the rest of the matrix.
      await resetProfile(token, BASELINE);
    }
  }

  async function htmlPayloadRenderedAsText(c: TestCase<any, any>): Promise<void> {
    await page.open();
    const boldBefore = await page.countBoldElementsInBody();

    await page.setPhone(c.input.phone);
    await page.setAddress(c.input.address);
    const alertText = await actAndReadAlert(driver, () => page.submit());
    expect(alertText, 'update should succeed — the payload is stored as data').to.equal('Cập nhật thành công!');

    await driver.navigate().refresh();
    await page.waitLoaded();

    // The payload must come back as literal text in the textarea value...
    expect(await page.getAddress(), 'payload must round-trip as plain text').to.equal(c.input.address);
    // ...and must not have been parsed into a real element.
    expect(
      await page.countBoldElementsInBody(),
      'HTML payload must not be rendered as markup',
    ).to.equal(boldBefore);
  }
});
