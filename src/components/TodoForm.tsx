import { useState } from "react";

interface Props {
  addTodo: (
    title: string,
    assignedTo: string,
    dueDate: string,
    priority: "low" | "medium" | "high",
  ) => void;
}

function TodoForm({ addTodo }: Props) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = () => {
    if (
      title.trim() === "" ||
      assignedTo.trim() === "" ||
      dueDate.trim() === ""
    ) {
      return;
    }

    addTodo(title, assignedTo, dueDate, priority);

    setTitle("");
    setAssignedTo("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Görev başlığı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Görevi yapacak kişi..."
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="mt-3 d-grid">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Görev Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoForm;
