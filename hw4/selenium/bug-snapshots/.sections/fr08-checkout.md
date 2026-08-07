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
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 64 to equal 63
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
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 68 to equal 67
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
- Actual: SRS FR-08: an empty cart must not create an order (success shown: true): expected 72 to equal 71
- Screenshot: bug-snapshots/TC-CHECKOUT-16.png
- GitHub Issue: TBD

