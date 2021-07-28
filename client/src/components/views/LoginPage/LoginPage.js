import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


function LoginPage(props) {
const [state, setState] =  useState({ collapsed : true})
const dispatch = useDispatch()
const [Email, setEmail] = useState("")
const [Password, setPassword] = useState("")


const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
}

const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
}

const onSubmitHandler = () => {
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
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

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

    const toLogin = () =>{
    props.history.push("/login")
    }

    const onCollapse = collapsed => {
    console.log(collapsed);
    setState({ collapsed });
  };
  console.log(props.history)

    const { collapsed } = state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" mode="inline">
          <Menu.Item key="1" onClick={()=>{props.history.push("/")}}  icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item onClick={toLogin} key="2">로그인</Menu.Item>
              <Menu.Item onClick={onClickHandler}key="3">로그아웃</Menu.Item>
              <Menu.Item onClick={toRegister}key="4">회원가입</Menu.Item>
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
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onSubmitHandler}
                onFinishFailed={onFinishFailed}
              >

                <Form.Item
                  label="ID"
                  name="Email"
                  rules={[{ required: true, message: 'Please input your ID!' }]}
                >
                  <Input value={Email} onChange={onEmailHandler} />
                </Form.Item>

                <Form.Item
                  label="password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password value={Password} onChange={onPasswordHandler} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  
                </Form.Item>
              </Form>
        </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }

export default withRouter(LoginPage)
