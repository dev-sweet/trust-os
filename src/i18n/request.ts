import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("MY_LOCALE")?.value || "en";

  return {
    locale, // This is what getLocale() in the layout reads!
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
