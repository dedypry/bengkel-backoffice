import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { key: "id", labelKey: "common.indonesian", flag: "ID" },
  { key: "en", labelKey: "common.english", flag: "EN" },
];

export default function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "id";

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          aria-label={t("common.language")}
          variant="ghost"
        >
          <span className="relative">
            <Languages size={18} />
            <span className="absolute -bottom-3 -right-2 text-[9px] font-bold uppercase text-primary">
              {current}
            </span>
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("common.language")}
        selectedKeys={[current]}
        selectionMode="single"
        onAction={(key) => changeLanguage(String(key))}
      >
        {LANGUAGES.map((lang) => (
          <DropdownItem
            key={lang.key}
            endContent={
              current === lang.key ? (
                <Check className="text-primary" size={16} />
              ) : null
            }
            startContent={
              <span className="text-xs font-bold text-gray-500">
                {lang.flag}
              </span>
            }
          >
            {t(lang.labelKey)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
