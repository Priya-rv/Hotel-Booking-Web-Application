import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import FavoriteIcon from './favicon';

const API_URL = 'https://mocki.io/v1/4775a500-cf31-4bee-8a65-0c849b6e4d0c';
const HotelList = () => {
    const [hotels, setHotels] = useState();
    const [filteredHotels, setFilteredHotels] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [favouriteFilter, setFavouriteFilter] = useState();
    const [sortFilter, setSortFilter] = useState();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favHotels, setFavHotels] = useState();

    const handleFavoriteToggle = (hotelId) => {
        const favHotels =
            hotels?.map((hotel) =>
                hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
            );
        console.log("favHotels", favHotels);
        setFavHotels(favHotels)
        setIsFavorite(!isFavorite);
    };




    useEffect(() => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                setHotels(data);
                setFilteredHotels(data);
            })
            .catch(error => console.error('Error Fetching  Hotels data:', error));
    }, []);

    console.log("hotels", hotels);

    useEffect(() => {
        let updatedHotels = hotels;
        if (searchQuery) {
            const searchterm = searchQuery.toLowerCase();
            updatedHotels = hotels.filter(hotel => hotel.name.toLowerCase().includes(searchterm) || hotel.id.includes(searchterm))
        }
        if (favouriteFilter) {
            updatedHotels = updatedHotels.filter(hotel => hotel.favorite);
            setFavHotels(updatedHotels);
        }
        if (sortFilter) {
            updatedHotels = updatedHotels.sort((a, b) => a.price - b.price);
        }
        setFilteredHotels(updatedHotels);
    }, [hotels, searchQuery, favouriteFilter, sortFilter]);

    return (
        <div>

            <div className="search-container">
                <input
                    className='search-bar'
                    type='text'
                    placeholder='Goa'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

            </div>
            {/* <button onClick={() => setSearchQuery('')} className={`clear-chip ${searchQuery ? 'blue-border' : ''}`} >clear</button> */}
            <div>
                <button className={`fav-chip ${favouriteFilter ? 'blue-border' : ''}`} onClick={() => setFavouriteFilter(!favouriteFilter)}> Favorite</button>
                <button className={`price-chip ${sortFilter ? 'blue-border' : ''}`} onClick={() => {
                    setSortFilter(!sortFilter);
                }}>Price</button>
            </div>
            <div className='hotel-list'>
                {
                    filteredHotels?.map(hotel => (
                        <div>
                            <div key={hotel.id} className='hotel-card'>
                                <img className='image' src={hotel.image} alt={`Hotel ${hotel.id}`} />
                                {/* <div className='favorite-icon' >
                                    <img src={require('./heart.svg').default} className='favImage' />
                                </div> */}
                                <div className='favorite-icon'>
                                    <FavoriteIcon isFavorite={isFavorite} onClick={() => handleFavoriteToggle(hotel.id)} />
                                </div>
                            </div>
                            <p className='hotel-name'>{hotel.name}</p>
                            <p className='hotel-price'>{hotel.price}</p>
                            <p className='hotel-breakfast'>{hotel.freeBreakfast
                                ? 'Free Breakfast' : ''}</p>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}

export default HotelList;
