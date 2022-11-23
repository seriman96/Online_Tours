/* eslint-disable */   //used to disable eslint functionality for this file

//these file in js folder is used to communicate the front end code template with our backend api code

//Updating user data with API implementation
import axios from 'axios';
import { showAlert } from './alert';

//export const updateData = async (name, email) => {
//type here is either 'password' or 'data' and data param here is an object used to update both user data n user passwd
export const updateSettings = async (data, type) => {
    try{
        const url = type === 'password' ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:8000/api/v1/users/updateMe'

        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH', //it can be in lowercase
            url, 
            data
        });

        if(res.data.status === 'success'){
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    }catch(err){
        showAlert('error', err.response.data.message);
    }
};