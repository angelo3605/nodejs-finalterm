import fs from "fs";
import path from "path";
import { ghn } from "../utils/ghn.js";

const SNAPSHOT_FILE_PATH = "public/data/provinces.json";

const raw = fs.readFileSync(path.resolve(SNAPSHOT_FILE_PATH));
const provinces = JSON.parse(raw);

export const getWardService = async (districtName) => {
  for (const province of provinces) {
    const district = province.districts.find((d) => d.name === districtName);
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
  }
  throw new Error("Cannot find district");
};
