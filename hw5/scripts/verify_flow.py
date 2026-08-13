#!/usr/bin/env python3
"""Verify tung buoc cua Luong A bang request THAT toi SUT dang chay.

Kiem tra dung nhung gi 3 file .jmx se lam: cung endpoint, cung JSON Path,
cung assertion. Muc dich: bat loi TRUOC khi chay tai that.
"""
import json
import urllib.error
import urllib.request

BASE = "http://localhost:3000"
EMAIL = "perf001@test.com"
PASSWORD = "Password123!"
# Khop dong dau tien cua profiles.csv
PNAME, PADDR, PPHONE = "Perf User 01", "01 Le Loi Q1 TP.HCM", "0912345001"
# Khop dong dau tien cua coupons.csv
COUPON, TOTAL = "SAVE10", 500000

results = []


def call(method, path, body=None, token=None):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(req, data, timeout=15) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


def check(step, ok, detail):
    results.append((step, ok, detail))
    print("  %s %s" % ("[OK] " if ok else "[FAIL]", detail))


print("=" * 74)
print("VERIFY LUONG A BANG REQUEST THAT")
print("=" * 74)

# --- 01 POST /api/login [auth-heavy] ---------------------------------------
print("\n01 POST /api/login [auth-heavy]")
code, raw = call("POST", "/api/login", {"email": EMAIL, "password": PASSWORD})
check("01", code == 200, "HTTP %d (assert: 200)" % code)
d = json.loads(raw)
token = d.get("token", "")
user_id = d.get("user", {}).get("id")
check("01", bool(token), "$.token khong rong -> %s" % ("co" if token else "KHONG"))
check("01", user_id is not None, "$.user.id -> %s" % user_id)

# --- 02 GET /api/users/me [read-heavy] -------------------------------------
print("\n02 GET /api/users/me [read-heavy]")
code, raw = call("GET", "/api/users/me", token=token)
check("02", code == 200, "HTTP %d (assert: 200)" % code)
d = json.loads(raw)
check("02", d.get("email") == EMAIL,
      "$.email == '%s' -> thuc te '%s'" % (EMAIL, d.get("email")))

# --- 03 GET /api/orders/my-orders [read-heavy] -----------------------------
print("\n03 GET /api/orders/my-orders [read-heavy]")
code, raw = call("GET", "/api/orders/my-orders", token=token)
check("03", code == 200, "HTTP %d (assert: 200)" % code)
is_arr = raw.strip().startswith("[") and raw.strip().endswith("]")
check("03", is_arr, "body la mang JSON -> %s (len=%d)" % (is_arr, len(raw)))

# --- 04 PUT /api/users/me [transactional] ----------------------------------
print("\n04 PUT /api/users/me [transactional]")
code, raw = call("PUT", "/api/users/me",
                 {"name": PNAME, "shipping_address": PADDR, "phone": PPHONE},
                 token=token)
check("04", code == 200, "HTTP %d (assert: 200)" % code)
check("04", "Profile updated" in raw,
      "body chua 'Profile updated' -> %s" % raw.strip()[:60])

# --- 04b GET /api/users/me [verify ghi] ------------------------------------
print("\n04b GET /api/users/me [verify ghi]")
code, raw = call("GET", "/api/users/me", token=token)
check("04b", code == 200, "HTTP %d (assert: 200)" % code)
d = json.loads(raw)
check("04b", d.get("phone") == PPHONE,
      "$.phone == '%s' -> thuc te '%s'" % (PPHONE, d.get("phone")))

# --- 05 POST /api/apply-coupon [read-only + compute] -----------------------
print("\n05 POST /api/apply-coupon [read-only + compute]")
code, raw = call("POST", "/api/apply-coupon",
                 {"code": COUPON, "total_amount": TOTAL, "user_id": user_id},
                 token=token)
check("05", code == 200, "HTTP %d (assert: 200)" % code)
d = json.loads(raw)
has_fa = "final_amount" in d
check("05", has_fa, "co $.final_amount -> %s" % d.get("final_amount", "KHONG CO"))

print("\n" + "=" * 74)
nfail = sum(1 for _, ok, _ in results if not ok)
if nfail:
    print("KET QUA: %d/%d assertion FAIL" % (nfail, len(results)))
    for s, ok, det in results:
        if not ok:
            print("  buoc %-4s %s" % (s, det))
else:
    print("KET QUA: ca %d assertion deu PASS - 3 file .jmx dung voi SUT that"
          % len(results))
print("=" * 74)

# Ghi chu ve bug tinh toan (khong tinh la fail cua test plan)
if has_fa:
    expected = TOTAL - TOTAL * 10 // 100
    actual = d["final_amount"]
    if actual != expected:
        print("\nGHI CHU - bug SUT (khong phai loi test plan):")
        print("  %s giam 10%% tren %d d" % (COUPON, TOTAL))
        print("  final_amount dung  : %d" % expected)
        print("  final_amount thuc te: %d" % actual)
        print("  Nguyen nhan: server.js:399-401 dung total*(1-value) thay vi")
        print("  total*value/100. Assertion van PASS vi chi kiem su ton tai.")
