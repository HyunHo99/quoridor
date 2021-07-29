import React from 'react'
import Win_image from '../../../images/win.png'
import {Button} from "antd"
import { withRouter } from 'react-router'
function WinPage(props) {
    return (
        <div style={{textAlign: 'center',paddingTop: '10vh'}}>
        <img style={{width: '50vh', height: '50vh'}} src={Win_image}></img>
        <p style={{fontSize: '5vh'}}>
            이겼닭! 오늘 저녁은 치킨이닭!</p>
        <Button size="large" onClick={() => props.history.push('/')}>다음 희생양 찾으러 가기</Button>
    </div>
    )
}

export default withRouter(WinPage)
