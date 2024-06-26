export function searchObjectArray<T extends object, K extends keyof T>(
  data: T[],
  searchText: string,
  filters: Partial<{ [key in K]: string[] }>,
): T[] {
  data = data.filter((item) => {
    return Object.entries(filters).every(([key, values]) => {
      const value = item[key as keyof T];
      return (values as string[]).some((v) => {
        return `${value}`.toLowerCase().includes(v.toLowerCase());
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
