import polyglotI18nProvider from "ra-i18n-polyglot";
import chineseMessages from "./cn";
import englishMessages from "./en";

export default polyglotI18nProvider(
    locale => {
        if (locale === 'cn') {
            return chineseMessages;
        }
        // Always fallback on english
        return englishMessages;
    },
    'cn',
    [
        { locale: 'en', name: 'English' },
        { locale: 'cn', name: '中文' },
    ]
);