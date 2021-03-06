import Axios from 'axios';
import{
    LOGIN_USER, REGISTER_USER, AUTH_USER
} from './types'

export function loginUser(dataToSubmit){

    const request = Axios.post('/api/login', dataToSubmit).then(response =>
        response.data
    )
    return{
        type: LOGIN_USER ,
        payload: request
    }
}

export function registerUser(dataToSubmit){

    const request = Axios.post('/api/register', dataToSubmit).then(response =>
        response.data
    )
    return{
        type: REGISTER_USER ,
        payload: request
    }
}

export function auth(){

    const request = Axios.get('/api/auth').then(response =>
        response.data
    )
    return{
        type: AUTH_USER ,
        payload: request
    }
}
