import { MAKE_ROOM, GET_ROOM } from '../_actions/types'


export default function (state={}, action) {
    switch (action.type) {
        case MAKE_ROOM:
            return {...state, makeSuccess: action.payload} 
            break;
        case GET_ROOM:
            return {...state, getSuccess: action.payload} 
            break;
        default:
            return state;
    }
}