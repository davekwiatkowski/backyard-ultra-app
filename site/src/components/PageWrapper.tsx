'use client';

import React, { FC } from 'react';
import { ThemeController } from './ThemeController';
import Link from 'next/link';
import { ResultsContextProvider } from '../context/ResultsContext';
import { ThemeContextProvider } from '../context/ThemeContext';
import { IMetadata } from '../types/IMetadata';

export const PageWrapper: FC<{
  children: React.JSX.Element | React.JSX.Element[];
  metadata: IMetadata;
}> = ({ children, metadata }) => {
  return (
    <ThemeContextProvider>
      <ResultsContextProvider>
        <div className="navbar bg-base-100 sticky z-10 border-b top-0 left-0">
          <div className="flex-1">
            <Link className="btn btn-ghost text-xl" href="/">
              backyardultra.app
            </Link>
            <p className="text-xs" suppressHydrationWarning>
              Updated on {new Date(metadata.lastUpdate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-none">
            <ThemeController />
          </div>
        </div>
        <main>{children}</main>
        <footer className="footer p-4 bg-base-100 footer-center text-base-content">
          <aside>
            <p className="italic text-xs">
              Disclaimer: This is a passion project, and not all of the data is guaranteed to be
              correct.
            </p>
            <p className="font-mono text-xs">Version {metadata.version}</p>
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
