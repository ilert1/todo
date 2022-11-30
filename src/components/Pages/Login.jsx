import React, { useState, useEffect } from 'react'
import auth, { logInWithEmailAndPassword } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
export default function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    const onChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    useEffect(() => {
        if (loading) { return; }
        if (user) navigate('/', { relative: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        logInWithEmailAndPassword(data.email, data.password);
    }
    return (
        <div>
            <form className='mt-5' onSubmit={handleSubmit}>
                <div className="row">
                    <div className="mb-3 col-md-6 offset-md-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input value={data.email} type="email" className="form-control" id="exampleInputEmail1" name='email' aria-describedby="emailHelp" onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-md-6 offset-md-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input value={data.password} type="password" className="form-control" id="exampleInputPassword1" name='password' onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary col-md-6 offset-md-3">Submit</button>
                </div>
            </form >
        </div >
    )
}
