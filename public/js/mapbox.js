/* eslint-disable */   //used to disable eslint functionality for this file
//console.log('hello from the client side');
//we'll access map id div n the map value is in dataset variable
/*const locations = JSON.parse(document.getElementById('map').dataset.locations); //document.getElementById('map').dataset.locations has a value in string bcs of JSON.stringify() in tour.pug n we'll convert to json
console.log(locations);*/ //these 2 lines should be done inside index.js file

export const displayMap = (locations) =>{

    mapboxgl.accessToken = 'pk.eyJ1IjoiZG91bWJpYSIsImEiOiJjbDRnMG5zMHAwNGRyM2tsazR3cXp4N2g5In0.t-cHs4xfwGx7TucmAqaU4w';
    var map = new mapboxgl.Map({
        container: 'map', //map here is related to our id map in tour.pug file
        style: 'mapbox://styles/doumbia/cl4hftgu1004i15nyp898pnv1', //come from studio mapbox
        scrollZoom: false, //used to inactive zooming of the mapbox
        /*
        center:[-118.113491, 34.111745], //it's like mongodb n it required like mongodb to first give longitud value then latitud n shows central point for localization
        zoom: 10, //for zooming the map
        interactive: false, //with false value here the map will be inactive means fix
        */
    });

    //assign every tour to his specific location
    const bounds = new mapboxgl.LngLatBounds(); //bounds object here is the area that will be display on the map n we'll extend that with all of our tour locations.
    //looping through the tour locations array the one we got it from the docs in above locations variable
    locations.forEach(loc=>{
        //create marker
        const el = document.createElement('div'); //js create elt method here div elt
        el.className = 'marker'; //used to put or add some external customization to our mapbox bcs it comes from local css file

        //Add marker
        //creating new marker inside a mapbox
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom', //the bottom side of the marker will be point or located at the exact gps location of the tour in mapbox n it can take center
        }).setLngLat(loc.coordinates).addTo(map); // setLngLat will set tour longitud n latitud here contain in coordinates attrib from locations array n addTo() will add to the map created above

        // Add popup used to display info about the location on the mapbox n we need to define an html to the popup
        new mapboxgl.Popup({
            offset:30 //used to add some css in order to place marker below of the popup added from the mapbox
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)

        //extend the map bounds to include the current location
        bounds.extend(loc.coordinates);

    });

    // to make map to fit the bounds
    map.fitBounds(bounds, {
        padding: {
            top:200, //used to add some style to our elt inside bounds n here it's about movement 
            bottom:200,
            left:100,
            right:100
        }  
    });
}

