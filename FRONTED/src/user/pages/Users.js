import React from "react";
import UsersList from "../component/UsersList";


const Users = () => {
    const USERS = [
        {
            id: 'u1', 
            name: 'Max', 
            image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
            places: 3}
        ];
    return <UsersList items={USERS} />;
};

export default Users;