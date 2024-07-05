import React from "react";
import { useParams} from  'react-router-dom';
import PlaceList from "../component/PlaceList";


const DUMMY_PLACES =[
  {
    id:'p1',
    title: 'Empire State Building',
    description:'One of the most famous sky scrappers in the world!',
    imageUrl:'https://media.istockphoto.com/id/491101726/photo/empire-state-building-in-new-york-and-lower-manhattan.jpg?s=612x612&w=is&k=20&c=Tqfno7hzgEyIuORQ8FOGbmCbLiAlQFb_MtP9gcQCJnc=',
    address: '20 W 34th St., New York, NY 10001, United States',
    location:{
      lat: 40.7484404,
      lng: -73.9905353
    },
    creator:'u1'
  },
  {
    id:'p2',
    title: 'Emp State Building',
    description:'One of the most famous sky scrappers in the world!',
    imageUrl:'https://media.istockphoto.com/id/491101726/photo/empire-state-building-in-new-york-and-lower-manhattan.jpg?s=612x612&w=is&k=20&c=Tqfno7hzgEyIuORQ8FOGbmCbLiAlQFb_MtP9gcQCJnc=',
    address: '20 W 34th St., New York, NY 10001, United States',
    location:{
      lat: 27.1751448,
      lng: 78.0230865
      
    },
    creator:'u2'
  }
]

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place =>place.creator === userId);

  return <PlaceList items={loadedPlaces}/>;
};
export default UserPlaces;
