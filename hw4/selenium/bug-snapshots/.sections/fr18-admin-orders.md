## TC-ADMIN-07 - fr18-admin-orders

- Browser: chrome
- Severity: High
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: [#267](https://github.com/DuyITLOR/group05_eshop/issues/267)

## TC-ADMIN-12 - fr18-admin-orders

- Browser: chrome
- Severity: Critical
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: [#262](https://github.com/DuyITLOR/group05_eshop/issues/262)

## TC-ADMIN-14 - fr18-admin-orders

- Browser: chrome
- Severity: High
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: [#268](https://github.com/DuyITLOR/group05_eshop/issues/268)

## TC-ADMIN-16 - fr18-admin-orders

- Browser: chrome
- Severity: Medium
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #218 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: [#272](https://github.com/DuyITLOR/group05_eshop/issues/272)

## TC-ADMIN-07 - fr18-admin-orders

- Browser: edge
- Severity: High
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: [#267](https://github.com/DuyITLOR/group05_eshop/issues/267)

## TC-ADMIN-12 - fr18-admin-orders

- Browser: edge
- Severity: Critical
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: [#262](https://github.com/DuyITLOR/group05_eshop/issues/262)

## TC-ADMIN-14 - fr18-admin-orders

- Browser: edge
- Severity: High
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: [#268](https://github.com/DuyITLOR/group05_eshop/issues/268)

## TC-ADMIN-16 - fr18-admin-orders

- Browser: edge
- Severity: Medium
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #233 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: [#272](https://github.com/DuyITLOR/group05_eshop/issues/272)

## TC-ADMIN-07 - fr18-admin-orders

- Browser: firefox
- Severity: High
- Expected: SRS §5 FR-10: canceled là trạng thái kết thúc, không được chuyển tiếp
- Actual: SRS FR-10 forbids canceled -> delivered, so it must be refused (server said: {"message":"Order status updated"}): expected 200 to not equal 200
- Screenshot: bug-snapshots/TC-ADMIN-07.png
- GitHub Issue: [#267](https://github.com/DuyITLOR/group05_eshop/issues/267)

## TC-ADMIN-12 - fr18-admin-orders

- Browser: firefox
- Severity: Critical
- Expected: SRS §6 FR-12: mọi API /api/admin/* yêu cầu JWT hợp lệ VÀ role = 'admin'
- Actual: SRS FR-12: /api/admin/* requires role='admin', so a normal user's token must be refused with 401/403 but got HTTP 200: expected [ 401, 403 ] to include 200
- Screenshot: bug-snapshots/TC-ADMIN-12.png
- GitHub Issue: [#262](https://github.com/DuyITLOR/group05_eshop/issues/262)

## TC-ADMIN-14 - fr18-admin-orders

- Browser: firefox
- Severity: High
- Expected: SRS §6 FR-18: địa chỉ giao hàng phải hiển thị an toàn (dạng text thuần)
- Actual: SRS FR-18: the shipping address must be displayed as plain text: expected 'xss' to equal '<b>xss</b>'
- Screenshot: bug-snapshots/TC-ADMIN-14.png
- GitHub Issue: [#268](https://github.com/DuyITLOR/group05_eshop/issues/268)

## TC-ADMIN-16 - fr18-admin-orders

- Browser: firefox
- Severity: Medium
- Expected: SRS §5 FR-10 + §6 FR-18: delivered/canceled là trạng thái kết thúc nên UI không được mời chuyển tiếp
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #248 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: [#272](https://github.com/DuyITLOR/group05_eshop/issues/272)

