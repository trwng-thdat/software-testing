#!/usr/bin/env python3
"""Seed 120 tai khoan hieu nang (perf001..perf120) vao CSDL EShop.

LY DO CAN SCRIPT NAY
--------------------
backend/database.js chi seed DUNG HAI tai khoan: admin@eshop.com va test@eshop.com.
Nhung users.csv cua bo test plan HW05 dung perf001@test.com .. perf120@test.com.
Neu chay test ma khong seed truoc, MOI request login tra 401, khong trich duoc $.token,
If Controller chan toan bo cac buoc sau -> file .jtl chi chua endpoint login toan loi
ma khong he bao rang bai test da hong.

VI SAO MOI VU MOT TAI KHOAN RIENG
---------------------------------
1. server.js:54 tang login_attempts theo tung row users. Nhieu VU dung chung mot tai
   khoan se tranh chap tren cung mot row.
2. PUT /api/users/me ghi de name/shipping_address/phone cua chinh row do. Dung chung
   tai khoan thi cac VU ghi de len nhau, khien buoc GET xac minh sau do doc phai gia tri
   cua VU khac -> assertion fail KHONG PHAI do loi hieu nang.

VI SAO DUNG PYTHON THAY VI NODE
-------------------------------
group05_eshop/backend/node_modules chua duoc cai (moi thu muc module deu rong), nen
mot script Node se khong nap duoc sqlite3. Python co san module sqlite3 trong thu vien
chuan, chay duoc ngay khong can npm install.

MAT KHAU LUU PLAINTEXT
----------------------
Day la bug co y cua SUT (xem CLAUDE.md muc Intentional Bugs). Script nay tuan theo dung
cach server.js:46 so sanh mat khau (user.password === password), khong hash.

CACH DUNG
    python hw5/data/seed_perf_users.py            # them 120 tai khoan
    python hw5/data/seed_perf_users.py --reset    # mo khoa + reset bo dem
    python hw5/data/seed_perf_users.py --verify   # chi kiem tra, khong ghi
    python hw5/data/seed_perf_users.py --db <duong_dan_database.sqlite>

CANH BAO VE DUONG DAN CSDL
--------------------------
Neu may co NHIEU ban sao group05_eshop, script mac dinh seed vao ban nam canh
thu muc hw5 - co the KHAC voi ban ma backend dang thuc su chay. Trieu chung:
seed bao 120 tai khoan nhung login van tra 401.

Cach xac dinh CSDL that su dang duoc dung (PowerShell):
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
      Select-Object ProcessId, CommandLine

Tim tien trino chay server.js, lay thu muc cua no, roi truyen vao --db.
Script se in ra duong dan tuyet doi cua CSDL no dang ghi de doi chieu.

--reset dung GIUA CAC LAN CHAY Stress/Spike, theo yeu cau HW05 muc 6 Task 1:
"Khi cac lan chay Stress/Spike kich hoat co che khoa dang nhap sau 3 lan that bai,
 hay reset giua cac lan chay va tai lieu hoa cac buoc thuc hien."
"""
import os
import sqlite3
import sys

COUNT = 120
PASSWORD = "Password123!"

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB = os.path.normpath(
    os.path.join(HERE, "..", "..", "group05_eshop", "backend", "database.sqlite")
)


def resolve_db():
    """Cho phep chi dinh CSDL qua --db, vi may co the co nhieu ban sao SUT."""
    if "--db" in sys.argv:
        i = sys.argv.index("--db")
        if i + 1 < len(sys.argv):
            return os.path.abspath(sys.argv[i + 1])
        print("Thieu duong dan sau --db")
        sys.exit(2)
    return DEFAULT_DB


def main():
    reset_only = "--reset" in sys.argv
    verify_only = "--verify" in sys.argv
    db_path = resolve_db()

    # In duong dan tuyet doi de doi chieu voi CSDL ma backend thuc su dang mo.
    print("CSDL dich: %s" % db_path)

    if not os.path.exists(db_path):
        print("Khong tim thay CSDL o duong dan tren.")
        print("Neu backend chay tu thu muc khac, truyen duong dan bang --db.")
        return 1

    con = sqlite3.connect(db_path)
    cur = con.cursor()

    if verify_only:
        pass
    elif reset_only:
        cur.execute(
            "UPDATE users SET login_attempts = 0, locked_until = NULL "
            "WHERE email LIKE 'perf%'"
        )
        con.commit()
        print("Da reset lockout cho %d tai khoan perf*." % cur.rowcount)
    else:
        # INSERT co dieu kien: chay lai nhieu lan khong tao ban trung.
        rows = []
        for i in range(1, COUNT + 1):
            n = "%03d" % i
            email = "perf%s@test.com" % n
            rows.append(
                (
                    "Perf User %s" % n,
                    email,
                    PASSWORD,
                    "%s Le Loi Q1 TP.HCM" % n,
                    "09123450%s" % n,
                    email,
                )
            )
        cur.executemany(
            "INSERT INTO users "
            "(name, email, password, role, login_attempts, locked_until, "
            " shipping_address, phone) "
            "SELECT ?, ?, ?, 'user', 0, NULL, ?, ? "
            "WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ?)",
            rows,
        )
        con.commit()
        print("Da them %d tai khoan moi." % cur.rowcount)

    n = cur.execute(
        "SELECT COUNT(*) FROM users WHERE email LIKE 'perf%'"
    ).fetchone()[0]
    locked = cur.execute(
        "SELECT COUNT(*) FROM users WHERE email LIKE 'perf%' "
        "AND (login_attempts > 0 OR locked_until IS NOT NULL)"
    ).fetchone()[0]

    print("Tong tai khoan perf* trong CSDL: %d" % n)
    print("Tai khoan dang bi khoa / co bo dem > 0: %d" % locked)
    con.close()

    if not reset_only and n < COUNT:
        print("CANH BAO: mong doi %d nhung chi co %d." % (COUNT, n))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
