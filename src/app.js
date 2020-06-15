const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function doesIdExist(request, response, next) {
  const { id } = request.params;

  const idExists = repositories.find((repo) => repo.id === id);

  if (!idExists) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  return next();
}

app.get('/repositories', (request, response) => response.json(repositories));

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', doesIdExist, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete('/repositories/:id', doesIdExist, (request, response) => {
  const { id } = request.body;

  const repository = repositories.find((repo) => repo.id === id);
  repositories.pop(repository);

  return response.status(204).send();
});

// POST /repositories/:id/like: A rota deve aumentar o número de likes do
// repositório específico escolhido através do id presente nos parâmetros da rota,
// a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
app.post('/repositories/:id/like', doesIdExist, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
