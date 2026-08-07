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
