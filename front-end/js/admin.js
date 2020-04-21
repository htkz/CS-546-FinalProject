import React from 'react';
import ReactDOM from 'react-dom';
// import '../css/admin.css';

const element = 'admin';
ReactDOM.render(element, document.getElementById('username'));

const fetchPlaces = async (store) => {
    store['places'] = await $.ajax({ url: 'http://localhost:3000/places/' });
};

const fetchUsers = async (store) => {
    store['users'] = await $.ajax({ url: 'http://localhost:3000/users/' });
};

const ShowPlaces = (props) => {
    return (
        <div className="place">
            <div className="placeImage">
                <img
                    className="imageSrc"
                    src={props.images}
                    alt={props.placeName}
                />
            </div>
            <div className="placeName">{props.placeName}</div>
            <div className="description">{props.description}</div>
            <div className="displaceTime">{props.displayTime}</div>
            <div className="remainNum">{props.remainNum}</div>
            <div className="placeAddress">{props.placeAddress}</div>
            <div className="placeZipCode">{props.placeZipCode}</div>
            <div className="placePrice">{props.placePrice}</div>
            <div className="category">{props.category}</div>
        </div>
    );
};

const renderPlaces = (places) => {
    for (place of places) {
        React.createElement('div', {
            id: place.placeName,
        });
        ReactDOM.render(
            <ShowPlaces
                images={place.images}
                placeName={place.placeName}
                description={place.description}
                displayTime={place.displayTime}
                remainNum={place.remainNum}
                placeAddress={place.placeAddress}
                placeZipCode={place.placeZipCode}
                placePrice={place.placePrice}
                category={place.category}
            />,
            document.getElementById(place.placeName)
        );
    }
};

const main = async () => {
    await fetchPlaces(store);
    console.log(store[places]);
    // await fetchUsers(store);
    ReactDOM.render(
        renderPlaces(store['places']),
        document.getElementById('root')
    );
};

main();
