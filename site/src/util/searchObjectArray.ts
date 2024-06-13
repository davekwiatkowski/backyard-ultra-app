export function searchObjectArray<T extends object>(array: T[], str: string) {
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