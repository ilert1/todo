import React, { useEffect, useState } from "react";
import ToDoList from "./Pages/ToDoList";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateTodo from "./components/ToDo/CreateTodo";
import ToDoListItem from "./components/ToDo/ToDoListItem";
import ChangeTodo from "./components/ToDo/ChangeTodo";
import Login from "./Pages/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "./components/ui/NavBar";
import auth from "./utils/auth";
import Dashboard from "./Pages/Dashboard";
import UserPage from "./Pages/UserPage";
import Register from "./Pages/Register";
import { useNavigate } from "react-router-dom";
import { TodoProvider } from "./hooks/useTodo";
function App() {
    const [user, loading] = useAuthState(auth);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            setIsLoading(false);
            return;
        }
    }, [user]);

    if (isLoading) return "Loading...";
    return (
        <div className="container">
            <NavBar />
            <TodoProvider>
                <Routes>
                    {!user && (
                        <Route
                            path="/"
                            element={<Navigate to={"dashboard"} replace />}
                        />
                    )}
                    {user && (
                        <Route
                            path="/"
                            element={<Navigate to={"todo"} replace />}
                        />
                    )}
                    {user && (
                        <Route path="/todo">
                            <Route index element={<ToDoList />} />
                            <Route path="create" element={<CreateTodo />} />
                            <Route path="edit">
                                <Route
                                    path=":todoID"
                                    element={<ChangeTodo />}
                                />
                            </Route>
                            <Route path=":todoID" element={<ToDoListItem />} />
                        </Route>
                    )}
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="userpage" element={<UserPage />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<Navigate to={"/"} replace />} />
                </Routes>
            </TodoProvider>
        </div>
    );
}

export default App;
