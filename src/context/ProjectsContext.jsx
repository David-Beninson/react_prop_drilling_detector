// קובץ: src/context/ProjectsContext.js
import { createContext, useContext, useState } from "react";
import {
    loadSavedProjects,
    saveProjectToStorage,
    deleteProjectFromStorage
} from "../utils/localStorageUtils";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState(() => loadSavedProjects());

    const saveProject = (key, data) => {
        setProjects(prev => saveProjectToStorage(key, data, prev));
    };

    const deleteProject = (key) => {
        setProjects(prev => deleteProjectFromStorage(key, prev));
    };

    return (
        <ProjectsContext.Provider value={{ projects, saveProject, deleteProject }}>
            {children}
        </ProjectsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjects() {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }
    return context;
}
