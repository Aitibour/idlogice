import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "fr" | "es" | "ar")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../../locales/${locale}/common.json`)).default,
      ...(await import(`../../locales/${locale}/home.json`)).default,
      ...(await import(`../../locales/${locale}/about.json`)).default,
      ...(await import(`../../locales/${locale}/contact.json`)).default,
      ...(await import(`../../locales/${locale}/services.json`)).default,
      ...(await import(`../../locales/${locale}/blog.json`)).default,
      ...(await import(`../../locales/${locale}/draws.json`)).default,
    },
  };
});
