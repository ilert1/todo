import React, { useState, useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import auth, { logout } from "../../utils/auth";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ref, child, get } from "firebase/database";
import db from "../../utils/database";
function NavBar() {
    const [user, loading] = useAuthState(auth);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        logout();
        navigate('/dashboard');
    }
    useEffect(() => {
        if (loading) return;
    }, [loading]);


    useEffect(() => {
        setIsLoading(true);
        if (!user) {
            setIsLoading(false);
            return;
        }
    }, [user])

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {user ? <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/todo"
                                >
                                    Home
                                </Link>
                            </li> :
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        aria-current="page"
                                        to="/dashboard"
                                    >
                                        Home
                                    </Link>
                                </li>}
                            {!user && <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>}
                            {!user && <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    Register
                                </Link>
                            </li>}
                            {user && <li className="nav-item">
                                <Link className="nav-link" to="/userpage">
                                    UserPage
                                </Link>
                            </li>}
                        </ul>
                        {user && <button className="btn btn-outline-success" type="submit" onClick={handleClick}>Log Out</button>}
                    </div>
                </div>
            </nav >
        </div >
    )
}

export default NavBar