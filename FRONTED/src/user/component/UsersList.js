import React from "react";

import './UsersList.css';
import UserItem from "./UserItem";
import Cardd from "../../shared/components/UIElements/Cardd";


const UsersList = props => {
     if(props.items.length === 0)
        {
        return (
        <div className="center">
            <Cardd>
            <h2>No users found.</h2>
            </Cardd>
        </div>
        );
       }

       return (
        <ul className="users-list">
        {props.items.map(user => (
         <UserItem  
         key= {user.id} 
         id = {user.id} 
         image = {user.image} 
         name = {user.name} 
         placeCount = {user.places} />
        ))}
       </ul>
       );
};

export default UsersList;