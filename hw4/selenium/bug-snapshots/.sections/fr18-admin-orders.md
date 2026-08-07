## TC-ADMIN-07 - fr18-admin-orders

- Browser: chrome
- Severity: TBD
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: TBD

## TC-ADMIN-12 - fr18-admin-orders

- Browser: chrome
- Severity: TBD
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: TBD

## TC-ADMIN-14 - fr18-admin-orders

- Browser: chrome
- Severity: TBD
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: TBD

## TC-ADMIN-16 - fr18-admin-orders

- Browser: chrome
- Severity: TBD
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #104 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: TBD

## TC-ADMIN-07 - fr18-admin-orders

- Browser: edge
- Severity: TBD
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: TBD

## TC-ADMIN-12 - fr18-admin-orders

- Browser: edge
- Severity: TBD
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: TBD

## TC-ADMIN-14 - fr18-admin-orders

- Browser: edge
- Severity: TBD
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: TBD

## TC-ADMIN-16 - fr18-admin-orders

- Browser: edge
- Severity: TBD
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #119 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: TBD

## TC-ADMIN-07 - fr18-admin-orders

- Browser: firefox
- Severity: TBD
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: TBD

## TC-ADMIN-12 - fr18-admin-orders

- Browser: firefox
- Severity: TBD
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: TBD

## TC-ADMIN-14 - fr18-admin-orders

- Browser: firefox
- Severity: TBD
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: TBD

## TC-ADMIN-16 - fr18-admin-orders

- Browser: firefox
- Severity: TBD
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #134 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: TBD

