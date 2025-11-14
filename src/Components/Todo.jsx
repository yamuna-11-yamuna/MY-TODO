import React, { useEffect, useRef, useState } from "react";
import "./CSS/Todo.css";
import TodoItems from "./TodoItems";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);

  const inputRef = useRef(null);

  // Load tasks
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(saved);
    setLoaded(true);
  }, []);

  // Save tasks
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("todos", JSON.stringify(todos));

    // show saved ✓ message
    setSaveMessage(true);
    const timer = setTimeout(() => setSaveMessage(false), 1500);
    return () => clearTimeout(timer);

  }, [todos, loaded]);

  // Add task
  const addTodo = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toLocaleString(),
      completedAt: null,
    };

    setTodos([...todos, newTodo]);
    inputRef.current.value = "";
  };

  // Delete
  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Toggle complete
  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toLocaleString() : null,
            }
          : t
      )
    );
  };

  // Edit
  const editTodo = (id) => {
    const newText = prompt("Edit task:");
    if (!newText) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  // Split lists
  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="todo-wrapper">
      <h1 className="gradient-title">To-Do Dashboard</h1>

      {/* Top Input */}
      <div className="top-bar">
        <input
          ref={inputRef}
          className="task-input"
          placeholder="Write a task..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>+ Add Task</button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="save-msg">✓ Tasks saved locally</div>
      )}

      {/* PENDING TASKS */}
      <h2 className="section-title">⏳ Pending Tasks</h2>
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Date Added</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {pending.length === 0 && (
          <div className="empty-msg">No pending tasks 🎉</div>
        )}

        {pending.map((item) => (
          <TodoItems
            key={item.id}
            {...item}
            toggle={() => toggleComplete(item.id)}
            deleteTodo={() => deleteTodo(item.id)}
            editTodo={() => editTodo(item.id)}
          />
        ))}
      </div>

      {/* COMPLETED TASKS */}
      <h2 className="section-title">✅ Completed Tasks</h2>
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Completed At</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {completed.length === 0 && (
          <div className="empty-msg">No completed tasks yet</div>
        )}

        {completed.map((item) => (
          <TodoItems
            key={item.id}
            {...item}
            createdAt={item.completedAt}  
            toggle={() => toggleComplete(item.id)}
            deleteTodo={() => deleteTodo(item.id)}
            editTodo={() => editTodo(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Todo;
