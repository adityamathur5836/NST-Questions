const fs = require("fs");
const path = require("path");

const DB_FILE_PATH = path.join(__dirname, "db.txt");

const dbTextToJson = (text) => {
  const formattedString = ⁠ [${text.trim().split("\n}\n{").join("},{")}] ⁠;
  const jsonArray = JSON.parse(formattedString);
  return jsonArray;
};

function JsonToDbText(Json){
  let text = "";
  Json.forEach((todo) => {
    text += JSON.stringify(todo, null, 2) + "\n";
  });
  return text;
};

const getTodosSync = () => {
  return fs.readFileSync(DB_FILE_PATH, 'utf8');
};

const getTodoSync = (id) => {
  return JSON.stringify(dbTextToJson(getTodosSync()).filter((obj)=>obj.id==id)[0])
};

const createTodoSync = (todo) => {
  const todoObj = {
        id: Date.now(),
        title: todo,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    fs.appendFileSync(DB_FILE_PATH, JsonToDbText([todoObj]))
};

const updateTodoSync = (id, updates) => {
  const data = fs.readFileSync(DB_FILE_PATH, 'utf8')
  fs.writeFileSync(DB_FILE_PATH, JsonToDbText(dbTextToJson(data).map((obj) => {
    return obj.id==id ? {...obj, ...updates, updatedAt: new Date().toISOString()} : obj
  })))
};

const deleteTodoSync = (id) => {
  fs.writeFileSync(DB_FILE_PATH, JsonToDbText(dbTextToJson(getTodosSync()).filter((obj) => obj.id != id)))
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
