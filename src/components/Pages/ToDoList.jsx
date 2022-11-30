import React from 'react'
import ToDoBody from '../ToDo/ToDoBody'
import ToDoHeader from '../ToDo/ToDoHeader'
import { Link } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../../utils/auth'

export default function ToDoList() {
    const [user, loading, error] = useAuthState(auth);
    return (
        <div className="row d-flex">
            <ToDoHeader />
            <Link to={'create'} className="btn btn-primary w-25 mx-auto mb-4">Create New Todo</Link>
            <ToDoBody />
        </div>
    )
}
