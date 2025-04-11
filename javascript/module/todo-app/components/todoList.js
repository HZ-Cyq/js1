 // 默认导出函数组件
export default function renderTodoList(todos) {
    const ul = document.createElement('ul');
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = `${todo.title} - ${todo.createdAt.toLocaleString()}`;
      ul.appendChild(li);
    });
    return ul;
  }
   