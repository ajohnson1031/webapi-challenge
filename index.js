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

const express = require("express");
const cors = require("cors");
const server = express();
const pDB = require("./data/helpers/projectModel");
const aDB = require("./data/helpers/actionModel");

server.listen(4000, () => {
  console.log("===== Listening on port 4000 =====");
});

const logger = (req, res, next) => {
  console.log(
    `${req.method.toUpperCase()} REQUEST at ${new Date().toISOString()} from ${
      req.url
    }`
  );

  next();
};

const validateID = (req, res, next) => {
  const { id } = req.params;
  const type = req.url.includes("projects") ? "project" : "action";
  let helperCall;

  type === "project"
    ? (helperCall = pDB)
    : type === "action"
    ? (helperCall = aDB)
    : null;

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
  !req.body.name || !req.body.description
    ? res
        .status(400)
        .json({ error: "Project must have a name and description." })
    : next();
};

server.use(express.json());
server.use(cors());

server.get("/projects", (req, res) => {
  pDB
    .get()
    .then(projects => res.status(200).json({ projects: projects }))
    .catch(err =>
      res
        .status(400)
        .json({ error: "Sorry, cannot retrieve projects at this time." })
    );
});

server.get("/projects/:id", validateID, (req, res) => {
  pDB
    .get(req.identifier)
    .then(project => res.status(200).json({ project: project }))
    .catch(err =>
      res.status(500).json({
        error: `There was a problem getting this project. Please try again.`
      })
    );
});

server.post("/projects", validateProject, (req, res) => {
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
        .json({ error: "Could not create new proect. Please try again." })
    );
});

server.put("/projects/:id", validateID, (req, res) => {
  pDB
    .update(req.identifier, req.body)
    .then(project => res.status(200).json({ project: project }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Could not update the project. Please try again." })
    );
});

server.delete("/projects/:id", validateID, (req, res) => {
  pDB
    .remove(req.identifier)
    .then(project => res.status(204).end())
    .catch(err =>
      res
        .status(500)
        .json({
          error: "Could not delete the requested project. Please try again."
        })
    );
});
