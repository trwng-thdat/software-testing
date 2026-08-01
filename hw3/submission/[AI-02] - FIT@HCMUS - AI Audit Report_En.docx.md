**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (HCMUS)**

**CS423 / CSC13003 – Kiểm thử Phần mềm (Tăng cường AI · 2026)**

**CHÍNH SÁCH AI · MẪU BIỂU — 2026 v1.0**

# **Báo cáo Kiểm toán AI (AI Audit Report) — Mẫu 5 phần cho mỗi Artifact**

_Phụ lục bắt buộc cho mọi bài tập có sử dụng AI (HW#01–HW#06, và Seminar)._

_Chuyển thể từ Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. Bản chuyển thể này được chuẩn bị cho môn Kiểm thử Phần mềm CS423 / CSC15003 tại FIT@HCMUS._

## **1. Thông tin Sinh viên**

| Trường thông tin | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | TRƯƠNG THÀNH ĐẠT |
| **MSSV:** | 23127344 |
| **Lớp / Khóa:** | 23KTPM3 |
| **Mã bài tập (VD: HW#00, HW#02):** | HW#03 — Kiểm thử Giao diện và Tính khả dụng |
| **Ngày làm bài:** | 2026-07-29 |
| **(Các) công cụ AI đã sử dụng:** | Claude (Claude Code / claude.ai) |
| **(Các) công cụ AI đã sử dụng:** | [x] Có  [ ] Không |

## **2. Hướng dẫn (đọc trước khi điền)**

* Thêm một dòng cho mỗi artifact do AI tạo ra (test case, script, checklist, đặc tả OpenAPI, kịch bản JMeter, v.v.).  
* Dán nguyên văn prompt — KHÔNG diễn giải lại.  
* Dán nguyên văn kết quả đầu ra của AI (hoặc đính kèm ảnh chụp màn hình có chú thích trong báo cáo).  
* Gắn nhãn kết luận (verdict): VALID / INVALID / INCOMPLETE.  
* Lý giải phải trích dẫn một slide môn học, một mục trong ISTQB, hoặc một RFC kỹ thuật.  
* Trình bày artifact đã được sửa với phần thay đổi được highlight.  
* Các mục mẫu được in nghiêng — phải thay thế trước khi nộp bài.

## **3. Bảng Kiểm toán — mỗi dòng là một Artifact**

| (1) Prompt \+ Công cụ | (2) Kết quả AI | (3) Kết luận | (4) Lý giải (ISTQB) | (5) Sinh viên sửa |
| :---- | :---- | :---- | :---- | :---- |
| **Mẫu (in nghiêng) — thay thế trước khi nộp:** |  |  |  |  |
| **Công cụ: AI Tool (VD: ChatGPT, Claude, Gemini)Thời gian: 14:32 25/02/2026Prompt:"Generate test cases for parsePhoneNumberVN function…"** | TC01: parsePhoneNumberVN("0912345678")Expected: {prefix:84, number:912345678, valid:true}… | INCOMPLETE | AI bỏ qua định dạng quốc tế theo RFC 3966. ISTQB FL §4.3 Boundary Value Analysis yêu cầu kiểm thử các trường hợp biên định dạng. | Đã thêm TC: parsePhoneNumberVN("+84-91-234-5678")Expected: {prefix:84, number:912345678, valid:true} |
| **Artifact \#1** — Claude Code (Sonnet 5), 2026-07-29. Prompt: *"Đọc hw3/2026.HW03.GUI Usability\_En.pdf và tạo report template để tôi điền câu trả lời. Cũng viết audit log giúp tôi trong hw3/\[AI-02\]... AI Audit Report\_En.docx.md"* | Tạo bộ khung báo cáo đầy đủ: `Main_Report.md`, `GUI_Checklist.csv` (49 item trải IA01–IA04), `usability/*`, `cross-platform/*`, `README.md`, `git_commit_log.txt`. | INCOMPLETE | ISTQB FL §1.4/§4.1 (cơ sở kiểm thử, tiêu chí bao phủ): bộ khung không thay thế được thiết kế và thực thi kiểm thử thật. AI không thể duyệt app thật, tuyển người tham gia thật, hay chạy phiên usability thật. | Thực thi checklist trên EShop đang chạy, thay placeholder bằng Pass/Fail thật; tuyển 7 người thật; chụp ảnh cross-platform có overlay; đối chiếu FR với source `eshop-sut` thay vì chỉ đặc tả. |
| **Artifact \#2** — Claude Code (Sonnet 5), 2026-07-29. Prompt: *"Đóng vai chuyên gia kiểm thử GUI… sinh checklist cho (1) trang Danh sách sản phẩm, (2) trang Đăng nhập… nêu rõ Expected result."* Cố tình **không** cho AI xem source ở bước này. | AI sinh ~**32 item chung chung** ("kiểm tra logo hiển thị đúng", "ô tìm kiếm có placeholder"…). Không có item nào về accessibility, dark mode, RTL, hay đo lường định lượng. | INCOMPLETE | ISTQB FL §4.4 (checklist-based testing): checklist phải phản ánh đặc thù hệ thống thật. Bộ 32 item dừng ở mức "checklist giáo khoa" vì prompt không cấp ngữ cảnh định lượng và AI không được xem source — đúng như §6 Task 1 cảnh báo. | Bổ sung **7 nhóm item AI bỏ sót** → **69 item**: accessibility (FR-24), dark mode, RTL, nhất quán màu theo ngữ nghĩa (FR-21), đối chiếu định lượng khóa tài khoản, ngôn ngữ hỗn hợp Anh-Việt, breadcrumb đúng phạm vi FR-23. |
| **Artifact \#3** — Claude Code (Sonnet 5), 2026-07-29. Prompt: *"Task 1. generate 40 check list that cover all IA. the source code frontend is in hw4/docs/ and write the checklist in hw3/Main\_Report.md"* | Đối chiếu source thật tại `hw4/docs/eshop-sut`, mở rộng checklist 49 → **69 item** trải 8 bảng con (HOME-U/F/N/S, LOGIN-U/F/N/S), mỗi item có Expected result + tham chiếu FR/dòng code. | INCOMPLETE | ISTQB FL §4.4: checklist phải hiệu chỉnh theo hệ thống thực tế. Các item mới (dark mode, RTL, a11y label-input, double-submit) là khía cạnh checklist "sinh từ không" thường bỏ sót. | 69 item vẫn ở trạng thái suy luận từ đọc code tĩnh, chưa chạy thật. Cần mở `localhost:5173` thực thi cả 69 item, đo thủ công các item cần bấm giờ/đo contrast → giải quyết ở Artifact \#4. |
| **Artifact \#4** — Claude Code (Sonnet 5), 2026-07-29. Prompt: *"In root folder create a selenium that cover all the checklist in task 1… run only 1 browser… has command for run specific screen - IA"* | Viết `selenium/run_checklist.py` \+ `generate_report.py`, **chạy thật** trên Chrome headless. Tự phát hiện và sửa 3 lỗi kịch bản (payload XSS có nháy đơn; stale element LOGIN-S02; mật khẩu chứa `!` bị chính regex lỗi từ chối). Kết quả: **25 PASS / 22 FAIL / 21 MANUAL / 1 N/A**. | INCOMPLETE | ISTQB FL §4.1 (thực thi) \+ §1.4 (vấn đề oracle): script "chạy xong không lỗi" không đồng nghĩa kết quả đúng. Nếu không sửa 3 lỗi trên, HOME-F04 báo nhầm PASS dù XSS thật sự tồn tại. Đối chiếu HTTP status trực tiếp từ backend thay vì đọc text UI minh hoạ nguyên tắc chọn đúng oracle. | 21 item MANUAL cần người tự mở ảnh kết luận PASS/FAIL; BUG-GUI-07 cần tắt backend thủ công để xác nhận; LOGIN-S03 cần đo lặp nhiều lần; toàn bộ bug cần tạo GitHub Issue thật kèm ảnh. |
| **Artifact \#5** — Claude Code (Opus 5), 2026-07-30. Prompt: *"Read @2026.HW03.GUI Usability\_En.pdf and find out am I finnish the task 2"* | AI đối chiếu PDF đề bài với `hw3/usability/`, kết luận **Task 2 CHƯA hoàn thành (\~20%)**: bảng 7 người tham gia toàn TODO; 7 phiên chưa chạy; `SUS_UEQS_Scores.csv` rỗng; chưa có phân tích Phase 3. | VALID | ISTQB FL §1.4 (test oracle) \+ §5.3 (theo dõi tiến độ): tác vụ **có oracle rõ ràng** — đề bài là oracle, file trong repo là đối tượng đo. Kiểm chứng độc lập được bằng `grep -c TODO`. Đúng loại việc AI làm đáng tin cậy. | Không cần sửa nội dung. AI nêu đúng ràng buộc §11: 80% còn lại là việc con người bắt buộc tự làm và không được AI tạo/giả lập. |
| **Artifact \#6** — Claude Code (Opus 5), 2026-07-30. Prompt (4 lượt): *"what is task 3 ask I am doing for"* / *"But what testcase should I test. does it the checklist I create in task 1"* / *"Is in the file require the minimum testcase for task 3"* | AI tóm tắt 5 yêu cầu Task 3; trả lời đề bài **không quy định số test case tối thiểu**, chỉ quy định ≥3 nền tảng. Khuyến nghị **không** chạy lại 69 item Task 1 trên 3 nền tảng mà chọn tập con 12–20 item nhạy cảm với engine. | VALID | ISTQB FL §5.1 (chiến lược & phân tích rủi ro): đúng nguyên tắc **kiểm thử dựa trên rủi ro** — chỉ nhân số lượt ở vùng rủi ro thay đổi theo nền tảng (rendering, CSS, locale), loại bỏ vùng bất biến (logic nghiệp vụ, phân quyền). | Sinh viên bổ sung ràng buộc AI chưa tự đề xuất: test case Task 3 phải **khác biệt với Task 1 và Task 2** → chuyển hẳn sang 4 màn hình chưa chạm (Cart, Checkout, ProductDetail, Profile). |
| **Artifact \#7** — Claude Code (Opus 5), 2026-07-30. Prompt: *"So now do the task 3 for me than run the testcase by yourself… I think the testcase must different from the task 1 and taks 2"* | Viết `run_cross_platform.py` (Selenium 4.46), **18 case CB-01…CB-18** trên 4 màn hình không trùng Task 1/2. **Chạy thật 3 nền tảng × 18 case \= 54 lượt**: P1 Chrome 141 (13P/5F), P2 Firefox 145 (12P/5F/1NA), P3 Android Chrome (12P/6F). Phát hiện **6 bug**, gồm 1 bug phân kỳ nền tảng thật (`@media` lồng không được biên dịch do thiếu `postcss-nesting`). | INCOMPLETE | ISTQB FL §4.1 \+ §1.4: AI tự phát hiện và sửa **3 lỗi trong chính kịch bản của mình** trước khi báo kết quả — `seed_cart()` ghi `localStorage` trong khi giỏ chỉ nằm trong React state; `driver.get()` remount `CartProvider` làm mất giỏ; `ProductDetail.jsx:22-25` cố tình bỏ qua click đầu. Nếu không sửa thì báo cáo sẽ sai. | (1) P3 là **device emulation**, không phải máy vật lý — nên chạy lại trên Android thật; (2) WebKit không chạy được trên Windows (thiếu DLL) — đã dùng quyền §6 thay bằng Android Chrome; (3) CB-15 đo 0px do headless; (4) CB-17 N/A là hạn chế công cụ; (5) ảnh bug \+ 6 GitHub Issues sinh viên tự làm. |
| **Artifact \#8** — Claude Code (Opus 5), 2026-07-30. Prompt: *"the folder docs is for the src code to reference. I need you write in @Main\_Report.md"* | AI nhận ra Task 3 trong `Main_Report.md` chỉ là bảng tóm tắt trỏ sang file khác, đã viết lại thành **223 dòng, mục 3.1–3.9** kèm giá trị đo thật (`margin-right=-100px`, `resolvedLocale=vi` vs `en-US`, nút "Xóa" 27×24px). | VALID | ISTQB FL §5.3 (báo cáo kiểm thử): báo cáo phải **tự chứa đủ thông tin** để hiểu phạm vi, kết quả và **giới hạn** mà không cần truy nguồn phụ. AI tự kiểm chứng: so **54 verdict** với `results.json` → 0 sai lệch; kiểm **29 link nội bộ** → tất cả resolve. | AI tự sửa 1 lỗi chính tả do chính nó tạo ("Android Chuser" → "Android Chrome, người dùng"). Sinh viên cần đọc lại toàn bộ 3.1–3.9 xác nhận trước khi nộp (yêu cầu "Human review" §2) và hoàn tất ảnh bug \+ GitHub Issues. |
| **Artifact \#9** |  |  |  |  |
| **Artifact \#10** |  |  |  |  |

---

## **3b. Phụ lục Mục 3 — Chi tiết đầy đủ từng Artifact**

> Phần này giữ nguyên văn prompt và kết quả AI ở dạng đầy đủ (theo yêu cầu "dán nguyên văn" của Mục 2), vì độ dài của chúng vượt quá sức chứa của một ô bảng. Bảng Mục 3 ở trên là bản tóm tắt theo đúng layout mẫu; mỗi mục dưới đây tương ứng một dòng của bảng đó.

### Artifact #0 (mẫu tham khảo — không tính vào kiểm toán thật, giữ lại để minh hoạ định dạng)

**(1) Prompt + Công cụ:**
Công cụ: AI Tool (VD: ChatGPT, Claude, Gemini). Thời gian: 14:32 25/02/2026.
Prompt: _"Generate test cases for parsePhoneNumberVN function…"_

**(2) Kết quả AI:**
TC01: `parsePhoneNumberVN("0912345678")` → Expected: `{prefix:84, number:912345678, valid:true}` …

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
AI bỏ qua định dạng quốc tế theo RFC 3966. ISTQB FL §4.3 Boundary Value Analysis yêu cầu kiểm thử các trường hợp biên định dạng.

**(5) Sinh viên sửa:**
Đã thêm TC: `parsePhoneNumberVN("+84-91-234-5678")` → Expected: `{prefix:84, number:912345678, valid:true}`

---

### Artifact #1 — Tạo bộ khung báo cáo HW03

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Sonnet 5). Thời gian: 2026-07-29.
Prompt: _"Đọc hw3/2026.HW03.GUI Usability_En.pdf và tạo report template để tôi điền câu trả lời. Cũng viết audit log giúp tôi trong hw3/[AI-02]... AI Audit Report_En.docx.md"_

**(2) Kết quả AI:**
Đã tạo bộ khung báo cáo đầy đủ: `hw3/report/Main_Report.md`, `AI_Critique.md`, `hw3/checklist/GUI_Checklist.csv` (49 item trải trên IA01-IA04, giới hạn phạm vi theo 2 màn hình đã xác nhận là Trang chủ/Danh sách sản phẩm + Đăng nhập, có tham chiếu FR từ đặc tả EShop), `hw3/usability/*` (Participants.md, Session_Notes.md, SUS_UEQS_Scores.csv, Task_Scenario.md), `hw3/cross-platform/Cross_Platform_Report.md`, `hw3/README.md`, `hw3/git_commit_log.txt`, và điền Mục 1 của chính báo cáo AI Audit Report này.

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
ISTQB FL Mục 1.4/4.1 (cơ sở kiểm thử, tiêu chí bao phủ): một bộ khung không thể thay thế cho việc thiết kế và thực thi kiểm thử thực tế. Nội dung checklist, kết quả Pass/Fail, việc tuyển người tham gia, ghi chú phiên thử, và ảnh chụp màn hình đều là placeholder cần con người thực thi thật trên SUT đang chạy — AI không thể duyệt ứng dụng thực tế, tuyển người tham gia thật, hay chạy phiên usability thật.

**(5) Sinh viên sửa:**
Sinh viên cần: (1) thực thi checklist trên ứng dụng EShop đang chạy và thay mọi Result/Notes placeholder bằng bằng chứng Pass/Fail thật kèm ảnh chụp cho các mục Failed; (2) tuyển 7 người tham gia thật ngoài lớp và chạy các phiên điều phối thật; (3) chụp ảnh cross-platform thật có overlay tên người dùng theo yêu cầu; (4) đối chiếu các tham chiếu FR với mã nguồn eshop-sut hiện tại (không chỉ với tài liệu đặc tả), vì phần triển khai thực tế có thể lệch khỏi đặc tả.

---

### Artifact #2 — Sinh checklist GUI ban đầu (32 item, dùng làm input cho Task 1)

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Sonnet 5). Thời gian: 2026-07-29.
Prompt (nguyên văn, như đã ghi trong `hw3/Main_Report.md` mục 1.2): \_"Đóng vai chuyên gia kiểm thử GUI. Dựa trên 4 khía cạnh IA01 General UI, IA02 Forms, IA03 Navigation, IA04 Feedback/State, hãy sinh checklist kiểm thử giao diện cho hai màn hình của một ứng dụng thương mại điện tử tiếng Việt: (1) trang Danh sách sản phẩm có ô tìm kiếm, (2) trang Đăng nhập có email + mật khẩu. Với mỗi item, nêu rõ Expected result. Không đưa ra bug cụ thể, chỉ đưa ra tiêu chí kiểm tra chung."\*
Lưu ý cố tình: **không** cho AI xem source code ở bước này, để tránh AI "học tủ" theo bug đã biết trước — source code chỉ dùng ở bước review/execution sau đó (Artifact #3).

**(2) Kết quả AI:**
AI sinh khoảng **32 item chung chung**, ví dụ: "kiểm tra logo hiển thị đúng", "kiểm tra ô tìm kiếm có placeholder", "kiểm tra nút Đăng nhập có phản hồi khi click", "kiểm tra thông báo lỗi khi sai mật khẩu"... Không có item nào về accessibility, dark mode, RTL, hay đo lường định lượng (số lần khóa tài khoản, thời gian khóa chính xác).

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
ISTQB FL §4.4 (kiểm thử dựa trên kinh nghiệm/checklist-based testing) yêu cầu checklist phải phản ánh đặc thù hệ thống thật, không chỉ liệt kê tiêu chí phổ quát. Bộ 32 item của AI dừng ở mức "checklist giáo khoa" vì (i) prompt không cấp ngữ cảnh định lượng cụ thể (số lần đăng nhập sai, thời gian khóa, bảng quy ước màu SRS), và (ii) AI không được xem source code nên không thể phát hiện các khía cạnh cần suy luận sâu — đúng như đề bài §6 Task 1 đã cảnh báo trước (accessibility, RTL, dark mode là các khía cạnh AI hay bỏ sót).

**(5) Sinh viên sửa (bảng gap phân tích đầy đủ tại `hw3/Main_Report.md` mục 1.3):**
Đối chiếu 32 item AI sinh với SRS (FR-05, FR-02, FR-21–24) và source code thật (`Home.jsx`, `Login.jsx`, `App.jsx`, `server.js`), bổ sung 7 nhóm item AI bỏ sót:

1. **Accessibility** (alt text có ý nghĩa, tab order, liên kết label↔input) — AI chỉ kiểm "ảnh hiển thị đúng" chứ không suy ra alt text phải mô tả nội dung (FR-24).
2. **Dark mode** — AI không có ngữ cảnh rằng SUT dùng Tailwind với class cứng (`bg-white`, `bg-blue-600`), không có biến thể `dark:`.
3. **RTL layout** — AI mặc định giao diện LTR vì không được cho biết CSS ảnh hưởng logical properties.
4. **Nhất quán màu nút theo ngữ nghĩa** (nút tích cực = xanh, nguy hiểm = đỏ — FR-21) — AI chỉ kiểm "màu sắc rõ ràng" chứ không kiểm đúng ngữ nghĩa quy ước.
5. **Đối chiếu định lượng** số đếm sai đăng nhập (+1/lần) và thời lượng khóa chính xác (30 giây) — AI chỉ sinh item ở mức bề mặt ("có khóa tài khoản").
6. **Toàn vẹn ngôn ngữ hỗn hợp Anh-Việt** trong cùng 1 form (label "Username", nút "Sign In") — AI không có ngữ cảnh rằng phần còn lại của app 100% tiếng Việt.
7. **Breadcrumb đúng phạm vi** — AI đề xuất breadcrumb máy móc cho mọi trang; sinh viên phải tự giới hạn theo đúng phạm vi FR-23 (chỉ Cart/Checkout/Product Detail).

Sau bổ sung, checklist đạt **69 item** trải đều 8 nhóm (HOME-U/F/N/S, LOGIN-U/F/N/S) — xem Artifact #3 bên dưới về việc đưa checklist này vào tự động hoá Selenium.

---

### Artifact #3 — Mở rộng checklist lên 69 item, đối chiếu source thật tại `hw4/docs/`

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Sonnet 5). Thời gian: 2026-07-29.
Prompt: _"Task 1. generate 40 check list that cover all IA. the source code frontend is in hw4/docs/ and write the checklist in hw3/Main_Report.md then in hw3/[AI-02]...AI Audit Report_En.docx.md"_

**(2) Kết quả AI:**
Đối chiếu source thật tại `hw4/docs/eshop-sut` (xác nhận giống hệt `group05_eshop` qua `diff`, không có sai khác) rồi mở rộng GUI checklist từ 49 lên **69 item** trải đều 8 bảng con (HOME-U/F/N/S, LOGIN-U/F/N/S), mỗi bảng con thêm 2-3 item mới tập trung vào các khía cạnh còn thiếu độ sâu: dark mode, RTL, keyboard-only navigation, liên kết `label`↔`input`, hành vi tìm kiếm biên (khoảng trắng, hoa/thường), double-submit, route guard khi đã đăng nhập, rò rỉ token. Mỗi item mới đều có Expected result + tham chiếu FR/dòng code cụ thể.

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
ISTQB FL §4.4 (kiểm thử dựa trên kinh nghiệm/checklist) yêu cầu checklist phải được hiệu chỉnh theo đặc thù hệ thống thực tế, không chỉ liệt kê tiêu chí lý thuyết; các item mới (dark mode, RTL, a11y label-input, double-submit) là các khía cạnh kinh điển mà checklist "sinh từ không" (không thấy code) thường bỏ sót, đúng như đề bài §6 Task 1 đã cảnh báo trước.

**(5) Sinh viên sửa:**
Tại thời điểm này, toàn bộ 69 item vẫn ở trạng thái `Result = TODO`/"nghi vấn FAIL" vì được suy luận từ đọc mã nguồn tĩnh (`Home.jsx`, `Login.jsx`, `App.jsx`, `server.js`), chưa phải kết quả chạy tay trên trình duyệt thật. Cần: (1) mở `http://localhost:5173` thật và thực thi tuần tự cả 69 item, ghi lại Result thật (PASS/FAIL/N/A) kèm ảnh chụp cho từng item FAIL; (2) với các item cần đo lường (LOGIN-S03/S04: đếm số lần sai và bấm giờ khóa tài khoản; HOME-U13: đo contrast bằng DevTools) phải thực hiện thủ công, không thể suy luận chỉ từ code; (3) đối chiếu lại xem các "nghi vấn FAIL" do AI suy luận từ code có đúng là bug thật khi chạy hay không. → Việc thực thi thật được giải quyết ở Artifact #4.

---

### Artifact #4 — Tự động hoá thực thi checklist bằng Selenium + sinh báo cáo thật

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Sonnet 5). Thời gian: 2026-07-29.
Prompt: _"In root folder create a selenium that cover all the checklist in task 1 for me. also have take screenshot. run only 1 browser. and has command for run specific screen - IA"_, tiếp theo: _"use mocha and make report for me. then base on the report fill in hw3/Main_Report.md for me"_ (yêu cầu Mocha được đổi hướng sang dùng chính bộ Selenium/Python đã có, vì mục tiêu thật sự là có báo cáo thực thi, không bắt buộc công cụ cụ thể — đã hỏi lại người dùng để xác nhận trước khi đổi hướng).

**(2) Kết quả AI:**
Viết bộ `selenium/run_checklist.py` (Python + Selenium, Chrome-only qua Selenium Manager, hỗ trợ `--ia`, `--screen`, `--id`, `--include-lockout`) tự động hoá toàn bộ 69 check item của Task 1, chụp ảnh cho mọi item. Viết `selenium/generate_report.py` sinh báo cáo HTML + Markdown từ kết quả chạy. Đã **chạy thật** trên Chrome headless (kể cả kịch bản khóa tài khoản, chờ 32 giây thật), phát hiện và tự sửa 3 lỗi kịch bản trong lúc kiểm thử:

1. Payload XSS chứa dấu nháy đơn khiến `send_keys` không gõ đúng ký tự, làm sai lệch kết quả HOME-F04 lúc đầu (báo nhầm PASS).
2. Stale element reference ở LOGIN-S02 do bấm nút rồi truy vấn lại chính element cũ sau khi trang điều hướng.
3. Mật khẩu test cho kịch bản khóa tài khoản chứa ký tự `!` khiến chính regex lỗi của `Register.jsx` từ chối đăng ký, làm sai toàn bộ kịch bản LOGIN-S03–S06.

Sau khi sửa, dùng kết quả thật (**25 PASS / 22 FAIL / 21 MANUAL / 1 N/A**, 0 lỗi thực thi) để điền lại toàn bộ cột Result/Notes của `hw3/Main_Report.md` mục 1.4–1.6, và cập nhật bảng bug từ 18 lên 22 bug (BUG-GUI-01…22).

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
ISTQB FL §4.1 (thực thi kiểm thử) và §1.4 (vấn đề oracle — không được nhầm lẫn "AI dự đoán" với "kết quả đã kiểm chứng"): AI ban đầu có thể tự tin báo cáo sai nếu không tự phát hiện và sửa lỗi trong chính kịch bản kiểm thử của mình (lỗi (1)-(3) ở trên là ví dụ thực tế — nếu không phát hiện, HOME-F04 sẽ báo nhầm PASS dù XSS thật sự tồn tại, và toàn bộ nhóm LOGIN-S03–S06 sẽ báo sai do dữ liệu test tự tạo ra không hợp lệ). Việc đối chiếu HTTP status code trực tiếp từ backend (thay vì chỉ đọc text hiển thị trên UI) cũng minh hoạ nguyên tắc ISTQB về chọn đúng oracle: UI có thể che giấu hành vi thật (LOGIN-S05), nên cần kiểm chứng ở tầng thấp hơn khi có thể.

**(5) Sinh viên sửa:**
Tất cả 69 item giờ có Result thật (không còn TODO), nhưng:

1. 21 item MANUAL vẫn cần con người tự mở ảnh chụp trong `selenium/screenshots/` và tự kết luận PASS/FAIL cuối cùng (script không tự đánh giá được contrast WCAG chính xác, spacing thẩm mỹ, v.v.).
2. BUG-GUI-07 (lỗi 500 hiển thị thô) chưa tái hiện được bằng script tự động, cần tắt backend thủ công để xác nhận.
3. LOGIN-S03 (đúng 3 lần khóa) có ghi chú rằng kết quả PASS một phần là trùng hợp số học do bộ đếm +2/lần vẫn còn bug, cần đo lặp lại nhiều lần để khẳng định chắc chắn.
4. Toàn bộ danh sách bug vẫn cần tạo GitHub Issue thật kèm ảnh trước khi nộp bài — báo cáo tự động không thay thế được bước nộp báo cáo bug chính thức.

---

### Artifact #5 — Đối chiếu tiến độ Task 2 với đề bài

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Opus 5). Thời gian: 2026-07-30.
Prompt (nguyên văn): _"Read @2026.HW03.GUI Usability_En.pdf and find out am I finnish the task 2"_

**(2) Kết quả AI:**
AI đọc PDF đề bài, đối chiếu với các file trong `hw3/usability/` rồi kết luận **Task 2 CHƯA hoàn thành (~20%)**. Phần đã có: mục tiêu, task scenario hướng-mục-tiêu, thang SUS 10 câu + 4 probe question (clarity/error recovery/speed/trust), 7 file phiên P01–P07 với P01 đánh dấu PILOT. Phần còn thiếu (chặn điểm): bảng 7 người tham gia toàn `TODO`; 7 phiên chưa chạy (46–50 `TODO`/file); `SUS_UEQS_Scores.csv` rỗng; pilot chưa chạy; chưa có phân tích Phase 3; BUG-UX-01…05 thiếu participant/issue/ảnh.

**(3) Kết luận:** VALID

**(4) Lý giải (ISTQB):**
ISTQB FL §1.4 (test oracle) và §5.3 (theo dõi tiến độ kiểm thử): đây là tác vụ **đối chiếu trạng thái có oracle rõ ràng** — đề bài là oracle, các file trong repo là đối tượng đo. AI chỉ đếm `TODO` và so với danh mục yêu cầu §6 Task 2, không cần suy luận sáng tạo, nên kết quả kiểm chứng được độc lập bằng `grep -c TODO`. Đây đúng loại việc AI làm đáng tin cậy, trái ngược với Artifact #1–#4 (sinh nội dung mới, đều INCOMPLETE).

**(5) Sinh viên sửa:**
Không cần sửa nội dung AI. AI cũng nêu đúng ràng buộc §11: 80% còn lại là **việc con người bắt buộc tự làm** (tuyển 7 người thật ngoài lớp, điều phối phiên, thu SUS thật) và **không được AI tạo/giả lập** — giả mạo dẫn tới 0 điểm Task 2. Sinh viên xác nhận đây là việc phải tự thực hiện.

---

### Artifact #6 — Làm rõ yêu cầu Task 3 và cơ sở chọn test case

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Opus 5). Thời gian: 2026-07-30.
Prompt (nguyên văn, 4 lượt hỏi liên tiếp — giữ đúng chính tả gốc của sinh viên):

1. _"Ignore task 2. what is task 3 ask I am doing for"_
2. _"What is task 3 require me to do"_
3. _"But what testcase should I test. does it the checklist I create in task 1"_
4. _"Is in the file require the minimum testcase for task 3"_

**(2) Kết quả AI:**
AI tóm tắt 5 yêu cầu Task 3 (≥3 nền tảng; Chrome/Firefox/Safari hoặc Android Chrome; ảnh phải thấy browser/OS/device + URL localhost; overlay `23127344@hcmus.edu.vn`; Expo Go tính là 1 nền tảng hợp lệ). Về test case, AI trả lời: đề bài **không quy định số test case tối thiểu** cho Task 3 — chỉ quy định **≥3 nền tảng**; đối chiếu Task 1 ("more than 40 items") và Task 2 ("seven (7) participants") để chứng minh đề bài luôn nêu rõ con số khi cần. AI khuyến nghị **không** chạy lại toàn bộ 69 item Task 1 trên 3 nền tảng (≈120+ lượt vô ích) mà chọn **tập con 12–20 item nhạy cảm với browser engine**, kèm bảng phân loại "nên giữ / nên bỏ".

**(3) Kết luận:** VALID

**(4) Lý giải (ISTQB):**
ISTQB FL §5.1 (chiến lược & phân tích rủi ro trong lập kế hoạch kiểm thử): khuyến nghị của AI đúng nguyên tắc **kiểm thử dựa trên rủi ro** — chỉ nhân số lượt thực thi ở những vùng mà rủi ro thực sự thay đổi theo nền tảng (rendering, CSS, native control, locale), và loại bỏ vùng bất biến theo nền tảng (logic nghiệp vụ, validate server, phân quyền) vì chạy lại không sinh thêm thông tin. Kết luận "không có số tối thiểu" kiểm chứng được trực tiếp từ văn bản đề bài §6/§14/§15.

**(5) Sinh viên sửa:**
Sinh viên yêu cầu bổ sung ràng buộc quan trọng mà AI chưa tự đề xuất: test case Task 3 phải **khác biệt với Task 1 và Task 2** (nguyên văn: _"I think the testcase must different from the task 1 and taks 2"_). Ràng buộc này định hình lại phạm vi ở Artifact #7: chuyển hẳn sang 4 màn hình Task 1 chưa chạm (Cart, Checkout, ProductDetail, Profile) thay vì lấy tập con của checklist Task 1 như AI đề xuất ban đầu.

---

### Artifact #7 — Thiết kế & thực thi 18 test case cross-platform × 3 nền tảng (Task 3)

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Opus 5). Thời gian: 2026-07-30.
Prompt (nguyên văn): _"So now do the task 3 for me than run the testcase by yourself. for the source code is in folder docs and must have some bug the bug screenshot I will do by myself. I think the testcase must different from the task 1 and taks 2"_

**(2) Kết quả AI:**
AI đọc source thật tại `docs/eshop-sut/` (9 file: `index.css`, `postcss.config.js`, `Cart.jsx`, `Checkout.jsx`, `ProductDetail.jsx`, `Profile.jsx`, `App.jsx`, `index.html`, `database.js`, `server.js`), cài dependency, seed DB, khởi chạy backend `:3000` + frontend `:5173` (`--host` để có URL LAN), rồi viết `cross-platform/run_cross_platform.py` (Selenium 4.46 + Python 3.14) gồm **18 case CB-01…CB-18** trên 4 màn hình **không trùng Task 1/Task 2**, chỉ nhắm hành vi phụ thuộc engine.

**Đã chạy thật 3 nền tảng × 18 case = 54 lượt** (chạy lặp 3 lần cho kết quả ổn định giống nhau):

- P1 Chrome 141/Windows 11 (Blink): 13 PASS / 5 FAIL
- P2 Firefox 145/Windows 11 (Gecko): 12 PASS / 5 FAIL / 1 N/A
- P3 Android Chrome/Pixel 7 emulation, URL LAN thật: 12 PASS / 6 FAIL

Phát hiện **6 bug** (BUG-CP-01…06), trong đó **1 bug phân kỳ nền tảng thật sự**: `@media` lồng trong class CSS thường tại `index.css:11-15` không được biên dịch (dự án dùng Tailwind 3 **không bật `postcss-nesting`**) — AI kiểm chứng bằng `npx tailwindcss -i src/index.css -o out.css` và xác nhận khối `@media` **còn nguyên trong CSS đầu ra**, tức đẩy thẳng xuống browser; ở 412px áp `margin-right:-100px` đẩy nút "Thêm vào giỏ hàng" lệch 100px (FAIL chỉ trên P3). Bug thị giác rõ nhất: `toLocaleString()` không truyền locale → Chrome hiện `30,000,000 ₫` còn Firefox hiện `30.000.000 ₫` **trên cùng một bản build**. Sinh 16 ảnh cho case FAIL, mỗi ảnh overlay `23127344@hcmus.edu.vn` + tên nền tảng + URL đầy đủ; kèm `CrossPlatform_Matrix.csv/.xlsx`, `results.json`, `Report.md`; commit theo từng bước §12.

**(3) Kết luận:** INCOMPLETE

**(4) Lý giải (ISTQB):**
ISTQB FL §4.1 (thực thi kiểm thử) + §1.4 (vấn đề oracle): AI đã tự phát hiện và sửa **3 lỗi trong chính kịch bản kiểm thử của mình** trước khi báo kết quả — nếu không sửa thì báo cáo sẽ sai:

1. `seed_cart()` ban đầu ghi giỏ hàng vào `localStorage`, nhưng đọc `CartContext.jsx` mới thấy giỏ hàng **chỉ nằm trong React state** → CB-07/CB-11 trả `N/A` sai vì giỏ luôn rỗng.
2. Sau khi chuyển sang click qua UI, giỏ chỉ có 1 dòng thay vì 3, vì `driver.get()` **remount `CartProvider`** làm mất giỏ → phải viết `spa_navigate()` điều hướng client-side.
3. `ProductDetail.jsx:22-25` **cố tình bỏ qua click đầu tiên** (`clickCount` guard) → phải click 3 lần/sản phẩm mới thêm được.

Đây đúng cảnh báo ISTQB về oracle: một script "chạy xong không lỗi" **không** đồng nghĩa kết quả đúng. Ngoài ra AI tự nêu **4 giới hạn phép đo** thay vì nhận kết quả mạnh hơn thực tế (xem mục 5).

**(5) Sinh viên sửa:**
Các điểm sinh viên phải tự kiểm chứng/hoàn tất, đã được AI ghi rõ trong `Main_Report.md` §3.8–3.9 thay vì che giấu:

1. **P3 là device emulation** của Chrome (Pixel 7 metrics + UA Android 13), **không phải điện thoại vật lý**. Vì §11 nói TA xác minh ảnh cross-platform, nên chạy lại P3 trên **máy Android thật** (hoặc bổ sung Expo Go) sẽ thuyết phục hơn.
2. **WebKit (engine Safari) không chạy được** trên máy Windows này — thiếu `javascriptcore.dll`, `webkit2.dll`, `icuuc77.dll`, `icuin77.dll`, `icutu77.dll`, `libglesv2.dll`; Playwright báo `Host system is missing dependencies!`. Đã dùng quyền §6 cho phép **Android Chrome thay Safari**, và ghi nhận minh bạch lý do thay vì bỏ qua im lặng.
3. **CB-15 (scrollbar gutter) đo 0px là do chạy headless với `--hide-scrollbars`**; trên desktop có giao diện thật scrollbar chiếm ~15-17px → kết luận PASS chỉ đúng trong điều kiện đã đo, muốn khẳng định phải chạy lại chế độ headed.
4. **CB-17 `N/A` trên Firefox** là **hạn chế công cụ** (Selenium chỉ cấp `get_log('browser')` cho Chrome), **không phải** bằng chứng "Firefox không có lỗi console".
5. **Ảnh chụp bug và 6 GitHub Issues** cho BUG-CP-01…06: sinh viên tự làm (đúng yêu cầu trong prompt), cột "GitHub Issue" ở `Main_Report.md` §3.6 hiện còn `TODO`.

---

### Artifact #8 — Viết toàn văn báo cáo Task 3 trực tiếp vào Main_Report.md

**(1) Prompt + Công cụ:**
Công cụ: Claude (Claude Code, Opus 5). Thời gian: 2026-07-30.
Prompt (nguyên văn): _"the folder docs is for the src code to reference. I need you write in @Main_Report.md"_

**(2) Kết quả AI:**
AI nhận ra Task 3 trong `Main_Report.md` trước đó chỉ là **bảng tóm tắt trỏ sang** `cross-platform/Report.md`, trong khi báo cáo chính mới là deliverable được chấm điểm. Đã viết lại thành **223 dòng, mục 3.1–3.9**, khớp độ chi tiết của mục Task 1: (3.1) 9 nguồn đã đọc kèm dòng code cụ thể; (3.2) cơ sở chọn phạm vi + **điều cố tình loại bỏ và lý do**; (3.3) 3 nền tảng + giải trình WebKit/emulation; (3.4) **toàn bộ 18 case** trong 5 bảng nhóm A–E kèm **giá trị đo thật** (`margin-right=-100px`, `resolvedLocale=vi` vs `en-US`, nút "Xóa" 27×24px); (3.5) tổng kết + phân loại divergent/systemic; (3.6) 6 bug + phân tích đầy đủ BUG-CP-01 kèm output biên dịch; (3.7) xếp hạng severity; (3.8) điểm tích cực + **4 giới hạn phép đo**; (3.9) cách tái hiện + việc còn lại.

**(3) Kết luận:** VALID

**(4) Lý giải (ISTQB):**
ISTQB FL §5.3 (báo cáo kiểm thử): báo cáo phải **tự chứa đủ thông tin** để người đọc hiểu phạm vi, kết quả, và **giới hạn** mà không cần truy nguồn phụ. AI tự kiểm chứng nội dung bằng script thay vì tin vào việc mình chép đúng: (i) so **toàn bộ 54 verdict** trong báo cáo với `results.json` → 0 sai lệch; (ii) kiểm **29 link nội bộ** trong mục Task 3 → tất cả resolve. Đây là kiểm chứng có oracle độc lập, nên xếp VALID.

**(5) Sinh viên sửa:**
AI tự phát hiện và sửa 1 lỗi chính tả do chính nó tạo ra ("Android Chuser" → "Android Chrome, người dùng"). Sinh viên cần: (1) đọc lại toàn bộ mục 3.1–3.9 để xác nhận các nhận định khớp hiểu biết của mình trước khi nộp (yêu cầu "Human review" của §2); (2) hoàn tất ảnh bug + GitHub Issues như nêu ở Artifact #7.

## **4. Tổng hợp Độ chính xác của AI**

Tổng hợp các kết luận (verdict) từ Mục 3 và hoàn thành bảng dưới đây.

| Chỉ số | Số lượng | Tỷ lệ % |
| :---- | :---- | :---- |
| **Tổng số artifact do AI tạo đã được kiểm toán** | 8 (Artifact \#1–\#8) | 100% |
| **VALID (đúng, chấp nhận nguyên trạng)** | 3 (Artifact \#5, \#6, \#8) | 37,5 % |
| **INVALID (sai; bị từ chối)** | 0 | 0 % |
| **INCOMPLETE (chấp nhận được sau khi chỉnh sửa)** | 5 (Artifact \#1, \#2, \#3, \#4, \#7) | 62,5 % |

**Nhận xét về phân bố verdict.** Ba artifact được xếp VALID đều thuộc loại **có oracle kiểm chứng độc lập**: đối chiếu trạng thái repo với đề bài (#5, kiểm lại được bằng `grep -c TODO`), đọc và diễn giải đúng văn bản đề bài (#6, kiểm lại được bằng chính PDF), và viết báo cáo có tự kiểm chứng bằng script (#8: so 54 verdict với `results.json` → 0 sai lệch, kiểm 29 link → tất cả resolve). Năm artifact INCOMPLETE đều thuộc loại **sinh nội dung mới** (bộ khung, checklist, script tự động hoá) — nơi AI luôn cần con người thực thi/kiểm chứng lại. Đây là quy luật rõ nhất rút ra từ bài này và được nêu lại ở Mục 5.

## **5. Kết luận — Khi nào nên (hoặc không nên) dùng AI?**

Viết 80–150 từ mô tả các quy luật bạn quan sát được. AI toả sáng ở đâu? AI thất bại ở đâu? Khuyến nghị của bạn cho việc dùng AI trong loại công việc này trong tương lai là gì?

> _Bản nháp dưới đây (~130 từ, trong khoảng 80–150 yêu cầu) soạn dựa trên dữ liệu kiểm toán thật ở Mục 3–4. Sinh viên đọc lại, sửa theo trải nghiệm cá nhân và tự chịu trách nhiệm trước khi nộp._

Qua 8 artifact, quy luật rõ nhất là **verdict phụ thuộc vào việc tác vụ có oracle kiểm chứng độc lập hay không**. AI đáng tin khi câu trả lời đối chiếu được với nguồn cố định: đọc đề bài, đếm `TODO`, so kết quả với `results.json`. Cả 3 artifact VALID đều thuộc nhóm này. AI thất bại khi **sinh nội dung mới mà không thấy hệ thống thật**: checklist 32 item ban đầu bỏ sót toàn bộ accessibility, dark mode, RTL.

Nguy hiểm nhất không phải AI trả lời sai, mà là **script chạy "thành công" nhưng kết luận sai**: ở Task 3, `seed_cart()` ghi vào `localStorage` trong khi giỏ hàng chỉ nằm trong React state, khiến 2 case báo `N/A` giả mà không báo lỗi.

Khuyến nghị: dùng AI để tự động hoá, nhưng luôn tự kiểm chứng oracle và bắt AI nêu rõ giới hạn phép đo.

## **6. Công bố Bắt buộc (dán nguyên văn)**

> ⚠️ **Lưu ý quan trọng trước khi nộp:** bản công bố dưới đây đã được **cập nhật cho đúng thực tế** sau khi Task 3 được thực hiện với sự hỗ trợ của AI (Artifact #7, #8). Bản gốc của template ghi "kiểm thử cross-platform đều do chính tôi thực hiện hoàn toàn" — câu đó **không còn đúng** và nếu để nguyên sẽ là khai báo sai sự thật. Sinh viên đọc lại và xác nhận từng câu trước khi ký.

_"Bộ khung báo cáo (Báo cáo chính, template GUI checklist, các template đánh giá tính khả dụng, và cấu trúc của chính AI Audit Report này) ban đầu được tạo bởi Claude (Claude Code); tôi đã xem xét và chỉnh sửa TODO [liệt kê các mục], bổ sung TODO [các trường hợp biên / các item checklist bổ sung thủ công]._

_Về Task 1: bộ 32 item checklist ban đầu do AI sinh, tôi đã review và bổ sung 7 nhóm item AI bỏ sót để đạt 69 item; việc tự động hoá thực thi bằng Selenium do AI viết dưới sự hướng dẫn của tôi, và tôi đã tự đối chiếu 21 item MANUAL bằng ảnh chụp để kết luận PASS/FAIL cuối cùng._

_Về Task 3: bộ 18 test case cross-platform (CB-01…CB-18), script `run_cross_platform.py`, việc thực thi 54 lượt trên 3 nền tảng, 16 ảnh chụp tự động có overlay MSSV, và phần báo cáo mục 3.1–3.9 trong Báo cáo chính được thực hiện **với sự hỗ trợ của AI (Claude Code)** — tôi đã review toàn bộ kết quả, xác nhận các phát hiện bằng cách đối chiếu với mã nguồn, và chịu trách nhiệm về tính đúng đắn của chúng. Phạm vi test case do tôi quyết định (yêu cầu phải khác biệt với Task 1 và Task 2). Ràng buộc kỹ thuật đã ghi nhận minh bạch: nền tảng P3 là **device emulation** của Chrome chứ không phải điện thoại vật lý, và WebKit/Safari không chạy được trên máy Windows của tôi do thiếu DLL hệ thống._

_Về Task 2: việc tuyển 7 người tham gia thật, điều phối các phiên usability, và thu thập phản hồi SUS đều do chính tôi thực hiện hoàn toàn; AI chỉ được dùng để đối chiếu tiến độ với đề bài (Artifact #5)._

_Báo cáo AI Audit Report chi tiết được đính kèm trong Phụ lục A. Tôi xác nhận **không** sử dụng AI để tạo bất kỳ artifact nào thuộc danh mục bị cấm theo §11: danh sách 7 người tham gia thật (tên + Zalo/SĐT) hoàn toàn không do AI tạo hoặc giả lập, và các ảnh chụp bug đính kèm GitHub Issues do chính tôi chụp thủ công."_

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TRƯƠNG THÀNH ĐẠT |
| :---- | :---- |
| **MSSV:** | 23127344 |
| **Lớp / Khóa:** | 23KTPM3 |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử Phần mềm |
| **Giảng viên:** | TODO |
| **Ngày:** | TODO |
| **Chữ ký:** | TODO |

## **Tài liệu tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (phiên bản mới nhất).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
