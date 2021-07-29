import React from 'react'
import Axios from 'axios'
import { withRouter } from 'react-router'
import { Layout, Menu, Breadcrumb,Button } from 'antd';
import Modal from '../../modal/Modal';
import MakeRoom from './MakeRoom';
import Rooms from "./Rooms"

import "./LandingPage.css"

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


class LandingPage extends React.Component {
  
  state = {
    collapsed: true,
    modalOpen: false
  };


  openModal = () => {
    this.setState({ modalOpen: true })
  }
  closeModal = () => {
      this.setState({ modalOpen: false })
  }

  onClickHandler = () =>{
    Axios.get('/api/logout')
        .then( response =>{
            if(response.data.success){
                this.props.history.push("/login")
            }else{
                alert("로그아웃 실패")
            }
        })
    }

  toRegister = () =>{
    this.props.history.push("/register")
    }

  toLogin = () =>{
    this.props.history.push("/login")
    }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    localStorage.clear();
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" mode="inline">
          <Menu.Item onClick={()=>{this.props.history.push("/")}}  key="1" icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item onClick={this.toLogin} key="2">로그인</Menu.Item>
              <Menu.Item onClick={this.onClickHandler}key="3">로그아웃</Menu.Item>
              <Menu.Item onClick={this.toRegister}key="4">회원가입</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>   
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
            </Breadcrumb>
            <React.Fragment>
            <Button size="large" className = "button" onClick={ this.openModal }>방 만들기</Button>
            <Modal open={ this.state.modalOpen } close={ this.closeModal } header="Create a game room">
                    <MakeRoom socket={this.props.socket}/>
              </Modal>
              </React.Fragment>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Rooms socket={this.props.socket}/>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}


export default withRouter(LandingPage)
