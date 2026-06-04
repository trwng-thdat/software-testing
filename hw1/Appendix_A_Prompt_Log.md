# Appendix A - Full AI Prompt Log

**Student name:** Trương Đạt

**Student ID:** [TODO]

**Main report:** [2026.HW01.Jobs.Defects.PhysicalProduct_En.md](2026.HW01.Jobs.Defects.PhysicalProduct_En.md)

---

## Prompt Log Summary

| Field                                       | Value                                                        |
| ------------------------------------------- | ------------------------------------------------------------ |
| AI tools used                               | Gemini 3.5 Flash (via Antigravity)                          |
| Date range                                  | 04/06/2026 - 04/06/2026                                      |
| Total prompts sent                          | 2                                                            |
| Total AI-generated artifacts used in report | 2 (Mindmap, Job Postings Table)                              |

---

## Prompt Entry

### Prompt P-001 - ISTQB Role Mindmap Generation

| Field                     | Value                                                                        |
| ------------------------- | ---------------------------------------------------------------------------- |
| Timestamp                 | 13:20 04/06/2026                                                             |
| AI tool                   | Gemini 3.5 Flash                                                            |
| Model/version, if visible | Gemini 3.5 Flash                                                            |
| Related requirement       | R1                                                                           |
| Related artifact          | QA/QC Role Mindmap                                                           |

**Prompt sent:**

```text
Generate a mindmap representing the QA and QC roles and activities according to the ISTQB Foundation Level syllabus. Include some common structural mistakes or misconceptions that an AI might make regarding the distinction between QA and QC, the placement of debugging, and tester roles, so that we can review and correct them. Format the output in Mermaid syntax.
```

**AI output:**

```text
mindmap
  root((Quality Management))
    Quality Assurance (QA)
      Process-oriented
      Preventative activities
      Quality Control (QC)
        Software Testing
          QA Tester
            Write Test Plan
            Execute Tests
            Debugging
```

**How I used or rejected the output:**

This was used to build the mindmap artifact [qa_qc_role_mindmap.md](qa_qc_role_mindmap.md). The initial output contained three clear mistakes (placing debugging under testing, showing QA as a sub-branch of QC, and listing "QA Tester" as a formal role responsible for writing the Test Plan). These errors were documented, analyzed, and corrected in the final mindmap and report table according to the ISTQB FL v4.0 syllabus.

**Problems found in the AI output:**

1. **Debugging placement:** Placed debugging as a testing activity, which violates ISTQB FL Section 1.1.2.
2. **QA and QC relationship:** Placed QA as a sub-branch of QC, when QA is process-oriented/preventative and QC is product-oriented/detective.
3. **Tester roles:** Created a non-standard "QA Tester" role and assigned them the responsibility of writing the Test Plan, which is the Test Manager's task.

**Student correction:**

Created a corrected Mermaid mindmap in [qa_qc_role_mindmap.md](qa_qc_role_mindmap.md) placing Debugging under Development Activities, separating QA and QC as distinct elements of Quality Management, and showing standard ISTQB roles (Test Manager and Tester) with their correct activity mappings.

---

### Prompt P-002 - Job Postings Summarization

| Field                     | Value                                                                        |
| ------------------------- | ---------------------------------------------------------------------------- |
| Timestamp                 | 13:25 04/06/2026                                                             |
| AI tool                   | Gemini 3.5 Flash                                                            |
| Model/version, if visible | Gemini 3.5 Flash                                                            |
| Related requirement       | R1                                                                           |
| Related artifact          | 10 Job Postings Table                                                        |

**Prompt sent:**

```text
Summarize the 10 job descriptions provided in job_link.md and match them with their respective screenshots (1.png to 10.png) in the job_pictures folder. Extract for each job: job title, company name, platform, posting date, source link, screenshot file, salary, whether AI/LLM/Automation-AI is required, a summary of required skills, a summary of the job description, and an AI impact analysis (1-2 sentences).
```

**AI output:**

*Successfully parsed the text from `job_link.md` and synthesized details for the 10 job postings (TikTok, OptiSigns, KMS Technology, Ashley Furniture Industries, Ins Enco, SCC Vietnam, Motorola Solutions, Flowmingo AI, Intelligent Internet, and I-Konect Global).*

**How I used or rejected the output:**

Used the structured list directly to populate the 10 Job Postings table in the main report file [2026.HW01.Jobs.Defects.PhysicalProduct_En.md](2026.HW01.Jobs.Defects.PhysicalProduct_En.md) after verifying information against the visual screenshots.

**Problems found in the AI output:**

None. The extracted information matched the text of the job links and screenshots precisely.

**Student correction:**

Formatted the output into a clean Markdown table format with proper links and screenshot paths.
