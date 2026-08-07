import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import { config } from './config';

/**
 * Page object for frontend-web/src/pages/Profile.jsx (route /profile).
 *
 * Selector notes (SUT has ZERO data-testid and no `name` attributes on inputs):
 *  - phone   -> tier 2, stable `placeholder="VD: 0912345678"` from source line 143.
 *  - address -> tier 2, `textarea[placeholder="Nhập địa chỉ của bạn"]` (source line 154).
 *               NOTE: this is a <textarea>, not an <input>.
 *  - email   -> tier 3, the only `input[disabled]` inside the profile form (source line 122).
 *  - name    -> tier 4, located via its visible Vietnamese <label>"Họ Tên"</label> sibling
 *               (source line 127). Dropping to text-based XPath is unavoidable here: the
 *               field carries no name, id, placeholder, or type distinct from the email box.
 *               COUPLING: renaming that label, or translating the UI, breaks this selector.
 *  - submit  -> tier 1, `button[type=submit]` scoped to the profile form.
 */
export class ProfilePage {
  constructor(private driver: WebDriver) {}

  static readonly HEADING = 'Hồ sơ của bạn';

  private readonly FORM = By.css('form');
  private readonly NAME_INPUT = By.xpath(
    "//label[normalize-space()='Họ Tên']/following-sibling::input[1]",
  );
  private readonly PHONE_INPUT = By.css('input[placeholder="VD: 0912345678"]');
  private readonly ADDRESS_TEXTAREA = By.css('textarea[placeholder="Nhập địa chỉ của bạn"]');
  private readonly EMAIL_INPUT = By.css('form input[disabled]');
  private readonly SUBMIT = By.css('form button[type="submit"]');

  /** Navigate to /profile and wait for the form to actually render. */
  async open(): Promise<void> {
    await this.driver.get(`${config.webUrl}/profile`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    // Wait on a form field rather than the heading: the heading paints before
    // AuthContext resolves /api/users/me and hydrates the inputs.
    await this.driver.wait(until.elementLocated(this.PHONE_INPUT), config.timeout);
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.SUBMIT)), config.timeout);
  }

  /** Elements are re-located on every access — React re-renders invalidate cached handles. */
  private el(by: By): Promise<WebElement> {
    return this.driver.wait(until.elementLocated(by), config.timeout);
  }

  async setName(value: string): Promise<void> {
    const e = await this.el(this.NAME_INPUT);
    await e.clear();
    if (value) await e.sendKeys(value);
  }

  async setPhone(value: string): Promise<void> {
    const e = await this.el(this.PHONE_INPUT);
    await e.clear();
    if (value) await e.sendKeys(value);
  }

  async setAddress(value: string): Promise<void> {
    const e = await this.el(this.ADDRESS_TEXTAREA);
    await e.clear();
    if (value) {
      // sendKeys on a 500-char string is slow and can drop characters in Firefox;
      // set the value through React's native setter so onChange still fires.
      if (value.length > 200) {
        await this.setReactValue(e, value);
      } else {
        await e.sendKeys(value);
      }
    }
  }

  /**
   * React tracks input state internally, so a bare `element.value = x` is reverted
   * on the next render. Use the native value setter + a dispatched `input` event,
   * which is what React's onChange listener actually observes.
   */
  private async setReactValue(el: WebElement, value: string): Promise<void> {
    await this.driver.executeScript(
      `const el = arguments[0], value = arguments[1];
       const proto = el.tagName === 'TEXTAREA'
         ? window.HTMLTextAreaElement.prototype
         : window.HTMLInputElement.prototype;
       const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
       setter.call(el, value);
       el.dispatchEvent(new Event('input', { bubbles: true }));`,
      el,
      value,
    );
  }

  /** A missing `value` attribute means the field is empty — normalise to '' for assertions. */
  private async valueOf(by: By): Promise<string> {
    return (await (await this.el(by)).getAttribute('value')) ?? '';
  }

  async getName(): Promise<string> {
    return this.valueOf(this.NAME_INPUT);
  }

  async getPhone(): Promise<string> {
    return this.valueOf(this.PHONE_INPUT);
  }

  async getAddress(): Promise<string> {
    return this.valueOf(this.ADDRESS_TEXTAREA);
  }

  async getEmail(): Promise<string> {
    return this.valueOf(this.EMAIL_INPUT);
  }

  async isEmailDisabled(): Promise<boolean> {
    return !(await (await this.el(this.EMAIL_INPUT)).isEnabled());
  }

  async submit(): Promise<void> {
    await (await this.el(this.SUBMIT)).click();
  }

  /** HTML5 `required` blocks submit before any JS runs — read the browser's own validity state. */
  async isNameValid(): Promise<boolean> {
    return this.driver.executeScript<boolean>(
      'return arguments[0].checkValidity();',
      await this.el(this.NAME_INPUT),
    );
  }

  async nameValidationMessage(): Promise<string> {
    return this.driver.executeScript<string>(
      'return arguments[0].validationMessage;',
      await this.el(this.NAME_INPUT),
    );
  }

  /** Count real <b> elements rendered from user data — pattern 5 (XSS renders as text). */
  async countBoldElementsInBody(): Promise<number> {
    return (await this.driver.findElements(By.css('body b'))).length;
  }
}
