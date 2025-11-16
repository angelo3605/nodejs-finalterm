import fs from "fs";
import path from "path";
import { ghn } from "../utils/ghn.js";
import { getOrderByIdService } from "./orderService.js";
import prisma from "../prisma/client.js";

const SNAPSHOT_FILE_PATH = "public/data/provinces.json";

const raw = fs.readFileSync(path.resolve(SNAPSHOT_FILE_PATH));
const provinces = JSON.parse(raw);

const getDistrict = (districtName) => {
  for (const province of provinces) {
    const district = province.districts.find((d) => d.name === districtName);
    if (district) {
      return district;
    }
  }
  return undefined;
};

export const getWardService = async (districtName) => {
  const district = getDistrict(districtName);
  if (district) {
    const {
      data: { data: wards },
    } = await ghn.get("/master-data/ward", {
      params: { district_id: district.id },
    });
    return wards.map((ward) => ({
      id: ward.WardCode,
      name: ward.WardName,
    }));
  }
  throw new Error("Cannot find district");
};

export const getShippingFeeService = async ({ wardName, districtName, weight }) => {
  const district = getDistrict(districtName);
  const ward = (await getWardService(districtName)).find((w) => w.name === wardName);

  if (ward) {
    try {
      const {
        data: { data },
      } = await ghn.post("/v2/shipping-order/fee", {
        to_ward_code: ward.id,
        to_district_id: district.id,
        service_type_id: 2,
        weight,
      });
      return data.total;
    } catch (err) {
      console.error(err.response?.data);
      throw new Error(err.response?.data?.code_message_value ?? err.response?.data?.message);
    }
  }

  throw new Error("Cannot find ward");
};

export const createGhnOrderService = async (orderId, { width, height, length, weight, traditionalDelivery = false }) => {
  const order = await getOrderByIdService(orderId);

  if (order.shipment?.orderCode) {
    throw new Error("Already shipping");
  }

  const address = [order.shippingAddress.address, order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.province, "Vietnam"].filter(Boolean).join(", ");

  const payload = {
    to_name: order.shippingAddress.fullName,
    to_phone: order.shippingAddress.phoneNumber,
    to_address: address,
    to_ward_name: order.shippingAddress.ward,
    to_district_name: order.shippingAddress.district,
    to_province_name: order.shippingAddress.province,
    service_type_id: traditionalDelivery ? 5 : 2,
    payment_type_id: 2,
    width: width || 200,
    height: height || 200,
    length: length || 200,
    weight: weight || 50_000,
    required_note: "CHOTHUHANG",
    items: order.orderItems.map((item) => ({
      name: `${item.productName} - ${item.variantName}`,
      quantity: item.quantity,
      weight: item.weight,
      height: item.height,
      length: item.length,
      width: item.width,
    })),
  };

  try {
    const {
      data: { data },
    } = await ghn.post("/v2/shipping-order/create", payload);
    await prisma.order.update({
      where: { id: order.id },
      data: {
        shipment: {
          fee: data.total_fee,
          orderCode: data.order_code,
          transportation: data.trans_type,
          expectedDeliveryTime: data.expected_delivery_time,
        },
        status: "DELIVERING",
      },
    });
    return {
      orderCode: data.order_code,
      transportation: data.trans_type,
      expectedDeliveryTime: data.expected_delivery_time,
      fee: data.total_fee,
    };
  } catch (err) {
    console.error(err.response?.data);
    throw new Error(err.response?.data?.code_message_value ?? err.response?.data?.message);
  }
};

export const getShipmentDetailsService = async (orderId, { userId }) => {
  const order = await getOrderByIdService(orderId);
  if (order.user.id !== userId) {
    throw new Error("Cannot find order");
  }
  try {
    const {
      data: { data },
    } = await ghn.post("/v2/shipping-order/detail", {
      order_code: order.shipment.orderCode,
    });
    return {
      status: data.status,
      toName: data.to_name,
      toPhoneNumber: data.to_phone,
      toAddress: data.to_address,
      toLocation: data.to_location,
      log: data.log,
    };
  } catch (err) {
    console.error(err.response?.data);
    throw new Error(err.response?.data?.code_message_value ?? err.response?.data?.message);
  }
};
