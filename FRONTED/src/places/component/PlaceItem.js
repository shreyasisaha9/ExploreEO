import React, { useContext, useState }from "react";


import './PlaceItem.css'
import Cardd from "../../shared/components/UIElements/Cardd";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
// import Map from "../../shared/components/UIElements/Map";
const PlaceItem= props => {

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    const cancelDeleteHandler = () =>{
        setShowConfirmModal(false);

    }
    const confirmDeleteHandler = async () =>{
        setShowConfirmModal(false);
        console.log('DELETING...')
        try{
            await sendRequest(`http://localhost:5000/api/places/${props.id}`,
            'DELETE', 
            null,
             {
                Authorization: 'Bearer ' + auth.token

             } 
        );
        props.onDelete(props.id);
    }catch(err){

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error = {error} onclear={clearError} />
            <Modal 
            show={showMap} 
            onCancel={closeMapHandler} 
            header={props.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button  onClick={closeMapHandler}>CLOSE</Button>}
            >
                
                <div className="map-container" style={{padding: "5px"}}>

                    <iframe 
                        title="map" 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0"
                        marginWidth="0"

                        src={'https://maps.google.com/maps?q=' + props.coordinates.lat.toString() + ',' + props.coordinates.lng.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}></iframe>
                    <script type='text/javascript' src='https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165'></script>

           </div>


            </Modal>

  <Modal 
  show={showConfirmModal}
  onCancel={cancelDeleteHandler}
  header="Are you sure?" 
  footerClass= "place-item__modal-actions" 
  footer={
    <React.Fragment>
        <Button inverse>CANCEL</Button>
        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>

    </React.Fragment>
  }>
     <p>Do you want to proceed and delete this place ?
        Please note that it can't be undone thereafter.</p>
  </Modal>

    <li className="place-item">
        
        <Cardd className="place-item__content">
        {isLoading && <LoadingSpinner asOverlay/>}
        <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
        </div>
        <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>
        <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
                </Button>

            {auth.userId === props.creatorId && (
                <Button to={`/places/${props.id}`}>EDIT</Button>
                )} 
            {auth.userId === props.creatorId && (
                <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                 )}
        </div>
        </Cardd>
    </li>
    </React.Fragment>
    );

};
export default PlaceItem;