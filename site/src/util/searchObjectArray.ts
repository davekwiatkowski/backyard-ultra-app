export function searchObjectArray<T extends object, K extends keyof T>(
  data: T[],
  searchText: string,
  filters: Partial<{ [key in K]: string[] }>,
): T[] {
  data = data.filter((item) => {
    return Object.entries(filters).every(([filterKey, filterValues]) => {
      const value = item[filterKey as keyof T];
      return (filterValues as string[]).some((filterValue) => {
        const filterValueCleaned = `${filterValue}`.toLowerCase();
        if (Array.isArray(value)) {
          return value.map((v) => `${v}`.toLowerCase()).includes(filterValueCleaned);
        }
        return `${value}`.toLowerCase() === filterValueCleaned;
      });
    });
  });

  searchText = searchText.replace(/\s+/g, ' ').trim();

  if (!searchText) {
    return data;
  }
  const search = searchText.toLowerCase();
  return data.filter((item) =>
    Object.values(item).some((value) => {
      return `${value}`.toLowerCase().includes(search);
    }),
  );
}
