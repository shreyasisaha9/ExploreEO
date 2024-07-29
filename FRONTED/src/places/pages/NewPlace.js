import React, { useContext } from "react";


import './PlaceForm.css';
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/Validator";
import Button from "../../shared/components/FormElements/Button";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";



const NewPlace = () => {


    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm(
    {title: {
        value: '', 
        isValid : false
    },
    description: {
        value: '', 
        isValid : false
    },
    address: {
        value: '', 
        isValid : false
    },
    image: {
        value:null,
        isValid : false
    }
  }, 
  false
);

    const history =useHistory();

    const placeSubmitHnadler = async event => {
        event.preventDefault();
        // console.log(formState.inputs); //backend
        try{
            const formData = new FormData();
            formData.append( 'title', formState.inputs.title.value,);
            formData.append( 'description', formState.inputs.description.value,);
            formData.append( 'address', formState.inputs.address.value,);
            formData.append( 'image', formState.inputs.image.value,);
            await sendRequest(
                'http://localhost:5000/api/places', 
                'POST',
              formData, {
                Authorization: 'Bearer ' + auth.token
              });
     history.push('/');
    }catch(err){}
    };
    


    return (
    <React.Fragment>
        <ErrorModal error = {error} onclear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}
        <form className="place-form" onSubmit={placeSubmitHnadler}>
            <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title"  
            validators= {[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid title."
            onInput={inputHandler} 
            />
            <Input 
            id="description"
            element="textarea" 
            type="text" 
            label="Description"  
            validators= {[VALIDATOR_MINLENGTH(5) ]} 
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler} 
            />
            <Input 
            id="address"
            element="input" 
            type="text" 
            label="Address"  
            validators= {[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid address."
            onInput={inputHandler} 
            />
            <ImageUpload 
             id="image" 
             onInput={inputHandler}
             errorText="Please provide an image." />
            <Button type="submit" disabled ={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>;
    </React.Fragment>
    );
};
export default NewPlace;
