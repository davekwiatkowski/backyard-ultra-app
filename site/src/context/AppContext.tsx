import { createContext } from "react";
import { Theme, ThemeType } from "../constants/ThemeConstants";

interface IAppContext {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const defaultAppContext: IAppContext = {
    theme: Theme.LIGHT,
    setTheme: () => { }
};

export const AppContext = createContext<IAppContext>(defaultAppContext);
