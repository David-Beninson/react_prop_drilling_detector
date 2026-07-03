import { useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useTreeDiagram } from "../../context/TreeContext";
import { useProjects } from "../../context/ProjectsContext";
import { getLocalStorageItem } from '../../utils/localStorageUtils';
import Input from "../../components/ui/Input/Input";
import "./Dashboard.css";
import ProjectGraph from "../../components/ProjectGraph";

export default function Dashboard() {
    const { treeDiagram, setTreeDiagram } = useTreeDiagram();
    const { projectName } = useParams();
    const { projects } = useProjects();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (projectName) {
            const savedTree = getLocalStorageItem(projectName);
            if (savedTree) {
                setTreeDiagram(savedTree);
            } else {
                setTreeDiagram(null);
            }
        } else {
            setTreeDiagram(null);
        }
    }, [projectName, setTreeDiagram]);

    if (!treeDiagram) {
        const savedTree = projectName ? getLocalStorageItem(projectName) : null;
        if (savedTree) {
            return <div className="loadingContainer">Loading project...</div>;
        };
        return (
            <div>
                <h2>No project loaded</h2>
                {projects.length > 0 && (
                    <div className="savedProjectsContainer">
                        <p className="savedProjectsLabel">
                            Or load a saved project:
                        </p>
                        <div className="savedProjectsList">
                            {projects.map(name => (
                                <Link
                                    key={name}
                                    to={`/dashboard/${name}`}
                                    className="btn savedProjectLink"
                                >
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <p className="noProjectText">
                    Please upload and submit a project first.
                </p>
                <Link to="/newProject" className="btn createProjectLink">
                    Create Project
                </Link>
            </div>
        );
    }

    const formattedProjectName = !projectName ? '' :
        projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase();


    return (
        <div className="analysisPage">
            <div className="analysisHeader">
                <h1>Project Architecture {formattedProjectName}</h1>
                <div className="searchWrapper">
                    <Input
                        type="text"
                        name="search"
                        placeholder="Search component..."
                        value={searchParams.get("search") || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setSearchParams({ search: val });
                            } else {
                                setSearchParams({})
                            }
                        }}
                        className="searchBarInput"
                    />
                </div>
            </div>
            <ProjectGraph key={projectName} treeDiagram={treeDiagram} />
        </div>
    );
}


