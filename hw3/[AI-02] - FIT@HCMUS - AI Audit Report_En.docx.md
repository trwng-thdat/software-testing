**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (HCMUS)**

**CS423 / CSC13003 – Kiểm thử Phần mềm (Tăng cường AI · 2026)**

**CHÍNH SÁCH AI · MẪU BIỂU — 2026 v1.0**

# **Báo cáo Kiểm toán AI (AI Audit Report) — Mẫu 5 phần cho mỗi Artifact**

_Phụ lục bắt buộc cho mọi bài tập có sử dụng AI (HW#01–HW#06, và Seminar)._

_Chuyển thể từ Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. Bản chuyển thể này được chuẩn bị cho môn Kiểm thử Phần mềm CS423 / CSC15003 tại FIT@HCMUS._

## **1. Thông tin Sinh viên**

| Trường thông tin                               | Giá trị                                                                                              |
| :--------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Họ tên sinh viên (in hoa):**                 | TODO                                                                                                 |
| **MSSV:**                                      | TODO                                                                                                 |
| **Lớp / Khóa:**                                | TODO                                                                                                 |
| **Mã bài tập (VD: HW#00, HW#02):**             | HW#03 — Kiểm thử Giao diện và Tính khả dụng                                                          |
| **Ngày làm bài:**                              | 2026-07-29                                                                                           |
| **(Các) công cụ AI đã sử dụng:**               | Claude (Claude Code / claude.ai) — TODO bổ sung công cụ khác nếu có (ChatGPT, Gemini, Copilot, v.v.) |
| **Bạn có sử dụng AI trong bài tập này không?** | [x] Có [ ] Không                                                                                     |

## **2. Hướng dẫn (đọc trước khi điền)**

- Thêm một mục cho mỗi artifact do AI tạo ra (test case, script, checklist, đặc tả OpenAPI, kịch bản JMeter, v.v.).
- Dán nguyên văn prompt — KHÔNG diễn giải lại.
- Dán nguyên văn kết quả đầu ra của AI (hoặc đính kèm ảnh chụp màn hình có chú thích trong báo cáo).
- Gắn nhãn kết luận (verdict): VALID / INVALID / INCOMPLETE.
- Lý giải phải trích dẫn một slide môn học, một mục trong ISTQB, hoặc một RFC kỹ thuật.
- Trình bày artifact đã được sửa với phần thay đổi được highlight.
- Các mục mẫu được in nghiêng — phải thay thế trước khi nộp bài.

> **Ghi chú định dạng:** Từ bản này, mỗi artifact được trình bày thành **một mục riêng** (không dùng bảng ngang 5 cột như mẫu gốc) vì nội dung prompt/output/lý giải của các artifact thực tế trong bài này khá dài — nhồi vào 1 dòng bảng Markdown làm vỡ layout khi render (Word/PDF/GitHub). Cấu trúc mỗi mục vẫn giữ đủ 5 phần bắt buộc: (1) Prompt + Công cụ, (2) Kết quả AI, (3) Kết luận, (4) Lý giải (ISTQB), (5) Sinh viên sửa.

## **3. Nhật ký Kiểm toán — mỗi mục là một Artifact**

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

### Artifact #5

_(để trống — điền khi có tương tác AI tiếp theo, theo đúng cấu trúc 5 phần ở trên)_

## **4. Tổng hợp Độ chính xác của AI**

Tổng hợp các kết luận (verdict) từ Mục 3 và hoàn thành bảng dưới đây.

| Chỉ số                                            | Số lượng                                                        | Tỷ lệ % |
| :------------------------------------------------ | :-------------------------------------------------------------- | :------ |
| **Tổng số artifact do AI tạo đã được kiểm toán**  | 4 (Artifact #1–#4; thêm một mục cho mỗi tương tác AI tiếp theo) | 100%    |
| **VALID (đúng, chấp nhận nguyên trạng)**          | 0                                                               | 0%      |
| **INVALID (sai; bị từ chối)**                     | 0                                                               | 0%      |
| **INCOMPLETE (chấp nhận được sau khi chỉnh sửa)** | 4 (Artifact #1, #2, #3, #4 = INCOMPLETE)                        | 100%    |

## **5. Kết luận — Khi nào nên (hoặc không nên) dùng AI?**

Viết 80–150 từ mô tả các quy luật bạn quan sát được. AI làm tốt ở đâu? AI thất bại ở đâu? Khuyến nghị của bạn cho việc dùng AI trong loại công việc này trong tương lai là gì?

---

---

---

---

---

## **6. Công bố Bắt buộc (dán nguyên văn)**

_"Bộ khung báo cáo (Báo cáo chính, template GUI checklist, các template đánh giá tính khả dụng, template báo cáo cross-platform, và cấu trúc của chính AI Audit Report này) ban đầu được tạo bởi Claude (Claude Code); tôi đã xem xét và chỉnh sửa TODO [liệt kê các mục], bổ sung TODO [các trường hợp biên / các item checklist bổ sung thủ công]; việc thực thi checklist thực tế, các phiên usability, việc tuyển người tham gia, phân tích bug, và kiểm thử cross-platform đều do chính tôi thực hiện hoàn toàn. Báo cáo AI Audit Report chi tiết được đính kèm trong Phụ lục A. Tôi xác nhận không sử dụng AI để tạo bất kỳ artifact nào thuộc danh mục bị cấm (danh sách người tham gia thật, ảnh chụp cross-platform)."_

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TODO                                 |
| :------------------------- | :----------------------------------- |
| **MSSV:**                  | TODO                                 |
| **Lớp / Khóa:**            | TODO                                 |
| **Môn học:**               | CS423 / CSC13003 – Kiểm thử Phần mềm |
| **Giảng viên:**            | TODO                                 |
| **Ngày:**                  | TODO                                 |
| **Chữ ký:**                | TODO                                 |

## **Tài liệu tham khảo**

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (phiên bản mới nhất).
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
