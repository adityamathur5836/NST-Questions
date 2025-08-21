const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.txt");

/**
 * Create a new todo and append it to db.txt
 */
function createTodoSync(title) {
  const todo = {
    id: Date.now(),
    title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Convert to JSON string
  const todoString = JSON.stringify(todo, null, 2);

  // Append with newline
  fs.appendFileSync(DB_PATH, todoString + "\n", "utf-8");

  return todo;
}

/**
 * Get all todos (raw format from db.txt)
 */
function getTodosSync() {
  if (!fs.existsSync(DB_PATH)) return "";
  return fs.readFileSync(DB_PATH, "utf-8");
}

/**
 * Get a specific todo by id (stringified JSON format)
 */
function getTodoSync(id) {
  if (!fs.existsSync(DB_PATH)) return null;

  const lines = fs.readFileSync(DB_PATH, "utf-8").trim().split("\n");

  for (let line of lines) {
    const todo = JSON.parse(line);
    if (todo.id === id) {
      return JSON.stringify(todo, null, 2);
    }
  }

  return null;
}

/**
 * Update a todo by id with given updates
 */
function updateTodoSync(id, updates) {
  if (!fs.existsSync(DB_PATH)) return null;

  const lines = fs.readFileSync(DB_PATH, "utf-8").trim().split("\n");
  let updatedTodo = null;

  const updatedLines = lines.map((line) => {
    let todo = JSON.parse(line);
    if (todo.id === id) {
      todo = {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      updatedTodo = todo;
    }
    return JSON.stringify(todo, null, 2);
  });

  fs.writeFileSync(DB_PATH, updatedLines.join("\n") + "\n", "utf-8");

  return updatedTodo;
}

/**
 * Delete a todo by id
 */
function deleteTodoSync(id) {
  if (!fs.existsSync(DB_PATH)) return false;

  const lines = fs.readFileSync(DB_PATH, "utf-8").trim().split("\n");

  const filteredLines = lines.filter((line) => {
    const todo = JSON.parse(line);
    return todo.id !== id;
  });

  fs.writeFileSync(DB_PATH, filteredLines.join("\n") + (filteredLines.length ? "\n" : ""), "utf-8");

  return true;
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
