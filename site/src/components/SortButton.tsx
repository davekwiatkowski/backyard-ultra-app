'use client';

import { FC } from 'react';
import { SortAscIcon, SortDescIcon, SortNoneIcon } from './icons/SortIcons';
import { SortDirection } from '../types/SortDirection';

export const TableSortButton: FC<{
  onSort: () => void;
  title: string;
  dir: SortDirection;
}> = ({ onSort, title, dir }) => {
  return (
    <button className="btn btn-ghost btn-xs flex-nowrap" onClick={onSort}>
      {title}
      {dir === undefined && <SortNoneIcon />}
      {dir === 'desc' && <SortDescIcon />}
      {dir === 'asc' && <SortAscIcon />}
    </button>
  );
};
