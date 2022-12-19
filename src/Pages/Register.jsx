import React, { useState } from 'react'
import { registerWithEmailAndPassword } from '../utils/auth'
import { useNavigate } from 'react-router-dom'


function Register() {
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();


    const onChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        registerWithEmailAndPassword(data.email, data.password);
        navigate('/')
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

export default Register