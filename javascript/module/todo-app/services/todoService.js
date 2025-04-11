// 默认导出 TodoService 类
class TodoService {
    constructor() {
      this.todos = [];
    }
  
    addTodo(title) {
      this.todos.push({
        id: Date.now(),
        title,
        done: false,
        createdAt: new Date(),
      });
    }
  
    getTodos() {
      return this.todos;
    }
  }
  
  export default new TodoService();
  