import { z } from "zod";

export const RoleEnum = z.enum(["CUSTOMER", "ADMIN", "BLOCKED"]);
export const OrderStatusEnum = z.enum(["PENDING", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"]);
export const PaymentStatusEnum = z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]);
export const DiscountTypeEnum = z.enum(["PERCENTAGE", "FIXED"]);
export const CartStatusEnum = z.enum(["ACTIVE", "CHECKED_OUT"]);
