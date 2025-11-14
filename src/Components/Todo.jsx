import React, { useEffect, useRef, useState } from "react";
import "./CSS/Todo.css";
import TodoItems from "./TodoItems";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);

  const inputRef = useRef(null);

  // Load FROM localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(saved);
    setLoaded(true);
  }, []);

  // Save TO localStorage AFTER loaded
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("todos", JSON.stringify(todos));

    // show message
    setSaveMessage(true);

    const timer = setTimeout(() => setSaveMessage(false), 1500);
    return () => clearTimeout(timer);

  }, [todos, loaded]);

  const addTodo = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTodos([...todos, newTodo]);
    inputRef.current.value = "";
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const editTodo = (id) => {
    const newText = prompt("Edit task:");
    if (!newText) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  return (
    <div className="todo-wrapper">
      <h1 className="gradient-title">MY-TODO</h1>

      <div className="top-bar">
        <input
          ref={inputRef}
          className="task-input"
          placeholder="Write a task..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>+ Add Task</button>
      </div>

      {/* SAVE MESSAGE */}
      {saveMessage && (
        <div className="save-msg">
          ✓ Tasks saved locally
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Date Added</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {todos.map((item) => (
          <TodoItems
            key={item.id}
            {...item}
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
