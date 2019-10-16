const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.count('Request');
  next();
});

function checkIdExists(req, res, next) {
  if (!projects.find(p => p.id == req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' });
  }
  next();
}

server.post('/projects', (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  if (projects.find(p => p.id == id)) {
    return res.status(400).json({ error: 'This id is already in use' })
  } else {
    projects.push({
      id,
      title,
      tasks: []
    });
  }

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id = id);
  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);