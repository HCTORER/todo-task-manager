import { useState } from "react";
import type { Todo } from "../types/todo";

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string) => void;
}

function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim() === "") return;
    editTodo(todo.id, editTitle);
    setIsEditing(false);
  };

  const getPriorityBadgeClass = () => {
    if (todo.priority === "high") return "badge bg-danger";
    if (todo.priority === "medium") return "badge bg-warning text-dark";
    return "badge bg-success";
  };

  const getPriorityLabel = () => {
    if (todo.priority === "high") return "High";
    if (todo.priority === "medium") return "Medium";
    return "Low";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDeadlineInfo = () => {
    const today = new Date();
    const due = new Date(todo.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffInMs = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return {
        label: "Overdue",
        className: "badge bg-danger-subtle text-danger-emphasis deadline-badge",
        cardClass: "todo-card-overdue",
      };
    }

    if (diffInDays === 0) {
      return {
        label: "Today",
        className: "badge bg-warning-subtle text-dark deadline-badge",
        cardClass: "todo-card-today",
      };
    }

    if (diffInDays <= 3) {
      return {
        label: "Soon",
        className: "badge bg-info-subtle text-info-emphasis deadline-badge",
        cardClass: "todo-card-soon",
      };
    }

    return {
      label: "On Track",
      className:
        "badge bg-secondary-subtle text-secondary-emphasis deadline-badge",
      cardClass: "",
    };
  };

  const deadlineInfo = getDeadlineInfo();

  return (
    <div
      className={`card todo-card shadow-sm border-0 mb-3 ${deadlineInfo.cardClass}`}
    >
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-start gap-3 flex-grow-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mt-1"
            />

            <div className="flex-grow-1">
              {isEditing ? (
                <input
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              ) : (
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5
                    className={`m-0 ${
                      todo.completed
                        ? "text-decoration-line-through text-muted"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </h5>

                  <span className={getPriorityBadgeClass()}>
                    {getPriorityLabel()}
                  </span>
                </div>
              )}

              <div className="mt-3 d-flex gap-3 text-muted small flex-wrap align-items-center">
                <span>👤 {todo.assignedTo}</span>
                <span>📅 {formatDate(todo.dueDate)}</span>
                <span className={deadlineInfo.className}>
                  {deadlineInfo.label}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            {isEditing ? (
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                Kaydet
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setIsEditing(true)}
              >
                Düzenle
              </button>
            )}

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteTodo(todo.id)}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
