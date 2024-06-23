export function searchObjectArray<T extends object>(array: T[], str: string, searchKeyValuePair?: { key: keyof T, value: string }): T[] {
    if (searchKeyValuePair) {
        return array
            .filter(item => {
                const value = item[searchKeyValuePair.key];
                return `${value}`.toLowerCase().includes(searchKeyValuePair.value.toLowerCase());
            })
    }

    if (!str) {
        return array;
    }
    const search = str.toLowerCase();
    return array.filter(item =>
        Object.values(item).some((value) => {
            return `${value}`.toLowerCase().includes(search)
        })
    );
}