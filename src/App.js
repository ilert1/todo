import React from "react";
import ToDoList from "./components/ToDoList";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateTodo from "./components/CreateTodo";
import ToDoListItem from "./components/ToDoListItem";
import ChangeTodo from "./components/ChangeTodo";
function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Navigate to={"todo"} replace />} />
                <Route path="/todo">
                    <Route index element={<ToDoList />} />
                    <Route path="create" element={<CreateTodo />} />
                    <Route path="edit">
                        <Route path=":todoID" element={<ChangeTodo />} />
                    </Route>
                    <Route path=":todoID" element={<ToDoListItem />} />
                </Route>
                <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
        </div>
    );
}

export default App;
