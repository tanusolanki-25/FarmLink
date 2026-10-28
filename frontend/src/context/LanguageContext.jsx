import { createContext, useContext, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en"); // "en" | "hi"

  const toggle = () => setLang((l) => (l === "en" ? "hi" : "en"));

  // t("navbar.login") → "Login" or "लॉग इन"
  const t = (key) => {
    const parts = key.split(".");
    let node = translations;
    for (const p of parts) {
      if (node === undefined) return key;
      node = node[p];
    }
    if (node && typeof node === "object" && (node.en || node.hi)) {
      return node[lang] ?? node.en ?? key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
