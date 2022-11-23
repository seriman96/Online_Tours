/* eslint-disable */   //used to disable eslint functionality for this file

import axios from 'axios';
import { showAlert } from './alert';


export const forgotpassword = async (emails) =>{ // used to export the login function here
    //console.log(emails, passwords);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/forgotPassword',
            data:{
                email: emails
            }
        });
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Email sent successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign(`/resetPassword/${res.data.data}`); //`/api/v1/users/resetPassword/${res.data.data.passwordResetToken}`  //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};


export const resetpassword = async (tokenId, passwords, passwordConfirms) =>{ // used to export the login function here
    //console.log(`This is: ${tokenId}`);
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/users/resetPassword/${tokenId}`,
            data:{
                password: passwords,
                passwordConfirm: passwordConfirms
            }
        });//0234d43de23437e3ee17e23806ae8032158edc74b3aab2b6a68e9985b08e726e
        //console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Password resetted successfully!');
            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                location.assign('/sign'); //used in order to load another page n / here is to go to home page or load home page
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
            //console.log(res.data.data.passwordResetToken);
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

