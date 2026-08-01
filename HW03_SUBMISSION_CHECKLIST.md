# HW03 — Checklist hoàn thiện bài nộp

> Đối chiếu `hw3/2026.HW03.GUI Usability_En.pdf` với nội dung hiện có trong `hw3/submission/`.
> Rà soát lần đầu 2026-08-01 · **cập nhật lần 2 sau khi thêm 6 screen recording**. Đánh dấu `[x]` khi hoàn tất từng mục.

> 🔴 **VIỆC GẤP NHẤT:** thư mục `usability/recordings/` hiện **1.1 GB** (6 file MP4). Moodle thường giới hạn 100–500 MB/file nộp → **không thể đóng gói vào zip**. Phải upload YouTube unlisted và thay bằng link trước khi nộp. Xem mục 2.4.

---

## 0. Tóm tắt nhanh — mức độ hoàn thiện

| Hạng mục | Điểm | Trạng thái | Việc còn lại |
| --- | --- | --- | --- |
| Task 1 — GUI Checklist | 30 | ✅ Gần xong | Chỉ thiếu ảnh chụp GitHub Issues |
| Task 2 — Usability Evaluation | 40 | 🟡 **6/7 phiên + 6 video** | Tuyển + chạy P07 · **điền SUS (vẫn rỗng)** · xử lý 1.1 GB video |
| Task 3 — Cross-Platform | 20 | ✅ Gần xong | Kiểm tra overlay MSSV trên ảnh |
| Agent Skills | 10 | ❌ **Chưa có gì** | Viết skill + quay video demo |
| Hồ sơ nộp (README, PDF, zip) | — | ❌ **Thiếu nhiều** | README, các bản PDF, bug_reports.md |

**Rủi ro cao nhất:** §17 ghi rõ *"Missing any required document results in 0 points"*. Các mục thiếu ở phần 5 bên dưới (README.md, bản PDF) là bắt buộc.

---

## 1. Task 1 — GUI Checklist (30đ)

### Đã có ✅
- [x] Checklist 69 item > 40 item tối thiểu — `submission/checklist/GUI_Checklist.csv` + `.xlsx`
- [x] Phủ đủ 4 interface aspect IA-01…IA-04 trên 2 màn hình (Home/Product List + Login)
- [x] Cột Result (PASS/FAIL) + cột Notes ghi lý do fail
- [x] Ảnh chụp cho các item FAIL — `submission/screenshot/` (43 ảnh)
- [x] Quy trình AI-First có ghi lại (prompt → review → bổ sung item AI bỏ sót) — Main_Report §1.2, §1.3
- [x] Bảng 30 bug + link GitHub Issues #125–#154 — Main_Report §1.6
- [x] Tự động hoá thực thi bằng Selenium — `submission/selenium/`

### Còn thiếu ❌
- [ ] **Ảnh chụp trang GitHub Issues** — §14 yêu cầu *"Bug report, with screenshots of the bugs on the GitHub Issues page"*. Hiện chỉ có link text, chưa có ảnh chụp màn hình trang Issues.
  → Tạo thư mục `submission/github_issues/` và chụp: (a) 1 ảnh tổng danh sách issues #125–#154, (b) vài ảnh issue chi tiết cho thấy đã đính kèm ảnh bug trong issue.
- [ ] **Xác nhận mỗi GitHub Issue đã đính kèm ảnh bug** (§6 Task 1: *"Remember to attach bug screenshots to each GitHub issue"*) — mở lại 30 issue kiểm tra.
- [ ] Kiểm tra lại 3 kết luận tự nhận là suy luận chứ chưa đo trực tiếp (Main_Report §1.5 đã tự ghi chú): LOGIN-S07 (rò rỉ token), LOGIN-S08 (double-submit), HOME-U13 (contrast WCAG). Đo lại bằng DevTools Network / công cụ tính contrast, hoặc giữ nguyên nhưng nêu rõ giới hạn.
- [ ] Kiểm tra `[AI-02]...docx.md:84` còn ghi đường dẫn cũ (`hw3/report/Main_Report.md`, `AI_Critique.md`, `Cross_Platform_Report.md`) không khớp cấu trúc `submission/` hiện tại → sửa cho khớp.

---

## 2. Task 2 — Usability Evaluation (40đ) — ⚠️ ƯU TIÊN CAO NHẤT

§11 Anti-AI-Cheat: dữ liệu này **không được AI tạo hoặc bịa**, TA có thể gọi ngẫu nhiên 2 người xác minh; giả mạo → **0 điểm Task 2**.

### Đã có ✅
- [x] Objectives được viết rõ — `usability/Task_Scenario.md`
- [x] Task scenario dạng goal-oriented, không hướng dẫn từng bước
- [x] Instruments: bảng SUS 10 câu — `usability/SUS_UEQS_Scores.csv`
- [x] **6/7 participant đã có thông tin** — `usability/Participants.md` (P01–P06)
- [x] **6/7 phiên đã chạy**, quan sát đã ghi vào `sessions/P01.md`…`P06.md`: outcome, timeline, can thiệp moderator, probe answers, tóm tắt researcher
- [x] **6/6 phiên có screen recording** — `usability/recordings/` (xem cảnh báo dung lượng ở 2.4)
- [x] Pilot session P01 đã chạy + kết luận pilot (không cần điều chỉnh kịch bản)
- [x] Bảng điểm confuse theo giai đoạn cho moderator

### Còn thiếu ❌

#### 2.1 Tuyển và chạy nốt phiên cuối
- [ ] **Tuyển P07** — ưu tiên **người không thuộc ngành IT** (mẫu hiện đang lệch: 5/6 là sinh viên IT)
- [ ] Chạy phiên P07 và điền `sessions/P07.md`
- [ ] Cập nhật `Participants.md` (dòng cuối) và `SUS_UEQS_Scores.csv`

#### 2.2 Điền số liệu quan sát còn thiếu ở P01–P06
> ✅ **Tin tốt:** giờ đã có 6 video, **phần lớn các ô dưới đây xem lại băng là điền được** — thời lượng, số hesitation, wrong turn, số lần submit lỗi, quote nguyên văn, thậm chí thiết bị/trình duyệt (nhìn khung hình). Đây là việc ngồi một buổi làm xong, không cần gọi lại người tham gia.
> ⚠️ Vẫn **không suy đoán được** từ băng: điểm SUS (do participant chấm) và đồng thuận ghi hình (phải hỏi).

- [ ] **P06: họ tên đầy đủ** (hiện chỉ có email `ntdat23@clc.fitus.edu.vn`) — cần cho §11, TA có thể gọi xác minh
- [ ] **P06: ngày thực hiện phiên**
**Xem lại video là điền được (6 ô mỗi loại):**
- [ ] **Thiết bị / OS / trình duyệt** — nhìn khung hình video là ra
- [ ] **Thời lượng phiên (giây)** — độ dài file video; cần cho kết luận "timebox 8 phút có đủ" ở P01
- [ ] **Số hesitation ≥ 5 giây**, **số wrong turn**, **số lần submit lỗi**
- [ ] **Quote nguyên văn** trong bảng timeline — nghe lại audio; đây là bằng chứng có trọng số cao khi chấm
- [ ] Probe **Speed** và **Trust** còn trống ở hầu hết phiên — §Phase 1 bắt buộc đủ 4 khía cạnh (clarity, error recovery, speed, trust)
- [ ] **P04: xác nhận có can thiệp moderator hay không** — nếu tự vượt qua blocker mật khẩu thì Outcome = `SUCCESS_UNASSISTED`
- [ ] **P05: xác nhận Outcome** (thành công/thất bại) và có can thiệp ở bước username/email hay không
- [ ] **P06: xác nhận Outcome** — ghi nhận "không tạo được mật khẩu". Nếu **không hoàn thành đăng ký** thì đây là ca `FAIL`/`ABANDONED` **đầu tiên** trong mẫu → ảnh hưởng trực tiếp tới task completion rate, chỉ số chính của báo cáo usability

**Phải hỏi người tham gia / tra lại, video không có:**
- [ ] **P06: họ tên đầy đủ** (hiện chỉ có email `ntdat23@clc.fitus.edu.vn`) — cần cho §11, TA có thể gọi xác minh
- [ ] **P06: ngày thực hiện phiên** (file `P06.mp4` sửa đổi 01/08 — nhưng cần xác nhận đúng ngày chạy phiên)
- [ ] **Đồng thuận ghi hình** Có/Không (6 ô) — ⚠️ bắt buộc làm rõ trước khi upload video lên YouTube
- [ ] **Email test đã cấp** cho từng người (6 ô)

#### 2.3 Chấm điểm SUS
- [ ] **Điểm SUS 10 câu × 7 người** — `SUS_UEQS_Scores.csv` vẫn rỗng; phải do chính participant chấm
- [ ] Tính `sus_score` từng người: `(Σ(lẻ − 1) + Σ(5 − chẵn)) × 2.5`
- [ ] Tính trung bình + so sánh ngưỡng ngành **68**
- [ ] **Điền bảng SUS trong Main_Report §2.4** (hiện 8 ô TODO)

#### 2.4 Ghi hình — 🔴 CẦN XỬ LÝ GẤP
- [x] **Screen recording 6/6 phiên đã chạy** — `usability/recordings/P01.mp4`…`P06.mp4` ✅
- [ ] **Quay phiên P07** sau khi tuyển được người
- [ ] 🔴 **Xử lý dung lượng 1.1 GB** — Moodle không nhận nổi. Chọn 1 trong 2:
  - **Khuyến nghị:** upload cả 6 video lên **YouTube unlisted** → xoá MP4 khỏi zip → thay bằng `recordings/README.md` chứa bảng link. Zip nhẹ, TA vẫn xem được.
  - Hoặc nén video xuống (H.265/giảm bitrate) nếu muốn giữ file trong zip — nhưng 1.1 GB khó nén đủ nhỏ, và rủi ro upload fail sát deadline.
- [ ] ⚠️ **Kiểm tra quyền riêng tư trước khi upload** — video có mặt/giọng người tham gia. Chỉ upload YouTube nếu họ **đã đồng ý ghi hình**. Ô "Đồng thuận ghi hình" trong 6 file phiên hiện vẫn TODO → phải xác nhận trước.
- [ ] Tạo `usability/recordings/README.md`: bảng P01–P07 × (có/không bản ghi · link · thời lượng · đã xin phép chưa)
- [ ] Dán link video vào Main_Report §2.3 để TA thấy ngay khi đọc báo cáo

#### 2.5 Phân tích & bug (làm sau khi đủ 7 phiên)
- [ ] **Thay bảng "Phát hiện dự kiến" trong Main_Report §2.4 bằng phát hiện thật** — hiện vẫn là dự đoán từ đọc code; phải tổng hợp từ 7 phiên, ghi rõ **số phiên gặp phải** cho mỗi vấn đề
- [ ] Tách rõ *isolated bug* vs *systemic design issue*
- [ ] **Bổ sung 5 bug mới phát hiện từ các phiên thật** vào bảng §2.5 (chi tiết ở mục 2.6 bên dưới)
- [ ] Gán participant thật vào cột "Found by" cho BUG-UX-01…05
- [ ] **Tạo GitHub Issue cho từng bug UX** (hiện chưa có issue nào cho Task 2) + đính kèm ảnh chụp

#### 2.6 Bug mới cần thêm vào Main_Report §2.5
> Suy ra từ ghi chú 5 phiên — chưa có trong bảng bug hiện tại:

| Bug ID đề xuất | Phát hiện bởi | Mô tả | Ghi chú |
| --- | --- | --- | --- |
| `BUG-UX-06` | P01 | Nút hiện/ẩn mật khẩu (icon con mắt) chỉ bấm được 1 lần — nhấn lần 2 không ẩn lại được | **Bug mới hoàn toàn**, chưa có ở Task 1 |
| `BUG-UX-07` | P02, P03, P04 | Trang Đăng nhập hiển thị tiêu đề "Đăng Ký" | Trùng `BUG-GUI-09` — nay có xác nhận từ 3 người dùng thật |
| `BUG-UX-08` | P02 | Ngôn ngữ giao diện lẫn lộn Việt/Anh | Trùng `BUG-GUI-10` |
| `BUG-UX-09` | P02 | Không kiểm tra cú pháp email, dữ liệu sai vẫn gửi đi không báo lỗi | Trùng `BUG-GUI-11`/`BUG-GUI-20` |
| `BUG-UX-10` | P05 | Nhãn "Username" nhưng hệ thống xác thực bằng email → người dùng không biết nhập gì | **Bug mới**, chỉ participant non-IT phát hiện |

- [ ] Thêm 5 dòng trên vào bảng §2.5 với đầy đủ Severity / GitHub Issue / Screenshot
- [ ] **Cập nhật `BUG-UX-02` (thiếu trường Xác nhận mật khẩu)** — trước đây chỉ là dự đoán từ đọc code, nay **P06 đã chủ động nêu** → có bằng chứng người dùng thật, nên nâng mức ưu tiên và ghi rõ nguồn

#### 2.7 Phát hiện quan trọng nên nêu bật trong phần phân tích
> Đây là kết quả có giá trị nhất từ dữ liệu 5 phiên, nên viết thành một mục riêng:

- [ ] **Blocker mật khẩu xảy ra với 6/6 người** (100% mẫu) — mức phổ biến tuyệt đối, đủ căn cứ xếp `Blocker`
- [ ] **Phổ mức độ nghiêm trọng của cùng một lỗi** — cùng lỗi regex mật khẩu nhưng hậu quả khác nhau rõ rệt: P01–P03 qua được **nhờ hỗ trợ**; P04 **tự dò ra** nguyên nhân; **P06 không tạo được mật khẩu**. Cả P04 và P06 đều là dân IT → khả năng thoát khỏi lỗi mang tính **may rủi trong cách thử-sai**, không phải kỹ năng trông cậy được. Lập luận này củng cố việc xếp `BUG-UX-01` ở mức **Blocker** thay vì Major.
- [ ] **Task completion rate** — tính và nêu rõ tỉ lệ hoàn thành task (phụ thuộc Outcome cuối của P05, P06). Đây là chỉ số chính của một báo cáo usability, hiện chưa có trong Main_Report.
- [ ] **P04 là người duy nhất tự chẩn đoán đúng nguyên nhân** (mật khẩu phải chứa khoảng trắng) — bằng chứng người dùng mạnh nhất cho `BUG-UX-01`
- [ ] **Đối chứng IT vs non-IT:** P05 (non-IT) gặp vấn đề username/email mà 5 người IT không báo cáo → participant IT tự bù đắp khiếm khuyết giao diện bằng kinh nghiệm kỹ thuật, nên **mức nghiêm trọng thực tế với người dùng cuối cao hơn** những gì mẫu IT phản ánh. Đây là lập luận phân tích tốt cho tiêu chí "Analyse" (G9.3).
- [ ] **Mức độ đồng thuận giữa các phiên** — bảng tần suất: mật khẩu 6/6 · mật khẩu không che 5/6 (P01 dưới dạng lỗi toggle) · tiêu đề Login sai 3/6 · thiếu xác nhận mật khẩu 1/6 · username/email 1/6 · ngôn ngữ lẫn lộn 1/6 · validate email 1/6. Tần suất là căn cứ khách quan để xếp thứ tự ưu tiên.

---

## 3. Task 3 — Cross-Browser / Cross-Platform (20đ)

### Đã có ✅
- [x] 3 nền tảng: Chrome 141/Win11 (Blink), Firefox 145/Win11 (**Gecko**), Android Chrome/Pixel 7 — đủ §6 (Android Chrome thay Safari là hợp lệ)
- [x] 18 test case × 3 nền tảng = 54 lượt chạy — `cross-platform/run_cross_platform.py`, `results.json`
- [x] Ma trận kết quả CSV + XLSX
- [x] Báo cáo đầy đủ (`cross-platform/Report.md` + inline trong Main_Report §3)
- [x] 16 ảnh chụp bằng chứng
- [x] Ghi minh bạch lý do không chạy được WebKit thật

### Còn thiếu ❌
- [ ] **Xác minh mọi ảnh chụp có overlay `23127344@hcmus.edu.vn`** — §6 và §11 bắt buộc. Báo cáo tự nhận là có, nhưng cần mở từng ảnh trong `cross-platform/screenshots/` kiểm tra bằng mắt.
- [ ] **Kiểm tra ảnh hiển thị rõ tên browser/OS/device + URL SUT** (§6) — đặc biệt ảnh P3 phải thấy URL `172.16.0.252:5173`.
- [ ] **GitHub Issue cho các bug Task 3** — Main_Report §3.6 liệt kê ~6 bug (BUG-CP-01…) nhưng **chưa thấy link issue nào**. §Task 1/Task 2 đều yêu cầu report bug lên GitHub Issues; nên làm đồng nhất cho Task 3.
- [ ] (Tuỳ chọn, cộng điểm) Test app mobile qua **Expo Go** trên điện thoại thật — hiện chưa có.

---

## 4. Agent Skills (10đ) — ❌ CHƯA CÓ GÌ

§7 khuyến khích, nhưng §15 tính **10 điểm** trong bảng đánh giá.

- [ ] **Viết Agent Skill cho GUI checklist** (thiết kế + thực thi checklist trên một màn hình bất kỳ)
- [ ] **Viết Agent Skill cho usability evaluation** (sinh scenario + khung phiên + tính SUS)
- [ ] Đặt vào `.claude/skills/<tên-skill>/SKILL.md` và **copy vào `submission/skills/`** để nộp kèm
- [ ] **Quay video demo end-to-end** cho mỗi skill (chạy trọn 1 màn hình hoặc 1 flow)
- [ ] Upload YouTube (unlisted được) và **dán link vào README.md + Main_Report**

---

## 5. Hồ sơ nộp bắt buộc (§14) — nhiều mục còn thiếu

> §17: *"Missing any required document results in 0 points."*

| # | Yêu cầu §14 | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| 1 | Main report **Markdown** | ✅ | `submission/Main_Report.md` |
| 2 | Main report **PDF** | ❌ | **Chưa có** — cần export ra PDF |
| 3 | Bug report + ảnh chụp GitHub Issues | ⚠️ | Bảng bug có trong Main_Report, nhưng **file `bug_reports.md` riêng đã bị xoá** khỏi submission và **thiếu ảnh trang Issues** |
| 4 | AI Audit Report **Markdown** | ✅ | `[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md` (còn 12 TODO cần điền) |
| 5 | AI Audit Report **PDF** | ❌ | **Chưa có** |
| 6 | **AI Critique 200–300 từ** | ❌ | **Không tìm thấy** — §10 bắt buộc. File `AI_Critique.md` từng được nhắc trong audit log nhưng không tồn tại trong `submission/` |
| 7 | AI Critique **PDF** | ❌ | Chưa có |
| 8 | Git commit log (text) | ⚠️ | `git_commit_log.txt` có 14 dòng — **cần refresh** sau khi commit các bước Task 2 (§12 yêu cầu 1 commit/mỗi bước, gồm **từng phiên usability**) |
| 9 | Excel checklist > 40 item + test summary | ✅ | `checklist/GUI_Checklist.xlsx` (69 item) |
| 10 | Usability evidence (scenario, notes, SUS, findings, recordings) + bảng 7 participant | 🟡 | Scenario ✅ · notes 6/7 ✅ · **recordings 6/7 ✅ (1.1 GB — phải chuyển YouTube)** · SUS ❌ rỗng · findings ❌ chưa tổng hợp · participant 6/7 |
| 11 | Cross-platform screenshots | ✅ | 16 ảnh (cần verify overlay) |
| 12 | **README.md** (self-assessment table + test summary) | ❌ | **Đã bị xoá khỏi submission** — xem mẫu bên dưới |
| 13 | Zip đúng tên `23127344_HW03_AI_GUIUsability_<XXX>.zip` | ❌ | Chưa đóng gói; `<XXX>` = điểm tự chấm 3 chữ số |

### 5.1 README.md cần chứa
- [ ] Bảng self-assessment (4 tiêu chí × cột Grade / Self-Assessed Grade, tổng 100)
- [ ] Số màn hình / flow đã test
- [ ] Số checklist item: **designed / executed / passed / failed** (hiện: 69 / 69 / 36 / 32, N/A 1)
- [ ] Tổng số bug (Task 1: 30 · Task 2: ? · Task 3: ?)
- [ ] Số người tham gia (7)
- [ ] Link demo video của Agent Skills

### 5.2 AI Audit Report — 12 TODO còn treo
- [ ] Điền nốt các ô TODO trong `[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md`
- [ ] Bổ sung Artifact cho các bước Task 2 sẽ làm (mỗi phiên/tổng hợp dùng AI đều phải log: tên tool, ngày giờ, prompt, output)
- [ ] Ký tên + điền phần "Công bố Bắt buộc" nguyên văn: *"I use AI tools for the following tasks"*
- [ ] Sửa các đường dẫn cũ không còn đúng (`hw3/report/`, `hw4/docs/`)

---

## 6. Thứ tự làm việc đề xuất (cập nhật)

**Việc phụ thuộc người khác — làm trước, khoá lịch sớm:**
1. **Tuyển P07** (ưu tiên non-IT) + chạy phiên + quay video → mục 2.1
2. **Xin điểm SUS của cả 7 người** — chỉ họ chấm được; nếu chưa chấm lúc kết thúc phiên thì gửi form ngay hôm nay → mục 2.3
3. **Hỏi lại 6 người: có đồng ý cho upload video không** → mục 2.4
4. **Hỏi P06 họ tên đầy đủ** → mục 2.2

**Việc tự làm được, không chờ ai:**
5. 🔴 **Upload 6 video lên YouTube unlisted** (1.1 GB, upload lâu — bắt đầu sớm, chạy nền) → mục 2.4
6. **Xem lại 6 video, điền số liệu quan sát + quote** → mục 2.2
7. **Viết AI_Critique.md** (200–300 từ) và **README.md** → mục 5
8. **Viết 2 Agent Skills** + quay demo → mục 4
9. Tính SUS + tổng hợp findings + **tạo GitHub Issues cho bug Task 2/Task 3** → mục 2.5, 3
10. **Chụp ảnh trang GitHub Issues** → mục 1
11. **Verify overlay MSSV** trên ảnh cross-platform → mục 3
12. Refresh `git_commit_log.txt`, **export 3 bản PDF**, đóng gói zip (**không kèm MP4**) → mục 5

> **Mẹo:** bước 5 và 6 làm song song được — vừa để video upload chạy nền, vừa mở file xem lại điền số liệu.
