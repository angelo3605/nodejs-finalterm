import { useCombobox } from "downshift";
import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useWatch } from "react-hook-form";
import { FaArrowTurnUp, FaCaretDown } from "react-icons/fa6";
import { formatAddress } from "@/utils/formatAddress";

function normalizeVietnamese(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function AddressForm({ form, className, hideSetDefault = false }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [districtItems, setDistrictItems] = useState([]);
  const [wardItems, setWardItems] = useState([]);

  const { address, province, district, ward } = useWatch({ control: form.control });
  const isAddressComplete = Boolean(address && province && district);

  const { data: provinces, isPending: isProvincePending } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => api.get("/data/provinces.json").then((res) => res.data?.filter(({ name }) => !/\d/.test(name) && !name.toLowerCase().includes("test")) ?? []),
  });

  const { data: wards, isPending: isWardPending } = useQuery({
    queryKey: ["shipment", "wards", district],
    queryFn: () => api.get("/shipment/ward", { params: { district } }).then((res) => res.data?.data ?? []),
    enabled: !!district,
  });

  const provinceCombo = useCombobox({
    items: provinceItems,
    itemToString: (item) => item?.name ?? "",
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        form.setValue("province", selectedItem.name);
        setDistrictItems(selectedItem.districts);
        form.setValue("district", "");
        if (wards?.length) {
          form.setValue("ward", "");
        }
      }
    },
    onInputValueChange: ({ inputValue }) => {
      const filteredProvinces = provinces?.filter((province) => {
        const normName = normalizeVietnamese(province.name);
        const normInput = normalizeVietnamese(inputValue || "");
        return normName.includes(normInput);
      });
      if (filteredProvinces) {
        setProvinceItems(filteredProvinces);
      }
    },
  });

  const districtCombo = useCombobox({
    items: districtItems,
    itemToString: (item) => item?.name ?? "",
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        form.setValue("district", selectedItem.name);
        if (wards?.length) {
          form.setValue("ward", "");
        }
      }
    },
    onInputValueChange: ({ inputValue }) => {
      const selectedProvince = provinces?.find((p) => p.name === province);
      const filteredDistricts = selectedProvince?.districts.filter((district) => {
        const normName = normalizeVietnamese(district.name);
        const normInput = normalizeVietnamese(inputValue || "");
        return normName.includes(normInput);
      });
      if (filteredDistricts) {
        setDistrictItems(filteredDistricts);
      }
    },
  });

  const wardCombo = useCombobox({
    items: wardItems,
    itemToString: (item) => item?.name ?? "",
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        form.setValue("ward", selectedItem.name);
      }
    },
    onInputValueChange: ({ inputValue }) => {
      const filteredWards = wards?.filter((ward) => {
        const normName = normalizeVietnamese(ward.name);
        const normInput = normalizeVietnamese(inputValue || "");
        return normName.includes(normInput);
      });
      if (filteredWards) {
        setWardItems(filteredWards);
      }
    },
  });

  useEffect(() => {
    if (provinces?.length) {
      setProvinceItems(provinces);
    }
    if (wards?.length) {
      setWardItems(wards);
    }

    const newProvince = provinces?.find((p) => p.name === province);
    const newDistrict = newProvince?.districts.find((d) => d.name === district);
    const newWard = wards?.find((w) => w.name === ward);

    provinceCombo.selectItem(newProvince);
    provinceCombo.inputValue = newProvince?.name || "";

    districtCombo.selectItem(newDistrict);
    districtCombo.inputValue = newDistrict?.name || "";

    wardCombo.selectItem(newWard);
    wardCombo.inputValue = newWard?.name || "";
  }, [province, district, ward, provinces, wards]);

  const {
    formState: { errors },
  } = form;

  return (
    <div className="space-y-2">
      {hideSetDefault || (
        <label className="toggle mb-4">
          <input {...form.register("isDefault")} type="checkbox" className="toggle__input" />
          <div className="toggle__icon"></div>
          <span className="toggle__label">Set as default</span>
        </label>
      )}
      <div className={clsx("grid gap-2", className)}>
        <div className="space-y-2">
          <label className="floating-label">
            <input
              {...form.register("fullName", {
                required: true,
              })}
              placeholder=""
              className="floating-label__input"
            />
            <span className="floating-label__label dark:bg-gray-800!">Full name</span>
          </label>
          {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="floating-label">
            <input
              {...form.register("phoneNumber", {
                required: true,
              })}
              placeholder=""
              className="floating-label__input"
            />
            <span className="floating-label__label dark:bg-gray-800!">Phone number</span>
          </label>
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div className="relative">
          <label className="floating-label">
            <input
              disabled={isProvincePending}
              placeholder=""
              className="floating-label__input"
              {...provinceCombo.getInputProps({
                required: true,
              })}
            />
            <span className="floating-label__label">Province</span>
            <FaCaretDown className="floating-label__icon floating-label__icon--right floating-label__icon--combobox" />
          </label>
          <ul className="popover menu absolute top-full left-0 w-full max-h-[300px] overflow-auto" {...provinceCombo.getMenuProps()}>
            {provinceItems.length ? (
              provinceItems.map((item, index) => (
                <li key={index} className="menu-item h-auto! py-2" {...provinceCombo.getItemProps({ item, index })}>
                  {item.name}
                </li>
              ))
            ) : (
              <li className="opacity-75 py-10 text-center">Cannot find province</li>
            )}
          </ul>
        </div>
        <div className="relative">
          <label className="floating-label">
            <input
              placeholder=""
              className="floating-label__input"
              {...districtCombo.getInputProps({
                required: true,
              })}
              disabled={isProvincePending || !provinceCombo.selectedItem}
            />
            <span className="floating-label__label">District</span>
            <FaCaretDown className="floating-label__icon floating-label__icon--right floating-label__icon--combobox" />
          </label>
          <ul className="popover menu absolute top-full left-0 w-full max-h-[300px] overflow-auto" {...districtCombo.getMenuProps()}>
            {districtItems.length ? (
              districtItems.map((item, index) => (
                <li key={index} className="menu-item h-auto! py-2" {...districtCombo.getItemProps({ item, index })}>
                  {item.name}
                </li>
              ))
            ) : (
              <li className="opacity-75 py-10 text-center">Cannot find district</li>
            )}
          </ul>
        </div>
        <div className="relative">
          <label className="floating-label">
            <input placeholder="" className="floating-label__input" {...wardCombo.getInputProps()} disabled={isWardPending || !districtCombo.selectedItem} />
            <span className="floating-label__label">Ward</span>
            <FaCaretDown className="floating-label__icon floating-label__icon--right floating-label__icon--combobox" />
          </label>
          <ul className="popover menu absolute top-full left-0 w-full max-h-[300px] overflow-auto" {...wardCombo.getMenuProps()}>
            {wardItems.length ? (
              wardItems.map((item, index) => (
                <li key={index} className="menu-item h-auto! py-2" {...wardCombo.getItemProps({ item, index })}>
                  {item.name}
                </li>
              ))
            ) : (
              <li className="opacity-75 py-10 text-center">Cannot find ward</li>
            )}
          </ul>
        </div>
        <div className="space-y-2">
          <label className="floating-label">
            <input {...form.register("address")} placeholder="" className="floating-label__input" />
            <span className="floating-label__label">Address</span>
          </label>
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>
      </div>
      <p className={clsx("flex gap-2", isAddressComplete || "text-rose-700 dark:text-rose-300")}>
        <FaArrowTurnUp className="rotate-90 text-gray-400 dark:text-gray-600 mt-1" />
        {isAddressComplete ? formatAddress({ address, district, province, ward }) : "Please fill out the address"}
      </p>
    </div>
  );
}
