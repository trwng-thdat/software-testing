import { config } from './config';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  shipping_address: string | null;
  role: string;
  [k: string]: any;
}

export interface RawResponse {
  status: number;
  body: any;
}

async function request(method: string, path: string, opts: { token?: string; body?: any } = {}): Promise<RawResponse> {
  const res = await fetch(`${config.apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  let body: any = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: res.status, body };
}

export async function login(email: string, password: string): Promise<{ token: string; user: UserRecord }> {
  const res = await request('POST', '/api/login', { body: { email, password } });
  if (res.status !== 200 || !res.body?.token) {
    throw new Error(`Login failed for ${email}: HTTP ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { token: res.body.token, user: res.body.user };
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const res = await request('POST', '/api/register', { body: { name, email, password } });
  if (res.status !== 200) {
    throw new Error(`Register failed for ${email}: HTTP ${res.status} ${JSON.stringify(res.body)}`);
  }
}

/**
 * Ensure the fixture account exists, then return a live session for it.
 * Registering first is idempotent-ish: a duplicate email fails on the UNIQUE
 * constraint, which we swallow because the subsequent login is the real check.
 */
export async function ensureUser(email: string, password: string, name = 'HW04 Fixture User') {
  try {
    await register(name, email, password);
  } catch {
    /* already exists — fall through to login */
  }
  return login(email, password);
}

/** Pattern 2 — read the stored record back to prove a UI action really persisted. */
export async function getMe(token: string): Promise<UserRecord> {
  const res = await request('GET', '/api/users/me', { token });
  if (res.status !== 200) throw new Error(`GET /api/users/me failed: HTTP ${res.status}`);
  return res.body as UserRecord;
}

/** Raw variant — used by security cases that must assert on the status code itself. */
export async function putMeRaw(token: string, body: any): Promise<RawResponse> {
  return request('PUT', '/api/users/me', { token, body });
}

/**
 * Reset the fixture profile to a known baseline so cases cannot contaminate each other.
 *
 * `role` is forced back to 'user' deliberately: the SUT lets PUT /api/users/me set
 * `role` from the request body (server.js:119-125), so the privilege-escalation case
 * would otherwise leave the account as 'admin' and poison every subsequent run.
 * Using the defect to undo itself keeps the suite repeatable without hiding it —
 * TC-PROFILE-12 still asserts, and still fails, on the escalation itself.
 */
export async function resetProfile(token: string, baseline: Partial<UserRecord>): Promise<void> {
  await putMeRaw(token, {
    name: baseline.name ?? 'HW04 Fixture User',
    phone: baseline.phone ?? '0900000000',
    shipping_address: baseline.shipping_address ?? 'Baseline address',
    role: baseline.role ?? 'user',
  });
}

// ---------------------------------------------------------------------------
// FR-08 Checkout helpers
// ---------------------------------------------------------------------------

export interface OrderRecord {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
  [k: string]: any;
}

export interface ProductRecord {
  id: number;
  name: string;
  price: number;
  [k: string]: any;
}

export async function getProduct(id: number): Promise<ProductRecord> {
  const res = await request('GET', `/api/products/${id}`);
  if (res.status !== 200) throw new Error(`GET /api/products/${id} failed: HTTP ${res.status}`);
  return res.body as ProductRecord;
}

/** Pattern 2 — read back what checkout actually wrote to the orders table. */
export async function getMyOrders(token: string): Promise<OrderRecord[]> {
  const res = await request('GET', '/api/orders/my-orders', { token });
  if (res.status !== 200) throw new Error(`GET /api/orders/my-orders failed: HTTP ${res.status}`);
  return (res.body as OrderRecord[]) ?? [];
}

/** The most recently created order, or null when the user has none. */
export async function getLatestOrder(token: string): Promise<OrderRecord | null> {
  const orders = await getMyOrders(token);
  // The endpoint already sorts by id DESC, but do not rely on that ordering.
  return orders.length ? orders.reduce((a, b) => (a.id > b.id ? a : b)) : null;
}

/** Raw checkout call — used by the security case that must assert on the status code. */
export async function checkoutRaw(body: any, token?: string): Promise<RawResponse> {
  return request('POST', '/api/checkout', { token, body });
}

/** Raw coupon call — the UI surfaces only the message, this exposes status + amounts. */
export async function applyCouponRaw(body: {
  code?: string;
  total_amount?: number;
  user_id?: number | null;
}): Promise<RawResponse> {
  return request('POST', '/api/apply-coupon', { body });
}

export async function recordCouponUsage(token: string, couponId: number): Promise<RawResponse> {
  return request('POST', '/api/coupon-usage', { token, body: { coupon_id: couponId } });
}

export interface CouponRecord {
  id: number;
  code: string;
  type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  expired_at: string;
  is_active: number;
  max_uses_per_user: number;
}

export async function getCoupons(token: string): Promise<CouponRecord[]> {
  const res = await request('GET', '/api/coupons', { token });
  if (res.status !== 200) throw new Error(`GET /api/coupons failed: HTTP ${res.status}`);
  return (res.body as CouponRecord[]) ?? [];
}

export async function getCouponByCode(token: string, code: string): Promise<CouponRecord> {
  const found = (await getCoupons(token)).find((c) => c.code === code.toUpperCase());
  if (!found) throw new Error(`Coupon ${code} is not seeded in this SUT instance`);
  return found;
}

export async function findCouponByCode(token: string, code: string): Promise<CouponRecord | null> {
  return (await getCoupons(token)).find((c) => c.code === code.toUpperCase()) ?? null;
}

/**
 * Create a disposable coupon for a single test.
 *
 * The usage-limit case (C5) has to SPEND a coupon's entire per-user allowance to
 * prove the limit is enforced. Spending one of the four seeded codes would leave
 * it exhausted for every later case and for every subsequent run of the matrix —
 * that is exactly the cross-test contamination that made the positive BIGBUY
 * cases fail on the first execution. Minting a private code keeps the seeded
 * codes pristine and makes the case idempotent.
 */
export async function createCoupon(
  token: string,
  spec: {
    code: string;
    type: 'percent' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    expired_at: string;
    max_uses_per_user: number;
  },
): Promise<CouponRecord> {
  await request('POST', '/api/admin/coupons', { token, body: spec });
  const created = await findCouponByCode(token, spec.code);
  if (!created) throw new Error(`Failed to create coupon ${spec.code}`);
  return created;
}

export async function deleteCoupon(token: string, couponId: number): Promise<void> {
  await request('DELETE', `/api/admin/coupons/${couponId}`, { token });
}

/** Drop every copy of a code, so a re-run starts from a clean slate. */
export async function deleteCouponsByCode(token: string, code: string): Promise<void> {
  const all = await getCoupons(token);
  for (const c of all.filter((x) => x.code === code.toUpperCase())) {
    await deleteCoupon(token, c.id);
  }
}
