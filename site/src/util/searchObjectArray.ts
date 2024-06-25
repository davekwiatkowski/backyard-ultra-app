export function searchObjectArray<T extends object, K extends keyof T>(
  array: T[],
  str: string,
  searchFilters: Partial<{ [key in K]: string[] }>,
): T[] {
  array = array.filter((item) => {
    return Object.entries(searchFilters).every(([key, values]) => {
      const value = item[key as keyof T];
      return (values as string[]).some((v) => {
        return `${value}`.toLowerCase().includes(v.toLowerCase());
      });
    });
  });

  if (!str) {
    return array;
  }
  const search = str.toLowerCase();
  return array.filter((item) =>
    Object.values(item).some((value) => {
      return `${value}`.toLowerCase().includes(search);
    }),
  );
}
