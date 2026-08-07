# HW04 — AI Critique

> **Bắt buộc (§10 đề bài).** Một đoạn văn **200–300 từ** phê bình AI. Đếm từ trước khi nộp — dưới 200 hoặc trên 300 đều bị trừ.

| Trường     | Giá trị                                     |
| ---------- | ------------------------------------------- |
| Họ tên     | [Họ tên]                                    |
| MSSV       | [MSSV]                                      |
| Assignment | HW04 — Automation Testing                   |
| AI tool    | [tool đã dùng]                              |
| Số từ      | [n] / 200–300                               |

## Ba câu hỏi bắt buộc phải trả lời

Đề bài §10 nêu rõ đoạn văn phải trả lời:

1. **AI sai / thiên lệch / thiếu sót ở đâu?** (Where did the AI get something wrong, biased, or incomplete?)
2. **Vì sao AI không phát hiện được vấn đề đó?** (Why did it fail to catch the issue?)
3. **Em rút ra nguyên tắc gì về việc cộng tác với AI?** (What principle have you learned about collaborating with AI?)

## Bài viết

> 💡 Viết thành **một đoạn văn liền mạch** (đề bài yêu cầu "a paragraph"), không gạch đầu dòng. Dẫn chứng cụ thể từ bảng §1.7 của [`Main_Report.md`](Main_Report.md) — phê bình chung chung kiểu "AI đôi khi sai" không được điểm.

[Viết 200–300 từ tại đây.]

---

## Ghi chú soạn thảo (xóa mục này trước khi nộp)

**Dẫn chứng có thể dùng — lấy từ chính bài làm, không bịa:**

| Nhóm lỗi                     | Dẫn chứng cụ thể trong bài                                        | Trả lời câu hỏi số |
| ---------------------------- | ------------------------------------------------------------------ | ------------------ |
| Selector bịa                 | [AI sinh `data-testid` trong khi SUT không có attribute nào]        | 1, 2               |
| Không xử lý `alert()`        | [`UnexpectedAlertOpenError` làm đổ vỡ dây chuyền cả file spec]      | 1, 2               |
| Assert theo hành vi lỗi      | [Bug thật bị hợp thức hóa thành expected → test xanh mà vô nghĩa]   | 1, 2, 3            |
| Wait cứng `sleep()`          | [Test flaky, chạy chậm]                                             | 1, 2               |
| Chỉ sinh happy path          | [Thiếu hẳn nhóm boundary/edge nếu không yêu cầu rõ]                 | 1, 2               |
| Điều hướng admin bằng URL    | [Admin là SPA dạng tab, route đó không tồn tại]                     | 1, 2               |

**Về câu hỏi 2 (vì sao AI không phát hiện):** phân loại nguyên nhân theo đúng ba nhóm mà đề bài §6 nêu — **chất lượng prompt**, **giới hạn mô hình**, hoặc **đặc thù feature**. Nêu rõ nhóm nào chiếm đa số trong bài của em.

**Về câu hỏi 3 (nguyên tắc rút ra):** nên là một phát biểu **kiểm chứng được**, gắn với trải nghiệm thật. Tránh khẩu hiệu sáo rỗng. Ví dụ hướng tiếp cận:
- AI cần được cấp **đặc tả**, không phải source code, khi viết oracle — nếu cho xem code, AI sẽ mô tả lại hành vi hiện tại (kể cả hành vi sai) thay vì kiểm chứng nó.
- Test **xanh** do AI sinh không đồng nghĩa test **đúng**; phải xác minh bằng cách cố ý làm nó đỏ.
- Việc AI làm tốt nhất là phần lặp lại có cấu trúc; phần cần quan sát hệ thống thật vẫn phải do người làm.
