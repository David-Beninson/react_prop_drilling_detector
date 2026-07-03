import { createContext, useContext, useReducer } from "react";
import { propsReducer, initialPropsState } from "../utils/propsReducer";

const PropsContext = createContext(null);

export function PropsProvider({ children }) {
    const [state, dispatch] = useReducer(propsReducer, initialPropsState);

    return (
        <PropsContext.Provider value={{ state, dispatch }}>
            {children}
        </PropsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePropsState() {
    const context = useContext(PropsContext);
    if (!context) {
        throw new Error("usePropsState must be used within a PropsProvider");
    }
    return context;
}
