/**
 * capture_bug_coupon.js — Chup anh bang chung BUG #1 cua HW05
 *
 * BUG: POST /api/apply-coupon tinh sai giam gia loai "percent".
 *      server.js:398-401  ->  discount_amount = floor(total_amount * (1 - discount_value))
 *      Voi SAVE10 (percent, discount_value = 10):
 *          500.000 * (1 - 10) = -4.500.000   (giam gia AM)
 *          final_amount = 500.000 - (-4.500.000) = 5.000.000
 *      => Ap ma giam gia lam so tien PHAI TRA TANG GAP 10 LAN.
 *      Cong thuc dung: total_amount * discount_value / 100 -> giam 50.000, con 450.000.
 *
 * VI SAO CHUP QUA UI CHU KHONG CHI GOI API:
 *      Bug hien ro nhat tren man hinh Checkout: dong "Tiet kiem" hien SO AM va
 *      dong "Tong thanh toan" TANG len sau khi ap ma. Anh chup UI la bang chung
 *      truc quan cho GitHub Issue, de nguoi doc thay ngay hau qua nghiep vu.
 *
 * KICH BAN (chay tren SUT that, khong mock):
 *      1. Dang nhap  test@eshop.com / Test1234!
 *      2. Mo trang san pham -> Them vao gio hang
 *      3. Vao /checkout, dat Tong tien = 500.000 (o input cho phep sua)
 *      4. Nhap SAVE10 -> Ap dung
 *      5. Chup anh toan man hinh + anh rieng khoi ket qua coupon
 *
 * CACH CHAY (SUT phai dang chay san):
 *      node hw5/scripts/capture_bug_coupon.js
 *
 * Anh luu vao: hw5/evidence/issues/
 */

const path = require("path");
const fs = require("fs");
const { Builder, By, until, Key } = require(
  path.join(__dirname, "..", "..", "hw4", "selenium", "node_modules", "selenium-webdriver"),
);

const WEB_URL = process.env.WEB_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:3000";
const EMAIL = process.env.SUT_EMAIL || "test@eshop.com";
const PASSWORD = process.env.SUT_PASSWORD || "Test1234!";

const COUPON = "SAVE10";
const TOTAL = 500000; // >= min_order 300.000 cua SAVE10
const EXPECTED_CORRECT = 450000; // 500.000 - 10%

const OUT_DIR = path.join(__dirname, "..", "evidence", "issues");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const vnd = (n) => n.toLocaleString("vi-VN");

async function shot(driver, name) {
  const img = await driver.takeScreenshot();
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, img, "base64");
  console.log(`  [anh] ${path.relative(process.cwd(), file)}`);
  return file;
}

/** Chup rieng mot phan tu (crop theo vung element). */
async function shotElement(driver, el, name) {
  const img = await el.takeScreenshot();
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, img, "base64");
  console.log(`  [anh] ${path.relative(process.cwd(), file)}`);
  return file;
}

/**
 * Goi thang API de lay so lieu tho dua vao Issue.
 * Chay truoc UI de neu SUT chua bat thi bao loi som, khong mo browser vo ich.
 */
async function proveViaApi() {
  const loginRes = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const login = await loginRes.json();
  if (!login.token) {
    throw new Error(
      `Dang nhap that bai (${EMAIL}): ${JSON.stringify(login)}\n` +
        `  -> Kiem tra tai khoan co trong CSDL khong. SUT seed san: admin@eshop.com / test@eshop.com`,
    );
  }

  const res = await fetch(`${API_URL}/api/apply-coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${login.token}`,
    },
    body: JSON.stringify({
      code: COUPON,
      total_amount: TOTAL,
      user_id: login.user?.id ?? null,
    }),
  });
  const data = await res.json();

  console.log("\n=== Bang chung tu API (dua vao GitHub Issue) ===");
  console.log(`  POST ${API_URL}/api/apply-coupon`);
  console.log(`  body: {"code":"${COUPON}","total_amount":${TOTAL}}`);
  console.log(`  HTTP ${res.status}`);
  console.log(`  response: ${JSON.stringify(data)}`);
  console.log(`  --> discount_amount = ${vnd(data.discount_amount)} d  (phai la ${vnd(50000)} d)`);
  console.log(`  --> final_amount    = ${vnd(data.final_amount)} d  (phai la ${vnd(EXPECTED_CORRECT)} d)`);

  if (data.final_amount === EXPECTED_CORRECT) {
    console.log("\n  !! Bug KHONG con tai hien - co ve SUT da duoc sua. Dung lai.");
    process.exit(2);
  }
  console.log(`  --> SAI LECH: gap ${(data.final_amount / EXPECTED_CORRECT).toFixed(1)} lan gia tri dung\n`);

  fs.writeFileSync(
    path.join(OUT_DIR, "bug1_api_response.json"),
    JSON.stringify(
      {
        request: { url: `${API_URL}/api/apply-coupon`, code: COUPON, total_amount: TOTAL },
        http_status: res.status,
        response: data,
        expected: { discount_amount: 50000, final_amount: EXPECTED_CORRECT },
        source: "group05_eshop/backend/server.js:398-401",
      },
      null,
      2,
    ),
  );
  return data;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const api = await proveViaApi();

  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().setRect({ width: 1440, height: 1000 });

    // --- 1. Dang nhap -------------------------------------------------
    console.log("=== UI: dang nhap ===");
    await driver.get(`${WEB_URL}/login`);
    // Ca hai o deu type="text" (email khong dung type=email) nen lay theo thu tu.
    const inputs = await driver.wait(
      until.elementsLocated(By.css("form input")),
      10000,
    );
    await inputs[0].sendKeys(EMAIL);
    await inputs[1].sendKeys(PASSWORD);
    await driver.findElement(By.css('form button[type="submit"]')).click();
    await driver.wait(until.urlIs(`${WEB_URL}/`), 10000);
    console.log("  da dang nhap");

    // --- 2. Them san pham vao gio ------------------------------------
    // QUAN TRONG: gio hang la React state trong bo nho (CartContext.jsx), KHONG
    // phai localStorage. Moi lan driver.get() la mot lan tai lai trang => state
    // bi xoa sach va gio hang tro ve rong. Vi vay tu day tro di PHAI dieu huong
    // bang cach bam link trong app (client-side routing), tuyet doi khong dung
    // driver.get() nua.
    console.log("=== UI: them san pham vao gio ===");
    await driver.get(`${WEB_URL}/product/1`); // lan get cuoi cung, gio dang rong
    const addBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(., 'Thêm vào giỏ hàng')]"),
      ),
      10000,
    );
    await driver.wait(until.elementIsEnabled(addBtn), 5000);

    // BAM HAI LAN — day KHONG phai workaround tuy tien.
    // ProductDetail.jsx:22-26 co bug co y: lan bam dau tien chi set clickCount=1
    // roi `return` ma khong them gi vao gio. Phai bam lan thu hai moi that su
    // goi addToCart(). Bam mot lan -> gio van rong -> khong vao duoc /checkout.
    await addBtn.click();
    await sleep(400);
    await addBtn.click();

    // Xac nhan da them that: nut doi chu thanh "Da them" (2 giay roi tro lai).
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Đã thêm')]")),
      5000,
    );
    console.log("  da them san pham (can 2 lan bam - bug co y cua SUT)");

    // --- 3. Sang trang thanh toan (dieu huong noi bo) -----------------
    console.log("=== UI: mo trang thanh toan ===");
    await driver.findElement(By.xpath("//a[contains(., 'Giỏ hàng')]")).click();
    await driver.wait(until.urlContains("/cart"), 10000);

    const checkoutBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Tiến hành thanh toán')]")),
      10000,
    );
    await checkoutBtn.click();
    await driver.wait(until.urlContains("/checkout"), 10000);

    // --- 4. Dat tong tien = 500.000 ----------------------------------
    const totalInput = await driver.wait(
      until.elementLocated(By.css('input[type="number"]')),
      10000,
    );
    await totalInput.clear();
    await totalInput.sendKeys(Key.CONTROL, "a");
    await totalInput.sendKeys(String(TOTAL));
    await sleep(300);

    await shot(driver, "bug1_01_truoc_khi_ap_ma.png");

    // --- 5. Ap ma giam gia -------------------------------------------
    console.log(`=== UI: ap ma ${COUPON} ===`);
    const couponInput = await driver.findElement(
      By.css('input[placeholder*="giảm giá"]'),
    );
    await couponInput.sendKeys(COUPON);
    await driver.findElement(By.xpath("//button[contains(., 'Áp dụng')]")).click();

    // Cho khoi ket qua coupon xuat hien
    const resultBox = await driver.wait(
      until.elementLocated(By.xpath("//p[contains(., 'Tiết kiệm')]/..")),
      10000,
    );
    await sleep(600);

    await shot(driver, "bug1_02_sau_khi_ap_ma_TOAN_MAN_HINH.png");
    await shotElement(driver, resultBox, "bug1_03_khoi_ket_qua_coupon.png");

    // --- 6. Doc lai gia tri hien tren UI de doi chieu -----------------
    const uiText = await resultBox.getText();
    console.log("\n=== Text hien tren UI ===");
    console.log(uiText.split("\n").map((l) => "  " + l).join("\n"));

    const totalLine = await driver.findElement(
      By.xpath("//span[contains(., 'Tổng thanh toán')]"),
    );
    console.log(`  ${await totalLine.getText()}`);

    // --- 7. Ket luan --------------------------------------------------
    console.log("\n=== KET LUAN ===");
    console.log(`  Gio hang / tong tien nhap:  ${vnd(TOTAL)} d`);
    console.log(`  Ma ap dung:                 ${COUPON} (percent, 10%)`);
    console.log(`  UI hien "Tiet kiem":        ${vnd(api.discount_amount)} d   <-- SO AM`);
    console.log(`  UI hien "Tong thanh toan":  ${vnd(api.final_amount)} d   <-- TANG GAP 10 LAN`);
    console.log(`  Gia tri DUNG phai la:       ${vnd(EXPECTED_CORRECT)} d`);
    console.log(`\n  Anh bang chung nam trong: hw5/evidence/issues/`);
  } finally {
    await driver.quit();
  }
}

main().catch((err) => {
  console.error("\nLOI:", err.message);
  process.exit(1);
});
