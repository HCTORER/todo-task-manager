import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newTitle: string) => void;
}

function TodoList({ todos, toggleTodo, deleteTodo, editTodo }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty-state card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="empty-state-icon mb-3">📋</div>
          <h4 className="mb-2">Henüz görev yok</h4>
          <p className="text-muted mb-0">
            İlk görevini ekleyerek task yönetimine başlayabilirsin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
