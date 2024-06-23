import { useMemo } from "react";

export function useSetSearchKeyValuePair<T>(searchText: string, data: object[]) {
    return useMemo<{ key: keyof T, value: string } | undefined>(() => {
        if (!searchText) {
            return undefined;
        }

        const match = searchText.trim().replace(/\s\s+/g, ' ').match(/^([a-zA-Z]+):(.*)$/);
        if (!match) {
            return undefined;
        }

        const key = match[1].trim();
        if (!key) {
            return undefined;
        }

        if (key in data[0]) {
            const value = match[2].trim();
            return { key: (key as keyof T), value };
        }

        return undefined;
    }, [data, searchText]);
}