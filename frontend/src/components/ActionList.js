import React, { useEffect, useState } from "react";
import ActionCard from "./ActionCard";
import axios from "axios";

const ActionList = props => {
  const { id } = props.match.params;
  const [actions, setActions] = useState([""]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/project-actions/${id}`)
      .then(res => setActions(res.data.actions))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="aCard-container">
      {actions.length === 0 && (
        <div className="no-actions">
          <h3>There are no actions associated with this project.</h3>
        </div>
      )}
      {actions &&
        actions.map(action => (
          <ActionCard action={action} key={action.id * 2} />
        ))}
    </div>
  );
};

export default ActionList;
