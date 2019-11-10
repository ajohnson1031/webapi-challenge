/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const pDB = require("./data/helpers/projectModel");
const aDB = require("./data/helpers/actionModel");
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`===== Listening on port ${port} =====`);
});

server.use(express.json());
server.use(cors());

const logger = (req, res, next) => {
  console.log(
    `${req.method.toUpperCase()} REQUEST at ${new Date().toISOString()} from ${
      req.url
    }`
  );

  next();
};

// START MIDDLEWARE //

const validateID = (req, res, next) => {
  const { id } = req.params;
  const type = req.url.includes("projects") ? "project" : "action";
  let helperCall;

  type === "project"
    ? (helperCall = pDB)
    : type === "action"
    ? (helperCall = aDB)
    : null;

  if (req.method === "POST" && type === "action") {
    pDB
      .get(id)
      .then(result =>
        !result
          ? res.status(400).json({
              error: "There is no post associated with the supplied ID."
            })
          : next()
      )
      .catch(err =>
        res.status(500).json({
          error: "There was an error finding this post. Please try again."
        })
      );
  }

  helperCall.get(id).then(result => {
    !result
      ? res.status(400).json({
          error: `There is no ${type} associated with the supplied ID.`
        })
      : (req.identifier = id);
    next();
  });
};

const validateProject = (req, res, next) => {
  const newProj = req.body;
  !newProj.name || !newProj.description
    ? res
        .status(400)
        .json({ error: "Project must have a name and description." })
    : next();
};

const validateAction = (req, res, next) => {
  const newAction = req.body;

  !newAction.description || !newAction.notes
    ? res
        .status(400)
        .json({ error: "Action must have a description and notes." })
    : next();
};

// END MIDDLEWARE //

// START PROJECT ENDPOINTS //

server.get("/projects", logger, (req, res) => {
  pDB
    .get()
    .then(projects => res.status(200).json({ projects: projects }))
    .catch(err =>
      res
        .status(400)
        .json({ error: "Sorry, cannot retrieve projects at this time." })
    );
});

server.get("/projects/:id", logger, validateID, (req, res) => {
  pDB
    .get(req.identifier)
    .then(project => res.status(200).json({ project: project }))
    .catch(err =>
      res.status(500).json({
        error: `There was a problem getting this project. Please try again.`
      })
    );
});

server.get("/project-actions/:id", logger, validateID, (req, res) => {
  pDB
    .getProjectActions(req.identifier)
    .then(actions => res.status(200).json({ actions: actions }))
    .catch(err =>
      res.status(500).json({
        error:
          "Could not retrieve actions associated with the project. Please try again."
      })
    );
});

server.post("/projects", logger, validateProject, (req, res) => {
  pDB
    .insert({
      name: req.body.name,
      description: req.body.description,
      completed: false
    })
    .then(project => res.status(201).json({ project: project }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Could not create new project. Please try again." })
    );
});

server.put("/projects/:id", logger, validateID, (req, res) => {
  pDB
    .update(req.identifier, req.body)
    .then(project => res.status(200).json({ project: project }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Could not update the project. Please try again." })
    );
});

server.delete("/projects/:id", logger, validateID, (req, res) => {
  pDB
    .remove(req.identifier)
    .then(project => res.status(204).end())
    .catch(err =>
      res.status(500).json({
        error: "Could not delete the requested project. Please try again."
      })
    );
});

// END PROJECT ENDPOINTS //

// START ACTION ENDPOINTS //

server.get("/actions", logger, (req, res) => {
  aDB
    .get()
    .then(actions => res.status(200).json({ actions: actions }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Sorry, cannot retrieve actions at this time." })
    );
});

server.get("/actions/:id", logger, validateID, (req, res) => {
  aDB
    .get(req.identifier)
    .then(action => res.status(200).json({ action: action }))
    .catch(err =>
      res.status(500).json({
        error: `There was a problem getting this action. Please try again.`
      })
    );
});

server.post("/actions/:id", logger, validateID, validateAction, (req, res) => {
  aDB
    .insert({
      project_id: req.identifier,
      description: req.body.description,
      notes: req.body.notes,
      completed: false
    })
    .then(action => res.status(201).json({ action: action }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Could not create new action. Please try again." })
    );
});

server.put("/actions/:id", logger, validateID, (req, res) => {
  aDB
    .update(req.identifier, req.body)
    .then(action => res.status(200).json({ action: action }))
    .catch(err =>
      res
        .status(500)
        .json({ err: "Could not update action. Please try again." })
    );
});

server.delete("/actions/:id", logger, validateID, (req, res) => {
  aDB
    .remove(req.identifier)
    .then(action => res.status(204).end())
    .catch(err =>
      res.status(500).json({
        error: "Could not delete the requested action. Please try again."
      })
    );
});

// END ACTION ENDPOINTS //
