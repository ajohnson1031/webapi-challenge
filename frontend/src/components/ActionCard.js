import React from "react";
import { Card, CardMeta } from "semantic-ui-react";

const ActionCard = ({ action }) => {
  return (
    <Card className="action-card">
      <h4>{action.description}</h4>
      <p>{action.notes}</p>
      <p className={action.completed === true ? "complete" : "incomplete"}>
        {action.completed === false ? "Not Completed" : "Completed"}
      </p>
      <CardMeta>ACTION: {action.id}</CardMeta>
    </Card>
  );
};

export default ActionCard;
