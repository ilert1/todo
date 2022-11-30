import React, { useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../../utils/auth'

function UserPage() {
    const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
        if (loading) return;
        if (error) console.log(error.message)
    }, [loading, error])
    return (
        <div>
            <ol className="list-group list-group-numbered">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Email</div>
                        {user.email}
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">uid</div>
                        {user.uid}
                    </div>
                </li>

            </ol>
        </div>
    )
}

export default UserPage