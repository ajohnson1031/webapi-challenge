import React from "react";
import { Card, CardMeta } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ProjectCard = ({ project, history }) => {
  const handleClick = e => {
    e.preventDefault();
    history.push(`/actions/${project.id}`);
  };

  return (
    <Card id={`project_${project.id}`}>
      <h4 className="project-name">{project.name}</h4>
      <p>{project.description}</p>
      <p className={project.completed === true ? "complete" : "incomplete"}>
        {project.completed === false ? "Not Completed" : "Completed"}
      </p>
      <CardMeta>PROJECT ID {project.id}</CardMeta>
      <Card.Content>
        <button className="actions-button" onClick={handleClick}>
          Actions
        </button>
      </Card.Content>
    </Card>
  );
};

export default ProjectCard;
