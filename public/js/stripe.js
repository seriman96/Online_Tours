/* eslint-disable */   //used to disable eslint functionality for this file

//private key is used for backend side development
//public key is used in frontend side n that one will be past here for keys

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_51LHpCiSCB5NJWvoB2ZyCheev4C14IPVUbSI0XR8XxrZF2cuP5Ka8FzPRYuryZ9AQ60aN0Aoh8jHIQE4ZWsxRoMKZ00UnnhgqpO'); //it's a public key

export const bookTour = async tourId =>{
    try{
        // 1) Get checkout session from API
        const session = await axios(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);

        // 2) Create checkout from + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id //will allowed us to go to paymant forum
        })

    }catch(err){
        console.log(err);
        showAlert('error', err);
    }
    
};

