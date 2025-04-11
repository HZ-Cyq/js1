import todoService from './services/todoService.js'; // 默认导入
import renderTodoList from './components/todoList.js'; // 默认导入
import { formatDate, getToday } from './utils/date.js'; // 命名导入

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  todoService.addTodo('写周报');
  todoService.addTodo('买牛奶');

  const todos = todoService.getTodos();

  const heading = document.createElement('h2');
  heading.textContent = `今天是 ${formatDate(getToday())}`;
  app.appendChild(heading);

  const todoList = renderTodoList(todos);
  app.appendChild(todoList);
});
