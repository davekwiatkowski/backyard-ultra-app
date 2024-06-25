'use client';

import React, { FC } from 'react';
import { ThemeController } from './ThemeController';
import Link from 'next/link';
import metadata from '../data/metadata.json';
import { ResultsContextProvider } from '../context/ResultsContext';
import { ThemeContextProvider } from '../context/ThemeContext';

export const PageWrapper: FC<{
  children: React.JSX.Element | React.JSX.Element[];
  version: string;
}> = ({ children, version }) => {
  return (
    <ThemeContextProvider>
      <ResultsContextProvider>
        <div className="navbar bg-base-100 sticky z-10 border-b top-0 left-0">
          <div className="flex-1">
            <Link className="btn btn-ghost text-xl" href="/">
              backyardultra.app
            </Link>
            <p className="text-xs">
              Last update: {new Date(metadata.lastUpdate.epoch).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-none">
            <ThemeController />
          </div>
        </div>
        <main>{children}</main>
        <footer className="footer p-4 bg-base-100 footer-center text-base-content">
          <aside>
            <p className="font-mono text-xs">Version {version}</p>
            <p className="text-xs">
              © 2024{' - '}
              <a className="link" href="https://davekwiatkowski.com">
                Dave Kwiatkowski
              </a>
            </p>
          </aside>
        </footer>
      </ResultsContextProvider>
    </ThemeContextProvider>
  );
};
