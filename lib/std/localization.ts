import {useRouter} from "next/router";

export interface LocalizationPartial {
    [lang: string]: LocalizationStrings
}

interface LocalizationStrings {
    [key: string]: string
}

export function getString(base: string, ...args: string[]): string {
    let result = "";
    let index = 0, indexHidden = false;
    for (let i = 0; i < base.length; i++) {
        const [n, c] = [base.charAt(i + 1), base.charAt(i)];
        const directAppend = () => {
            if (i === base.length - 1) {
                result += c + n;
            } else {
                result += c;
            }
        }
        if (c === '$') {
            if (n.match(/[0-9]/)) {
                index = parseInt(n);
                indexHidden = true;
            } else if (n !== 's') {
                directAppend();
                continue;
            }
            result += args[index];
            i ++;
            if (!indexHidden) {
                index++;
            }
        } else {
            directAppend();
        }
    }

    return result;
}

export const defaultLocale = "zh-CN";

export function getI18n(partial: LocalizationPartial): LocalizationStrings {
    const {locale} = useRouter();
    return partial[locale ?? defaultLocale];
}