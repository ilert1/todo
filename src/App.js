import React, { useEffect, useState } from "react";
import ToDoList from "./components/Pages/ToDoList";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateTodo from "./components/ToDo/CreateTodo";
import ToDoListItem from "./components/ToDo/ToDoListItem";
import ChangeTodo from "./components/ToDo/ChangeTodo";
import Login from "./components/Pages/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "./components/ui/NavBar";
import auth from "./utils/auth";
import Dashboard from "./components/Pages/Dashboard";
import UserPage from "./components/Pages/UserPage";
import Register from "./components/Pages/Register";
import { ref, child, get } from "firebase/database";
import db from "./utils/database";
import AdminPage from "./components/Pages/AdminPage";
import { useNavigate } from "react-router-dom";
function App() {
    const [user, loading] = useAuthState(auth);
    const [admin, setAdmin] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    useEffect(() => {
        setIsLoading(true);
        if (!user) {
            setIsLoading(false);
            return;
        }
        get(child(ref(db, "/"), "admin"))
            .then((snap) => {
                if (snap.exists()) {
                    if (user.email === snap.val()) setAdmin(true);
                    else setAdmin(false);
                } else setAdmin(false);
            })
            .finally(setIsLoading(false));
    }, [user]);

    return (
        <div className="container">
            <NavBar />
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
                            <Route path=":todoID" element={<ChangeTodo />} />
                        </Route>
                        <Route path=":todoID" element={<ToDoListItem />} />
                    </Route>
                )}
                <Route path="login" element={<Login />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="userpage" element={<UserPage />} />
                <Route path="register" element={<Register />} />
                {admin && <Route path="admin" element={<AdminPage />} />}
                <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
        </div>
    );
}

export default App;
