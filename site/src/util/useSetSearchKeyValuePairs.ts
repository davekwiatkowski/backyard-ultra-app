import { useMemo } from "react";

const searchForKvp = <T>(data: object[], text: string) => {
    const match = text.trim().replace(/\s\s+/g, ' ').match(/^([a-zA-Z]+):(.*)$/);
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
}

export const useSetSearchKeyValuePairs = <T>(searchText: string, data: object[]) => {
    return useMemo(() => {
        const results: { key: keyof T, value: string }[] = [];

        if (!searchText) {
            return results;
        }

        const pieces = searchText.split(',');
        for (let piece of pieces) {
            const kvp = searchForKvp(data, piece);
            if (kvp) {
                results.push(kvp);
            }
        }
        return results;
    }, [data, searchText]);
}