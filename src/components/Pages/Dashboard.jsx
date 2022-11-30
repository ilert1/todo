import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../../utils/auth'
import { logout } from "../../utils/auth";
function Dashboard() {
    return (
        <div>Hello, Login to see your todos</div>
    )
}

export default Dashboard