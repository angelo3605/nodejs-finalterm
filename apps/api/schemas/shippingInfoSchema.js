import { z } from "zod";

export const ShippingInfoSchema = z.object({
  address: z
    .string()
    .min(1)
    .regex(/^\d+\sĐường\s[\p{L}\d\s]+?\s*,\s+(Quận|Huyện)\s[\p{L}\d\s]+,\s+(TP|Tỉnh)\.[\p{L}\s]+$/u, {
      message: "Địa chỉ không đúng định dạng. VD: 123 Đường ABC, Quận 1, TP.HCM",
    })
    .transform((str) => str.trim().replace(/\s+/g, " ")),
  phoneNumber: z
    .string()
    .length(10, {
      message: "Số điện thoại phải có đúng 10 chữ số",
    })
    .regex(/^0\d{9}$/, {
      message: "Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và có 10 chữ số.",
    }),
  fullName: z.string().min(1, {
    message: "Họ tên không được để trống",
  }),
});
