import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en_auth from "../lang/en/auth.json";
import en_booking from "../lang/en/booking.json";
import en_dashboard from "../lang/en/dashboard.json";
import en_index from "../lang/en/index.json";
import en_master from "../lang/en/master.json";
import en_modules from "../lang/en/modules.json";
import en_service from "../lang/en/service.json";
import id_auth from "../lang/id/auth.json";
import id_booking from "../lang/id/booking.json";
import id_dashboard from "../lang/id/dashboard.json";
import id_index from "../lang/id/index.json";
import id_master from "../lang/id/master.json";
import id_modules from "../lang/id/modules.json";
import id_service from "../lang/id/service.json";

if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", "id");
}

const lang = localStorage.getItem("lang") || "id";

const mergeLang = (...modules: object[]) => Object.assign({}, ...modules);

const resources = {
  en: {
    translation: mergeLang(
      en_index,
      en_auth,
      en_dashboard,
      en_booking,
      en_service,
      en_master,
      en_modules,
    ),
  },
  id: {
    translation: mergeLang(
      id_index,
      id_auth,
      id_dashboard,
      id_booking,
      id_service,
      id_master,
      id_modules,
    ),
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: "id",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
