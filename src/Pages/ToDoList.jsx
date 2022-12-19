import React from 'react'
import ToDoBody from '../components/ToDo/ToDoBody'
import ToDoHeader from '../components/ToDo/ToDoHeader'
import { Link } from 'react-router-dom'
export default function ToDoList() {

    return (
        <div className="row d-flex">
            <ToDoHeader />
            <Link to={'create'} className="btn btn-primary w-25 mx-auto mb-4">Create New Todo</Link>
            <ToDoBody />
        </div>
    )
}
