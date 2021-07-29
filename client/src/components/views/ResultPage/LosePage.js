import React from 'react'
import Lose_image from '../../../images/lose.png'
import {Button} from "antd"
import { withRouter } from 'react-router'

function LosePage(props) {
    return (
        <div style={{textAlign: 'center',paddingTop: '10vh'}}>
            <img style={{width: '50vh', height: '50vh'}} src={Lose_image}></img>
            <p style={{fontSize: '5vh'}}>
                패배하셨습니다...
            하지만 다음에는 이길 수 있을거에요!</p>
            <Button size="large" onClick={() => props.history.push('/')}>내일 저녁은 치킨이닭!</Button>
        </div>
    )
}

export default withRouter(LosePage)
