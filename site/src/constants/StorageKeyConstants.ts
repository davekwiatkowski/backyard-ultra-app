const createKey = (name: string) => {
  return `backyardultra.app:${name}`;
};

export const StorageKeyConstants = {
  IS_DARK_THEME: createKey('IS_DARK_THEME'),
  PAGE: createKey('PAGE'),
  SEARCH: createKey('SEARCH'),
  FILTERS: createKey('FILTERS'),
  SORTS: createKey('SORTS'),
  DISTANCE_TYPE: createKey('DISTANCE_TYPE'),
} as const;
