import React from "react";
import { Link } from "react-router-dom";
import './UserItem.css';
import Avatar from "../../shared/components/UIElements/Avatar";
import Cardd from "../../shared/components/UIElements/Cardd";



const UserItem = props => {
    return(
        <li className="user-item">
           
                <Cardd className="user-item__content">
                <Link to={`/${props.id}/places`}>
                <div className="user-item__image">
                    <Avatar image={`http://localhost:5000/${props.image}`}  alt={props.name} />
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                    <h3>
                        {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
                    </h3>
                </div>
                </Link>
                </Cardd>
                
        </li>
    )
};

export default UserItem;