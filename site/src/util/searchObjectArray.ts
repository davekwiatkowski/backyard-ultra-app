export function searchObjectArray<T extends object>(array: T[], str: string, searchKeyValuePairs?: { key: keyof T, value: string }[]): T[] {
    if (searchKeyValuePairs && searchKeyValuePairs.length) {
        return array
            .filter(item => {
                return searchKeyValuePairs.every(kvp => {
                    const value = item[kvp.key];
                    return `${value}`.toLowerCase().includes(kvp.value.toLowerCase());
                });
            })
    }

    if (!str) {
        return array;
    }
    const search = str.toLowerCase();
    return array.filter(item =>
        Object.values(item).some((value) => {
            return `${value}`.toLowerCase().includes(search);
        })
    );
}