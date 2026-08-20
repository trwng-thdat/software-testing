#!/usr/bin/env bash
# HW06 - Buoc 4: thuc thi test case bang Postman + Newman
# Chay:  bash hw6/scripts/run_newman.sh            (chay ca 3 API + data-driven)
#        bash hw6/scripts/run_newman.sh api1       (chay rieng mot API)
#
# Moi API chay tren DB VUA RESET vi:
#   - API1: cac TC leo thang quyen ghi role='admin' vao DB
#   - API2: TC-API2-010/011 kiem tra bien :id = 1 va 2 nen can bang orders trong
#   - API3: code cua coupon la UNIQUE + A3-E04 xoa coupon seed SAVE10
set -u

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
COL="$ROOT/hw6/postman/EShop_HW06_API.postman_collection.json"
ENV="$ROOT/hw6/postman/EShop_HW06.postman_environment.json"
GLB="$ROOT/hw6/postman/EShop_HW06.postman_globals.json"
REP="$ROOT/hw6/reports"
DATA="$ROOT/hw6/postman/data"
SETUP="00 - Setup (dang nhap, tao user B, tu ky token gia mao)"
mkdir -p "$REP"

F_API1="API1 - PUT /api/users/me (Pool A / FR-04)"
F_API2="API2 - PUT /api/orders/:id/cancel (Pool B / FR-10)"
F_API3="API3 - POST /api/admin/coupons (Pool C / FR-17)"
F_DATA1="DATA1 - Chay theo du lieu: phone (FR-04)"
F_DATA2="DATA2 - Chay theo du lieu: chuyen trang thai don hang (FR-10)"
F_DATA3="DATA3 - Chay theo du lieu: coupon (FR-17)"
F_SPEC="SPEC - Assertion theo dac ta (CO Y DINH THAT BAI - phoi bay bug)"
F_TEARDOWN="99 - Teardown (don du lieu de chay lai duoc)"

fail=0

run_api () {          # $1 = ma bao cao, $2 = ten folder
  echo ""
  echo "=============================================================="
  echo " $1  |  $2"
  echo "=============================================================="
  node "$ROOT/hw6/scripts/reset_db.js" || { echo "reset DB that bai"; exit 1; }
  newman run "$COL" -e "$ENV" \
    --folder "$SETUP" --folder "$2" --folder "$F_TEARDOWN" \
    -r cli,htmlextra,json \
    --reporter-cli-no-banner \
    --reporter-htmlextra-export "$REP/$1.html" \
    --reporter-htmlextra-title "HW06 - $1 - 23127344" \
    --reporter-json-export "$REP/$1.json"     --export-globals "$REP/globals_after_$1.json"
  local rc=$?
  [ $rc -ne 0 ] && fail=1
  echo "[run_newman] $1 ket thuc voi ma thoat $rc"
}

run_data () {         # chay theo du lieu: mot lan chay cho moi dong CSV
  echo ""
  echo "=============================================================="
  echo " data-driven  |  Collection Runner + data file CSV"
  echo "=============================================================="
  node "$ROOT/hw6/scripts/reset_db.js" || exit 1
  # Chay Setup rieng va XUAT environment (token) ra file tam, vi moi lan `newman run`
  # la mot tien trinh doc lap - token do Setup ghi khong tu dong sang lan chay sau.
  local TMPENV="$REP/.env_after_setup.json"
  newman run "$COL" -e "$ENV" --folder "$SETUP"     -r cli --reporter-cli-no-banner --export-environment "$TMPENV" >/dev/null || { echo "Setup that bai"; exit 1; }

  newman run "$COL" -e "$TMPENV" -g "$GLB" --folder "$F_DATA1"     -d "$DATA/api1_phone.csv"     -r cli,htmlextra,json --reporter-cli-no-banner     --reporter-htmlextra-export "$REP/data_api1_phone.html"     --reporter-htmlextra-title "HW06 - data-driven phone (FR-04) - 23127344"     --reporter-json-export "$REP/data_api1_phone.json"
  [ $? -ne 0 ] && fail=1

  newman run "$COL" -e "$TMPENV" -g "$GLB" --folder "$F_DATA2"     -d "$DATA/api2_state.csv"     -r cli,htmlextra,json --reporter-cli-no-banner     --reporter-htmlextra-export "$REP/data_api2_state.html"     --reporter-htmlextra-title "HW06 - data-driven chuyen trang thai (FR-10) - 23127344"     --reporter-json-export "$REP/data_api2_state.json"
  [ $? -ne 0 ] && fail=1

  newman run "$COL" -e "$TMPENV" -g "$GLB" --folder "$F_DATA3"     -d "$DATA/api3_coupon.csv"     -r cli,htmlextra,json --reporter-cli-no-banner     --reporter-htmlextra-export "$REP/data_api3_coupon.html"     --reporter-htmlextra-title "HW06 - data-driven coupon (FR-17) - 23127344"     --reporter-json-export "$REP/data_api3_coupon.json"
  [ $? -ne 0 ] && fail=1
}

run_spec () {         # lan chay DO: assertion theo dac ta -> phoi bay bug
  echo ""
  echo "=============================================================="
  echo " spec  |  $F_SPEC"
  echo "=============================================================="
  node "$ROOT/hw6/scripts/reset_db.js" || exit 1
  newman run "$COL" -e "$ENV" -g "$GLB" --folder "$SETUP" --folder "$F_SPEC" --folder "$F_TEARDOWN" -r cli,htmlextra,json --reporter-cli-no-banner --reporter-htmlextra-export "$REP/spec_bugs.html" --reporter-htmlextra-title "HW06 - assertion theo dac ta (phoi bay bug) - 23127344" --reporter-json-export "$REP/spec_bugs.json"
  echo "[run_newman] spec ket thuc voi ma thoat $? (KY VONG khac 0: moi fail la mot bug)"
}

run_smoke () {        # kiem nhanh: --bail dung ngay khi co fail dau tien
  echo ""
  echo "=============================================================="
  echo " smoke  |  --bail (dung ngay khi fail) + --iteration-count 2"
  echo "=============================================================="
  node "$ROOT/hw6/scripts/reset_db.js" || exit 1
  newman run "$COL" -e "$ENV" -g "$GLB" --folder "$SETUP" --bail --timeout-request 10000 --iteration-count 1 -r cli --reporter-cli-no-banner
  echo "[run_newman] smoke ket thuc voi ma thoat $?"
}

run_regression () {   # dung cho CI job 1: chi cac folder PHAI xanh
  run_api api1 "$F_API1"
  run_api api2 "$F_API2"
  run_api api3 "$F_API3"
  run_data
  echo ""
  echo "[run_newman] regression ket thuc, fail=$fail (0 la dat)"
}

run_spec_strict () {  # dung cho CI job 2: tra ve ma thoat that de CI do
  run_spec
  echo "[run_newman] spec-strict: tra ve ma thoat 1 vi con assertion theo dac ta that bai"
  exit 1
}

case "${1:-all}" in
  smoke) run_smoke ;;
  regression) run_regression ;;
  spec-strict) run_spec_strict ;;
  api1) run_api api1 "$F_API1" ;;
  spec) run_spec ;;
  api2) run_api api2 "$F_API2" ;;
  api3) run_api api3 "$F_API3" ;;
  data) run_data ;;
  all)
    run_api api1 "$F_API1"
    run_api api2 "$F_API2"
    run_api api3 "$F_API3"
    run_data
    run_spec
    ;;
  *) echo "Tham so khong hop le: $1 (dung: api1|api2|api3|data|all)"; exit 2 ;;
esac

echo ""
echo "Bao cao HTML nam trong hw6/reports/"
exit $fail
