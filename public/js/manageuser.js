import axios from 'axios';
import { showAlert } from './alert';

export const searchuser = async (name) =>{ 
    //const mns = `${name}`;
    //console.log(mns);
    //console.log(name);
    //let slgs = name.toLowerCase();
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users?email=${name}`,
        });
        let id;
        if(res.data.status === 'success'){
            //showAlert('success', 'Course found successfully!');
            //console.log(res.data);
            //console.log(res.data);

            /*res.data.status(200).render('topCourFilt', {
                title: 'Top Filter courses',
                //ud: user_data,
                tour: res.data
              });*/
            id = res.data.data.data[0]._id;
            //console.log(id);
               

            //after one n half seconds load the front page(home page) .
            /*window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                //location.assign('/read');
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        */
        }
        const resp = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        });
        if(resp.data.status === 'success'){
            showAlert('success', 'User found successfully!');
            //console.log(res.data.data.data);
            //console.log(resp.data.data.data._id);
            id = resp.data.data.data._id;
               

            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign(`/reads/${id}`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const updtusers = async (name) =>{ 
    //const mns = `${name}`;
    //console.log(mns);
    //console.log(name);
    //let slgs = name.toLowerCase();
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users?email=${name}`,
        });
        let id;
        if(res.data.status === 'success'){
            id = res.data.data.data[0]._id;
            //console.log(id);
        }
        const resp = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        });
        if(resp.data.status === 'success'){
            showAlert('success', 'User found successfully!');
            //console.log(resp.data.data.data._id);
            const ids = resp.data.data.data._id;
               

            //after one n half seconds load the front page(home page) .
            window.setTimeout(() =>{
                //location.assign('/api/v1/users/logout'); // /login //used in order to load another page n / here is to go to home page or load home page
                location.assign(`/updat/${ids}`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        
        }

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const deltusers = async (name) =>{ 
    //const mns = `${name}`;
    //console.log(mns);
    //console.log(name);
    //let slgs = name.toLowerCase();
    try{ //axios is used communicate btw back-end n front-end 
        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users?email=${name}`,
        });
        let id;
        if(res.data.status === 'success'){
            id = res.data.data.data[0]._id;
            //console.log(id);
        }
        await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'DELETE',
            url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        }).then(()=>{
            showAlert('success', 'User deleted successfully!');
            window.setTimeout(() =>{
                location.assign(`/usr`); //used in order to load another page n / here is to go to home page or load home page
            }, 1500);
        });

        //console.log(res)
    }catch (err){
        showAlert('error', err.response.data.message); //gives more detail to the error
    }  
};

export const updateUsers = async (data, id) => {
    //console.log(id);
    try{
        const url = `http://127.0.0.1:8000/api/v1/users/${id}`

        const res = await axios({ //it's called a client-facing code n axios method is throwning n error whenever we get n error back from our api input.
            method: 'PATCH', //it can be in lowercase
            url, 
            data
        });

        if(res.data.status === 'success'){
            //console.log(res.data.data);
            showAlert('success', `User data updated successfully!`);
            window.setTimeout(() =>{
                location.assign(`/usr`);
            }, 1500); //1500 is in millisecond n set the time to load home page here means 1500 ms after logging will load home page
        
        }
    }catch(err){
        showAlert('error', err.response.data.message);
    }
};