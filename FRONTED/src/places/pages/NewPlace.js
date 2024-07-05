import React from "react";


import './PlaceForm.css';
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/Validator";
import Button from "../../shared/components/FormElements/Button";

import { useForm } from "../../shared/hooks/form-hook";



const NewPlace = () => {


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
    }
  }, 
  false
);

    

    const placeSubmitHnadler = event => {
        event.preventDefault();
        console.log(formState.inputs); //backend
    };
    


    return <form className="place-form" onSubmit={placeSubmitHnadler}>
        
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
        <Button type="submit" disabled ={!formState.isValid}>
            ADD PLACE
        </Button>
    </form>;
};

export default NewPlace;
