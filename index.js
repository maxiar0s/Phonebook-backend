const express = require("express");
const cors = require("cors");
const app = express();

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

// app.use(requestLogger);

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let phonebook = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/api/phonebook", (request, response) => {
  response.json(phonebook);
});

app.get("/api/phonebook/:id", (request, response) => {
  const id = request.params.id;
  console.log(id);
  const entry = phonebook.find((note) => note.id === id);
  console.log(entry);
  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/phonebook/:id", (request, response) => {
  const id = request.params.id;
  phonebook = phonebook.filter((note) => note.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    phonebook.length > 0 ? Math.max(...phonebook.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/phonebook", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId().toString(),
  };

  phonebook = phonebook.concat(person);

  console.log(phonebook);

  response.json(person);
});

app.put("/api/phonebook/:id", (request, response) => {
  const id = request.params.id;
  const note = request.body;
  const newNote = {
    id: id,
    name: note.name,
    number: note.number,
  };
  phonebook = phonebook.map((note) => (note.id === id ? newNote : note));
  console.log(phonebook);
  response.json(newNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
