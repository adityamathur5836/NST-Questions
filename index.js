const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.txt");

// Helper to read all todos as array
function readAllTodos() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, "utf-8").trim();
  if (!data) return [];
  return data.split("\n").map(line => JSON.parse(line));
}

// Helper to write todos array back to file
function writeAllTodos(todos) {
  const data = todos.map(todo => JSON.stringify(todo, null, 2)).join("\n");
  fs.writeFileSync(DB_PATH, data + (todos.length ? "\n" : ""), "utf-8");
}

/**
 * CREATE
 */
function createTodoSync(title) {
  const todo = {
    id,
    title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  fs.appendFileSync(DB_PATH, JSON.stringify(todo, null, 2) + "\n", "utf-8");
  return todo;
}

/**
 * READ ALL (raw string)
 */
function getTodosSync() {
  if (!fs.existsSync(DB_PATH)) return "";
  return fs.readFileSync(DB_PATH, "utf-8");
}

/**
 * READ ONE
 */
function getTodoSync(id) {
  const todos = readAllTodos();
  const todo = todos.find(t => t.id === id);
  return todo ? JSON.stringify(todo, null, 2) : null;
}

/**
 * UPDATE
 */
function updateTodoSync(id, updates) {
  const todos = readAllTodos();
  let updatedTodo = null;

  const newTodos = todos.map(todo => {
    if (todo.id === id) {
      updatedTodo = {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedTodo;
    }
    return todo;
  });

  writeAllTodos(newTodos);
  return updatedTodo;
}

/**
 * DELETE
 */
function deleteTodoSync(id) {
  const todos = readAllTodos();
  const filtered = todos.filter(todo => todo.id !== id);
  writeAllTodos(filtered);
  return true;
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
