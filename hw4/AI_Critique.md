# HW04 — AI Critique

| Trường     | Giá trị                                       |
| ---------- | --------------------------------------------- |
| Họ tên     | TRƯƠNG THÀNH ĐẠT                              |
| MSSV       | 23127344                                      |
| Assignment | HW04 — Automation Testing                     |
| AI tool    | Claude Opus 5 (Claude Code, VSCode extension) |
| Số từ      | 273 / 200–300 ✅                              |

## Ba câu hỏi bắt buộc phải trả lời

Đề bài §10 nêu rõ đoạn văn phải trả lời:

1. **AI sai / thiên lệch / thiếu sót ở đâu?** (Where did the AI get something wrong, biased, or incomplete?)
2. **Vì sao AI không phát hiện được vấn đề đó?** (Why did it fail to catch the issue?)
3. **Em rút ra nguyên tắc gì về việc cộng tác với AI?** (What principle have you learned about collaborating with AI?)

## Bài viết

Sai lầm đáng nhớ nhất của AI trong bài này không phải một dòng code hỏng, mà là một **bằng chứng rỗng trông như đã hoàn thành**. AI chèn banner `Run by: 23127344` vào giữa `</head>` và `<body>` — vị trí không hợp lệ cho nội dung hiển thị, nên trình duyệt đẩy nó ra khỏi luồng render. Chuỗi ký tự **có** trong cả 9 file HTML, nhưng mở lên **không nhìn thấy gì**, đúng thứ §11 chống gian lận bắt buộc phải thấy được. Nghiêm trọng hơn: chính `verifyReports.ts` do AI viết vẫn báo "All checks passed" suốt ba feature. Em phát hiện bằng mắt khi mở báo cáo, không phải nhờ cổng kiểm.

Vì sao AI không tự bắt được? Có cả ba nguyên nhân §6 nêu, nhưng gốc rễ là **AI không biết điều nó không biết**. Nó viết cả test lẫn công cụ kiểm chứng test, rồi tin vào kết quả của chính mình mà không một lần tự hỏi oracle có đo đúng thứ cần đo hay không. Đề bài yêu cầu bằng chứng *nhìn thấy được*, AI lại kiểm *chuỗi ký tự có trong file* — sai tầng, và sai một cách im lặng.

Nguyên tắc em rút ra: **phải cấp cho AI đặc tả, đừng cấp source code, khi cần nó viết oracle.** Đọc code thì AI mô tả lại hành vi hiện tại — kể cả hành vi sai — thay vì kiểm chứng theo SRS; y hệt việc nó kiểm bytes thay vì kiểm hiển thị. Nhờ luôn giữ `expected` theo SRS mà 13 defect cài sẵn mới lộ ra, thay vì bị hợp thức hóa thành "đúng".
