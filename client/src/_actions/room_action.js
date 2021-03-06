import Axios from 'axios';
import { MAKE_ROOM, GET_ROOM, JOIN_ROOM } from './types';

export function makeRoom(dataToSubmit){
    const request = Axios.post('/api/makeRoom', dataToSubmit).then(response =>
        response.data
    )
    return{
        type: MAKE_ROOM ,
        payload: request
    }
}

export function getRoom(){
    const request = Axios.get('/api/getRooms').then(response =>
        response.data
    )
    return{
        type: GET_ROOM ,
        payload: request
    }
}

export function joinRoom(dataToSubmit){
    const request = Axios.post('/api/joinRoom', dataToSubmit).then(response =>
        response.data
    )
    return{
        type: JOIN_ROOM ,
        payload: request
    }
}