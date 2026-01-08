import Select, { components } from "react-select";

interface Props {
  value: any;
  onChange: (val: any) => void;
  items: {
    label: string;
    value: any;
    description?: string;
  }[];
  placeholder?: string;
  titleEmpty?: string;
  className?: string;
  isClearable?: boolean;
  isMulti?: boolean;
}

export default function Combobox({
  value,
  onChange,
  items,
  placeholder = "Pilih...",
  titleEmpty = "Data tidak ditemukan",
  className,
  isClearable = true,
  isMulti = false,
}: Props) {
  const primaryColor = "#168BAB";

  console.log("value", value);
  // Mencari objek item berdasarkan value yang dikirim dari props
  const selectedOption = isMulti
    ? items.filter((item) => (value as any[])?.includes(item.value))
    : items.find((item) => item.value === value) || null;

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? primaryColor : "#cbd5e1",
      boxShadow: state.isFocused ? `0 0 0 1px ${primaryColor}` : "none",
      "&:hover": {
        borderColor: primaryColor,
      },
      borderRadius: "5px",
      fontSize: "13.5px", // text-sm
      minHeight: "36px", // Setinggi button shadcn standar
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? primaryColor
        : state.isFocused
          ? `${primaryColor}15`
          : "white",
      color: state.isSelected ? "white" : "#1e293b",
      cursor: "pointer",
      "&:active": {
        backgroundColor: `${primaryColor}15`,
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#94a3b8",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "calc(var(--radius) - 2px)",
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    }),
  };

  const CustomMenuList = (props: any) => {
    return (
      <components.MenuList
        {...props}
        className="scrollbar-modern scroll-smooth"
      >
        {props.children}
      </components.MenuList>
    );
  };

  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex flex-col px-3 py-2 cursor-pointer transition-colors hover:bg-[#168BAB]/10  ${props.isSelected ? "bg-[#168BAB] text-white" : "text-slate-800"}`}
      >
        <p className="text-sm font-medium">{data.label}</p>
        {data.description && (
          <span
            className={`text-xs italic ${props.isSelected ? "text-blue-100" : "text-gray-500"}`}
          >
            {data.description}
          </span>
        )}
      </div>
    );
  };

  return (
    <Select
      className={className}
      components={{
        MenuList: CustomMenuList, // Terapkan scrollbar-modern di sini
        IndicatorSeparator: () => null, // Opsional: hapus garis pemisah icon panah agar lebih clean
        Option: CustomOption,
      }}
      isClearable={isClearable}
      isMulti={isMulti}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      noOptionsMessage={() => titleEmpty}
      options={items}
      placeholder={placeholder}
      styles={{
        ...customStyles,
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      value={selectedOption} // Menggunakan objek hasil find
      onChange={(newValue: any) => {
        if (isMulti) {
          onChange(
            newValue?.length > 0 ? newValue.map((e: any) => e.value) : [],
          );
        } else {
          console.log(newValue);
          onChange(newValue ? newValue.value : null);
        }
      }}
    />
  );
}
