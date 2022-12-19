import { useEffect } from "react";
import { useState } from "react";
import { useContext, createContext } from "react";
import storage from "../utils/storage";
import database from '../utils/database';
import { get, child, ref, remove, update } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../utils/auth'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'


const TodoContext = createContext();

export const useTodo = () => {
    return useContext(TodoContext);
}

export const TodoProvider = ({ children }) => {
    const [todo, setTodo] = useState({});
    const [user, userLoading] = useAuthState(auth);

    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading) {
            return;
        }
    }, [userLoading])

    useEffect(() => {
        if (error) {
            toast(error.message);
            setError(false);
        }
    }, [error]);

    const getTodoList = async () => {
        get(child(ref(database), 'todo/' + user.uid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let snapWithoutCounter = snapshot.val();
                    delete (snapWithoutCounter['counter']);
                    setTodo(snapWithoutCounter);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                handleError(error);
            }).finally(setLoading(false));
    }

    useEffect(() => {
        setLoading(true);
        if (!user) {
            navigate('/dashboard')
        }
        getTodoList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onDelete = (tod) => {
        const ok = window.confirm("Are you sure want to delete a todo?");
        if (!ok) return;
        let newTodo = { ...todo };
        delete (newTodo[tod]);
        setTodo(newTodo);
        remove(ref(database, `todo/${user.uid}/${tod}`)).then(() => {
            deleteObject(storageRef(storage, `files/${tod}`))
        });
    }

    const onComplete = (tod) => {
        if (todo[tod]['done']) {
            alert('Todo is already done');
            return;
        }
        const ok = window.confirm("Are you sure want to mark a todo as completed?");
        if (!ok) return;
        let newTodo = { ...todo };
        newTodo[tod]['done'] = true;
        setTodo(newTodo);
        update(ref(database, `todo/${user.uid}${tod}`), {
            done: true
        });
    }

    function handleError(error) {
        setError(error);
        console.log(error.message);
    }

    return <TodoContext.Provider value={{ todo, isLoading, onDelete, onComplete, getTodoList }}>
        {isLoading ? "Loading..." : children}
    </TodoContext.Provider>
}   