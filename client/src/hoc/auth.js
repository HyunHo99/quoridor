import React, { useEffect } from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action'
import { withRouter } from 'react-router'


export default function (SpecificComponent, loginUserOnly, prop, adminRoute = null){

    //null => 아무나 출입가능
    //true => 로그인한 유저만 출입가능
    //false => 로그인하지 않은 유저만 출입가능

    function AuthenticationCheck(props) {
        const dispatch = useDispatch()
        useEffect(() => {

            dispatch(auth()).then(response =>{
                //로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(loginUserOnly){
                        props.history.push('/login')
                    }
                }else{
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(loginUserOnly===false){
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent socket={prop.socket}/>
        )
    }
    return withRouter(AuthenticationCheck)
}