'use client';

import { FC, useEffect, useState } from "react";
import { Theme, ThemeType } from "../constants/ThemeConstants";
import { StorageKeyConstants } from "../constants/StorageKeyConstants";
import { ThemeController } from "./ThemeController";
import { AppContext } from "../context/AppContext";
import Link from "next/link";
import metadata from '../data/metadata.json';

export const PageWrapper: FC<{ children: JSX.Element | JSX.Element[], version: string }> = ({ children, version }) => {
    const [theme, setTheme] = useState<ThemeType>(JSON.parse(global.localStorage?.getItem(StorageKeyConstants.IS_DARK_THEME) ?? 'false') ? Theme.DARK : Theme.LIGHT);

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);

    return <AppContext.Provider value={{ theme, setTheme }}>
        <div className="navbar bg-base-100 sticky z-10 border-b top-0 left-0">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/">backyardultra.app</Link>
            </div>
            <div className="flex-none">
                <ThemeController />
            </div>
        </div>
        <main>
            {children}
        </main>
        <footer className="footer p-4 bg-base-100 footer-center text-base-content">
            <aside>
                <p className="text-xs font-mono">Last updated on: {new Date(metadata.lastUpdate.epoch).toLocaleDateString()}</p>
                <p className="font-mono text-xs">Version {version}</p>
                <p className="text-xs">
                    © 2024{' - '}
                    <a className="btn-link" href="https://davekwiatkowski.com">Dave Kwiatkowski</a>
                </p>
            </aside>
        </footer>
    </AppContext.Provider>
};