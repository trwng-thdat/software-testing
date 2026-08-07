import { WebDriver, until } from 'selenium-webdriver';
import { config } from './config';

/** Perform an action that raises a native alert; return its text and accept it. */
export async function actAndReadAlert(driver: WebDriver, action: () => Promise<void>): Promise<string> {
  await action();
  await driver.wait(until.alertIsPresent(), config.timeout);
  const alert = await driver.switchTo().alert();
  const text = await alert.getText();
  await alert.accept();
  return text;
}

/**
 * Like actAndReadAlert but tolerates "no alert appeared" — returns null instead of throwing.
 * Needed for cases where the SRS says the form must be blocked before any alert fires
 * (e.g. an empty `required` field), so absence of an alert is itself the evidence.
 */
export async function actAndReadAlertIfAny(
  driver: WebDriver,
  action: () => Promise<void>,
  timeoutMs = 3000,
): Promise<string | null> {
  await action();
  try {
    await driver.wait(until.alertIsPresent(), timeoutMs);
  } catch {
    return null;
  }
  const alert = await driver.switchTo().alert();
  const text = await alert.getText();
  await alert.accept();
  return text;
}

/** Safety net for afterEach — a leaked alert breaks every later test in the file. */
export async function dismissAnyAlert(driver: WebDriver): Promise<void> {
  try {
    await driver.switchTo().alert().accept();
  } catch {
    /* no alert open */
  }
}
