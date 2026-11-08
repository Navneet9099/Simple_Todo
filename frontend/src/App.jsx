import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/api/todos`;

  // 1. READ: Fetch all todos (GET)
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. CREATE: Add a new todo (POST)
  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const newTodo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 3. UPDATE: Toggle completed status (PUT)
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const updatedTodo = await response.json();

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 4. DELETE: Remove a todo (DELETE)
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
      <h1>My Todo App</h1>

      {/* Input & Create */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Enter a todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          style={{ padding: "8px 12px", fontSize: "16px", flex: 1 }}
        />
        <button onClick={addTodo} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {todos.map((todo) => (
          <div
            key={todo._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#1e1e1e",
              padding: "10px 14px",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id, todo.completed)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#888" : "#fff",
                  fontSize: "16px",
                }}
              >
                {todo.title}
              </span>
            </div>

            <button
              onClick={() => deleteTodo(todo._id)}
              style={{
                background: "#e63946",
                border: "none",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;