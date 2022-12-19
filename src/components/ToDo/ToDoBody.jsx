import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useTodo } from '../../hooks/useTodo'

export default function ToDoBody() {
    const { todo, isLoading, onDelete, onComplete } = useTodo();
    const navigate = useNavigate();
    const updateDateText = (tod) => {
        if (todo[tod]['done']) return "";
        const dateToCompare = dayjs(todo[tod]['date']);
        const diff = dateToCompare.diff(dayjs(), 'days');
        if (diff < 0) {
            if (diff === -1) return `${-diff} day ago`;
            return `${-diff} days ago`;
        } else if (diff === 0) {
            return `Last day!`;
        } else {
            if (diff === 1) return `${diff} day left`;
            return `${diff} days left`;
        }
    }

    const getColor = (date, done) => {
        if (done === true) return 'RGBA(67,220,80,0.57)';
        const dateToCompare = dayjs(date);
        const diff = dateToCompare.diff(dayjs(), 'days');
        if (diff < 0) {
            return `RGBA(255,101,80,0.7)`;
        } else if (diff === 0) {
            return `RGBA(255,159,80,0.7)`;
        } else {
            return `RGBA(255,206,80,0.7)`;
        }
    }


    const handleDelete = (e, tod) => {
        e.preventDefault();
        onDelete(tod);
    }

    const handleComplete = (e, tod) => {
        e.preventDefault();
        onComplete(tod);
    }


    if (isLoading) return (<div>Loading...</div>);
    return (
        <div className="list-group d-flex justify-center align-items-center">

            {todo ? Object.keys(todo).map(tod =>
                <Link key={tod} to={tod} className="list-group-item list-group-item-action" style={{ backgroundColor: getColor(todo[tod]['date'], todo[tod]['done']), }}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1 w-75">{todo[tod]['title']}</h5>
                        <small className="text-muted">{updateDateText(tod)}</small>
                    </div>
                    <div className="d-flex w-100 justify-content-between" >
                        <p className="mb-1 w-75">{todo[tod]['description']}</p>
                        <div className="d-inline">
                            <button title="Delete todo" className='btn btn-danger ms-2' onClick={e => handleDelete(e, tod)}><i className="bi bi-trash3"></i></button>
                            <button title="Mark as completed" className='btn btn-success mx-2' onClick={e => handleComplete(e, tod)}><i className="bi bi-check"></i></button>
                            <button title="Edit" className='btn btn-light mx-2' onClick={e => {
                                e.preventDefault();
                                navigate(`/todo/edit/${tod}`);
                            }}>
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </div>
                    <small className="text-muted">{todo[tod]['files'] ? todo[tod]['files'].length : 0} file(s) here</small>
                </Link>
            ) : "There are no todos"}
        </div>
    )
}