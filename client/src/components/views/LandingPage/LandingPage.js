import React from 'react'
import Axios from 'axios'
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

class LandingPage extends React.Component {
  state = {
    collapsed: false,
  };
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
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item onClick={this.toLogin} key="1">로그인</Menu.Item>
              <Menu.Item onClick={this.onClickHandler}key="2">로그아웃</Menu.Item>
              <Menu.Item onClick={this.toRegister}key="3">회원가입</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}


export default withRouter(LandingPage)
