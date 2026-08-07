# Bug log

Run by: 23127344
Timestamp: 2026-08-07T15:57:55.008Z

## TC-PROFILE-04 - fr04-profile

- Browser: chrome
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ bắt đầu bằng 0, dài 10–11 chữ số → 10 chữ số là biên dưới hợp lệ.
- Actual: SRS says "0123456789" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-04.png
- GitHub Issue: TBD

## TC-PROFILE-05 - fr04-profile

- Browser: chrome
- Severity: TBD
- Expected: SRS §2 FR-04: 11 chữ số bắt đầu bằng 0 là biên trên hợp lệ.
- Actual: SRS says "01234567890" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-05.png
- GitHub Issue: TBD

## TC-PROFILE-08 - fr04-profile

- Browser: chrome
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ phải bắt đầu bằng số 0.
- Actual: invalid phone "912345678" must raise the validation alert: expected 'Cập nhật thành công!' to equal 'Số điện thoại không hợp lệ. Vui lòng …'
- Screenshot: bug-snapshots/TC-PROFILE-08.png
- GitHub Issue: TBD

## TC-PROFILE-12 - fr04-profile

- Browser: chrome
- Severity: TBD
- Expected: SRS §2 FR-04: người dùng không thể tự thay đổi thuộc tính role.
- Actual: SRS FR-04 forbids self-service role changes (HTTP 200): expected 'admin' to equal 'user'
- Screenshot: bug-snapshots/TC-PROFILE-12.png
- GitHub Issue: TBD

## TC-PROFILE-04 - fr04-profile

- Browser: edge
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ bắt đầu bằng 0, dài 10–11 chữ số → 10 chữ số là biên dưới hợp lệ.
- Actual: SRS says "0123456789" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-04.png
- GitHub Issue: TBD

## TC-PROFILE-05 - fr04-profile

- Browser: edge
- Severity: TBD
- Expected: SRS §2 FR-04: 11 chữ số bắt đầu bằng 0 là biên trên hợp lệ.
- Actual: SRS says "01234567890" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-05.png
- GitHub Issue: TBD

## TC-PROFILE-08 - fr04-profile

- Browser: edge
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ phải bắt đầu bằng số 0.
- Actual: invalid phone "912345678" must raise the validation alert: expected 'Cập nhật thành công!' to equal 'Số điện thoại không hợp lệ. Vui lòng …'
- Screenshot: bug-snapshots/TC-PROFILE-08.png
- GitHub Issue: TBD

## TC-PROFILE-12 - fr04-profile

- Browser: edge
- Severity: TBD
- Expected: SRS §2 FR-04: người dùng không thể tự thay đổi thuộc tính role.
- Actual: SRS FR-04 forbids self-service role changes (HTTP 200): expected 'admin' to equal 'user'
- Screenshot: bug-snapshots/TC-PROFILE-12.png
- GitHub Issue: TBD

## TC-PROFILE-04 - fr04-profile

- Browser: firefox
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ bắt đầu bằng 0, dài 10–11 chữ số → 10 chữ số là biên dưới hợp lệ.
- Actual: SRS says "0123456789" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-04.png
- GitHub Issue: TBD

## TC-PROFILE-05 - fr04-profile

- Browser: firefox
- Severity: TBD
- Expected: SRS §2 FR-04: 11 chữ số bắt đầu bằng 0 là biên trên hợp lệ.
- Actual: SRS says "01234567890" is a valid phone number: expected 'Số điện thoại không hợp lệ. Vui lòng …' to equal 'Cập nhật thành công!'
- Screenshot: bug-snapshots/TC-PROFILE-05.png
- GitHub Issue: TBD

## TC-PROFILE-08 - fr04-profile

- Browser: firefox
- Severity: TBD
- Expected: SRS §2 FR-04: SĐT hợp lệ phải bắt đầu bằng số 0.
- Actual: invalid phone "912345678" must raise the validation alert: expected 'Cập nhật thành công!' to equal 'Số điện thoại không hợp lệ. Vui lòng …'
- Screenshot: bug-snapshots/TC-PROFILE-08.png
- GitHub Issue: TBD

## TC-PROFILE-12 - fr04-profile

- Browser: firefox
- Severity: TBD
- Expected: SRS §2 FR-04: người dùng không thể tự thay đổi thuộc tính role.
- Actual: SRS FR-04 forbids self-service role changes (HTTP 200): expected 'admin' to equal 'user'
- Screenshot: bug-snapshots/TC-PROFILE-12.png
- GitHub Issue: TBD

## TC-CHECKOUT-03 - fr08-checkout

- Browser: chrome
- Severity: TBD
- Expected: FR-08: sau khi thanh toán thành công, giỏ hàng của user phải được xóa
- Actual: SRS FR-08: the cart must be emptied after a successful checkout: expected false to equal true
- Screenshot: bug-snapshots/TC-CHECKOUT-03.png
- GitHub Issue: TBD

## TC-CHECKOUT-04 - fr08-checkout

- Browser: chrome
- Severity: TBD
- Expected: FR-09: coupon percent giảm discount_value% trên tổng đơn; SAVE10 = 10%, min_order_amount = 300.000₫
- Actual: discount computed per SRS FR-09: expected -36000000 to equal 400000
- Screenshot: bug-snapshots/TC-CHECKOUT-04.png
- GitHub Issue: TBD

## TC-CHECKOUT-07 - fr08-checkout

- Browser: chrome
- Severity: TBD
- Expected: FR-08: người dùng KHÔNG được sửa tổng tiền; backend phải tự tính lại tổng từ giỏ hàng
- Actual: SRS FR-08: the order total must not be a user-editable field: expected true to equal false
- Screenshot: bug-snapshots/TC-CHECKOUT-07.png
- GitHub Issue: TBD

## TC-CHECKOUT-13 - fr08-checkout

- Browser: chrome
- Severity: TBD
- Expected: FR-09 C3: điều kiện là total_amount >= min_order_amount, nên đúng bằng ngưỡng vẫn hợp lệ
- Actual: SRS FR-09 C3 is ">=", so a total of exactly 300000 must be accepted (server said: {"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}): expected 400 to equal 200
- Screenshot: bug-snapshots/TC-CHECKOUT-13.png
- GitHub Issue: TBD

## TC-CHECKOUT-16 - fr08-checkout

- Browser: chrome
- Severity: TBD
- Expected: FR-08: không được tạo đơn hàng rỗng — phải có thông báo và không sinh bản ghi
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 138 to equal 137
- Screenshot: bug-snapshots/TC-CHECKOUT-16.png
- GitHub Issue: TBD

## TC-CHECKOUT-03 - fr08-checkout

- Browser: edge
- Severity: TBD
- Expected: FR-08: sau khi thanh toán thành công, giỏ hàng của user phải được xóa
- Actual: SRS FR-08: the cart must be emptied after a successful checkout: expected false to equal true
- Screenshot: bug-snapshots/TC-CHECKOUT-03.png
- GitHub Issue: TBD

## TC-CHECKOUT-04 - fr08-checkout

- Browser: edge
- Severity: TBD
- Expected: FR-09: coupon percent giảm discount_value% trên tổng đơn; SAVE10 = 10%, min_order_amount = 300.000₫
- Actual: discount computed per SRS FR-09: expected -36000000 to equal 400000
- Screenshot: bug-snapshots/TC-CHECKOUT-04.png
- GitHub Issue: TBD

## TC-CHECKOUT-07 - fr08-checkout

- Browser: edge
- Severity: TBD
- Expected: FR-08: người dùng KHÔNG được sửa tổng tiền; backend phải tự tính lại tổng từ giỏ hàng
- Actual: SRS FR-08: the order total must not be a user-editable field: expected true to equal false
- Screenshot: bug-snapshots/TC-CHECKOUT-07.png
- GitHub Issue: TBD

## TC-CHECKOUT-13 - fr08-checkout

- Browser: edge
- Severity: TBD
- Expected: FR-09 C3: điều kiện là total_amount >= min_order_amount, nên đúng bằng ngưỡng vẫn hợp lệ
- Actual: SRS FR-09 C3 is ">=", so a total of exactly 300000 must be accepted (server said: {"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}): expected 400 to equal 200
- Screenshot: bug-snapshots/TC-CHECKOUT-13.png
- GitHub Issue: TBD

## TC-CHECKOUT-16 - fr08-checkout

- Browser: edge
- Severity: TBD
- Expected: FR-08: không được tạo đơn hàng rỗng — phải có thông báo và không sinh bản ghi
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 142 to equal 141
- Screenshot: bug-snapshots/TC-CHECKOUT-16.png
- GitHub Issue: TBD

## TC-CHECKOUT-03 - fr08-checkout

- Browser: firefox
- Severity: TBD
- Expected: FR-08: sau khi thanh toán thành công, giỏ hàng của user phải được xóa
- Actual: SRS FR-08: the cart must be emptied after a successful checkout: expected false to equal true
- Screenshot: bug-snapshots/TC-CHECKOUT-03.png
- GitHub Issue: TBD

## TC-CHECKOUT-04 - fr08-checkout

- Browser: firefox
- Severity: TBD
- Expected: FR-09: coupon percent giảm discount_value% trên tổng đơn; SAVE10 = 10%, min_order_amount = 300.000₫
- Actual: discount computed per SRS FR-09: expected -36000000 to equal 400000
- Screenshot: bug-snapshots/TC-CHECKOUT-04.png
- GitHub Issue: TBD

## TC-CHECKOUT-07 - fr08-checkout

- Browser: firefox
- Severity: TBD
- Expected: FR-08: người dùng KHÔNG được sửa tổng tiền; backend phải tự tính lại tổng từ giỏ hàng
- Actual: SRS FR-08: the order total must not be a user-editable field: expected true to equal false
- Screenshot: bug-snapshots/TC-CHECKOUT-07.png
- GitHub Issue: TBD

## TC-CHECKOUT-13 - fr08-checkout

- Browser: firefox
- Severity: TBD
- Expected: FR-09 C3: điều kiện là total_amount >= min_order_amount, nên đúng bằng ngưỡng vẫn hợp lệ
- Actual: SRS FR-09 C3 is ">=", so a total of exactly 300000 must be accepted (server said: {"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}): expected 400 to equal 200
- Screenshot: bug-snapshots/TC-CHECKOUT-13.png
- GitHub Issue: TBD

## TC-CHECKOUT-16 - fr08-checkout

- Browser: firefox
- Severity: TBD
- Expected: FR-08: không được tạo đơn hàng rỗng — phải có thông báo và không sinh bản ghi
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 146 to equal 145
- Screenshot: bug-snapshots/TC-CHECKOUT-16.png
- GitHub Issue: TBD

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
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #161 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
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
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #176 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
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
- Actual: SRS FR-10: delivered and canceled are terminal, so no status button may be offered. #191 (canceled) offers: Đánh dấu Đã giao: expected [ Array(1) ] to deeply equal []
- Screenshot: bug-snapshots/TC-ADMIN-16.png
- GitHub Issue: TBD

