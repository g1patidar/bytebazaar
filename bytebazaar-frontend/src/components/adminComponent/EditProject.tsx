import { useParams } from "react-router-dom";
import { AddProjectForm } from "./AddNewProject";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllProjects } from "@/store/slices/projectSlice";

export function EditProject() {
    const { projectId: id } = useParams();
    const [projectId, setProjectId] = useState(id);
    const [isOpen, setIsOpen] = useState(true);
    // Get the list of all projects
    const allProjects = useSelector(selectAllProjects);

    // Find the project by ID from the array
    let project = undefined;
    project = allProjects.find((p) => p._id === id);

    if (!project) {
        return <div>Loading project...</div>;
    }

    // Use projectId to fetch or edit the project
    return (isOpen && <AddProjectForm projectData={project} projectId={projectId} setProjectId={setProjectId} setIsOpen={setIsOpen} isEdit />);
}