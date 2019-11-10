import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";

const ProjectList = props => {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/projects`)
      .then(res => setProjects(res.data.projects))
      .catch(err => console.error({ error: err }));
  }, [setProjects]);

  return (
    <div className="pcard-container">
      {projects &&
        projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            history={props.history}
          />
        ))}
    </div>
  );
};

export default ProjectList;
