import fs from "fs";
import path from "path";
import axios from "axios";

export const ghn = axios.create({
  baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api",
  headers: {
    ShopId: process.env.GHN_SHOP_ID,
    Token: process.env.GHN_TOKEN,
  },
});

export async function saveProvincesAndDistrictsSnapshot(filePath = "public/data/provinces.json", maxAge = 1000 * 60 * 60 * 24 * 30) {
  const filePathRes = path.resolve(filePath);
  const fileDir = path.dirname(filePathRes);

  fs.mkdirSync(fileDir, { recursive: true });

  if (fs.existsSync(filePathRes)) {
    const stats = fs.statSync(filePathRes);
    const age = Date.now() - stats.mtimeMs;

    if (age < maxAge) {
      console.log("Province snapshot is still recent, skipping!");
      return;
    }
  }

  console.log("Getting latest province data...");

  const {
    data: { data: provinces },
  } = await ghn.get("/master-data/province");
  const {
    data: { data: districts },
  } = await ghn.get("/master-data/district");

  const snapshot = provinces.map((province) => ({
    id: province.ProvinceID,
    name: province.ProvinceName,
    districts: districts.reduce((acc, district) => {
      if (district.ProvinceID === province.ProvinceID) {
        acc = acc.concat({
          id: district.DistrictID,
          name: district.DistrictName,
        });
      }
      return acc;
    }, []),
  }));

  fs.writeFileSync(filePathRes, JSON.stringify(snapshot, null, 2));
  console.log("Saved province snapshot!");
}
