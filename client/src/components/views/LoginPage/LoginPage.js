import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


function LoginPage(props) {
const [state, setState] =  useState({ collapsed : false})
const dispatch = useDispatch()
const [Email, setEmail] = useState("")
const [Password, setPassword] = useState("")

const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
}

const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
}

const onSubmitHandler = (event) => {
    event.preventDefault()
    let body = {
        email: Email,
        password: Password
    }
    dispatch(loginUser(body))
        .then(response =>{
            if(response.payload.loginSuccess){
                props.history.push("/")
            } else{
                alert('error')
            }
        })
}

  const onClickHandler = () =>{
    Axios.get('/api/logout')
        .then( response =>{
            if(response.data.success){
                props.history.push("/login")
            }else{
                alert("로그인 되어있지 않습니다.")
            }
        })
    }

    const toRegister = () =>{
    props.history.push("/register")
    }

    const  toLogin = () =>{
    props.history.push("/login")
    }

    const onCollapse = collapsed => {
    console.log(collapsed);
    setState({ collapsed });
  };

    const { collapsed } = state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item onClick={toLogin} key="1">로그인</Menu.Item>
              <Menu.Item onClick={onClickHandler}key="2">로그아웃</Menu.Item>
              <Menu.Item onClick={toRegister}key="3">회원가입</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height:'100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }

export default withRouter(LoginPage)
