import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en_index from "../lang/en/index.json";
import id_index from "../lang/id/index.json";

if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", "id");
}

const lang = localStorage.getItem("lang") || "id";

const resources = {
  en: {
    translation: {
      ...en_index,
    },
  },
  id: {
    translation: {
      ...id_index,
    },
  },
};

console.log("LANG", lang);
i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
