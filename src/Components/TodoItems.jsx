import React from "react";
import "./CSS/TodoItems.css";

const TodoItems = ({ text, createdAt, completed, toggle, deleteTodo, editTodo }) => {
  return (
    <div className={`table-row ${completed ? "completed" : ""}`}>
      
      <div className="row-text" onClick={toggle}>
        {text}
      </div>

      <div className="row-date">{createdAt}</div>

      <div className={`row-status ${completed ? "done" : "pending"}`}>
        {completed ? "Completed" : "Pending"}
      </div>

      <div className="row-actions">
        <button className="action-btn" onClick={editTodo}>✎</button>
        <button className="action-btn delete" onClick={deleteTodo}>🗑</button>
      </div>

    </div>
  );
};

export default TodoItems;
