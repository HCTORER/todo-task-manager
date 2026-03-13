import { useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");

    if (!savedTodos) return [];

    const parsedTodos = JSON.parse(savedTodos);

    return parsedTodos.map((todo: Partial<Todo>) => ({
      id: todo.id ?? Date.now(),
      title: todo.title ?? "",
      completed: todo.completed ?? false,
      assignedTo: todo.assignedTo ?? "",
      dueDate: todo.dueDate ?? "",
      priority: todo.priority ?? "medium",
    }));
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("smart");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const addTodo = (
    title: string,
    assignedTo: string,
    dueDate: string,
    priority: "low" | "medium" | "high",
  ) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      assignedTo,
      dueDate,
      priority,
      completed: false,
    };

    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const editTodo = (id: number, newTitle: string) => {
    if (newTitle.trim() === "") return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo,
    );

    setTodos(updatedTodos);
  };

  const clearCompleted = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    setTodos(activeTodos);
  };

  const getPriorityOrder = (priority: "low" | "medium" | "high") => {
    if (priority === "high") return 0;
    if (priority === "medium") return 1;
    return 2;
  };

  const getDeadlineOrder = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffInMs = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return 0; // Overdue
    if (diffInDays === 0) return 1; // Today
    if (diffInDays <= 3) return 2; // Soon
    return 3; // On Track
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") {
        return !todo.completed;
      }

      if (filter === "completed") {
        return todo.completed;
      }

      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "priority") {
        return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
      }

      if (sortBy === "deadline") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title, "tr");
      }

      const deadlineComparison =
        getDeadlineOrder(a.dueDate) - getDeadlineOrder(b.dueDate);

      if (deadlineComparison !== 0) {
        return deadlineComparison;
      }

      const priorityComparison =
        getPriorityOrder(a.priority) - getPriorityOrder(b.priority);

      if (priorityComparison !== 0) {
        return priorityComparison;
      }

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className={`app-wrapper ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="app-container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 className="m-0">Todo Task Manager</h1>

          <button
            className={`btn ${isDarkMode ? "btn-light" : "btn-dark"}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <TodoForm addTodo={addTodo} />

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card stats-card stats-card-total shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="stats-icon mb-3">📋</div>
                <p className="stats-label mb-2">Toplam Görev</p>
                <h2 className="stats-value mb-1">{totalTodos}</h2>
                <p className="stats-subtext mb-0">Sistemdeki tüm görevler</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stats-card stats-card-active shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="stats-icon mb-3">⚡</div>
                <p className="stats-label mb-2">Aktif Görev</p>
                <h2 className="stats-value mb-1">{activeTodos}</h2>
                <p className="stats-subtext mb-0">Devam eden işler</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stats-card stats-card-completed shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="stats-icon mb-3">✅</div>
                <p className="stats-label mb-2">Tamamlanan</p>
                <h2 className="stats-value mb-1">{completedTodos}</h2>
                <p className="stats-subtext mb-0">Başarıyla biten görevler</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card progress-card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold">Tamamlanma Durumu</span>
              <span>{progressPercentage}%</span>
            </div>

            <div className="progress" style={{ height: "10px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Görevlerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Sıralama</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="smart">Smart Sort</option>
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="d-flex flex-column align-items-center gap-3 mb-4">
          <div className="btn-group">
            <button
              className={`btn ${
                filter === "all"
                  ? isDarkMode
                    ? "btn-light"
                    : "btn-dark"
                  : isDarkMode
                    ? "btn-outline-light"
                    : "btn-outline-dark"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={`btn ${
                filter === "active"
                  ? isDarkMode
                    ? "btn-light"
                    : "btn-dark"
                  : isDarkMode
                    ? "btn-outline-light"
                    : "btn-outline-dark"
              }`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              className={`btn ${
                filter === "completed"
                  ? isDarkMode
                    ? "btn-light"
                    : "btn-dark"
                  : isDarkMode
                    ? "btn-outline-light"
                    : "btn-outline-dark"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {completedTodos > 0 && (
            <button className="btn btn-outline-danger" onClick={clearCompleted}>
              Clear Completed ({completedTodos})
            </button>
          )}
        </div>

        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      </div>
    </div>
  );
}

export default App;
