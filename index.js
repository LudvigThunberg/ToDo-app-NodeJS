const express = require("express");
const exphbs = require("express-handlebars");
const todos = require("./todos.js");

function getNewId(list) {
  let maxId = 0;
  for (const item of list) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));

//GET: /home
app.get("/", (req, res) => {
  res.render("home", { todos });
});

//GET /:id
app.get("/todos/:id/update", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  res.render("todos-single", todo);
});

app.get("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  res.render("todos-delete", todo);
});

//GET: /create
app.get("/todos/create", (req, res) => {
  res.render("todos-create");
});

//GET: /todos/done
app.get("/todos/done", (req, res) => {
  const doneTodos = todos.filter(function (d) {
    return d.done == true;
  });

  res.render("todos-done", { doneTodos });
});

//GET: /todos/undone
app.get("/todos/undone", (req, res) => {
  const undoneTodos = todos.filter(function (u) {
    return u.done == false;
  });

  res.render("todos-undone", { undoneTodos });
});

//GET: /todos/newest || Sort
app.get("/todos/newest", (req, res) => {
  const todosNewest = todos.sort(function (t, a) {
    return a.createdForSort - t.createdForSort;
  });

  res.render("todos-newest", { todosNewest });
});

//GET: /todos/oldest || Sort
app.get("/todos/oldest", (req, res) => {
  const todosOldest = todos.sort(function (t, a) {
    return t.createdForSort - a.createdForSort;
  });

  res.render("todos-oldest", { todosOldest });
});

//POST: /create
app.post("/todos/create", (req, res) => {
  const id = getNewId(todos);
  const date = new Date();
  const dateSort = Date.now();

  const newTodo = {
    id: id,
    created: date.toLocaleString(),
    createdForSort: dateSort,
    title: req.body.title,
    description: req.body.description,
    done: false,
  };

  console.log(newTodo);

  todos.push(newTodo);

  res.render("home", { todos });
});

//UPDATE: todos/:id

app.post("/todos/:id/update", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  todos[index].title = req.body.title;
  todos[index].description = req.body.description;

  res.render("home", { todos });
});

//UPDATE todos/:id/done

app.post("/todos/:id/done", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  todos[index].done = !todos[index].done;

  res.redirect("/");
});

//DELETE: todos/:id

app.post("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  todos.splice(index, 1);

  res.redirect("/");
});

app.listen(9090, () => {
  console.log("http://localhost:9090");
});
