import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
//import { roles } from '@/../config/routesAuthority.config';
import storage from '@/utils/storage';
const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

// 根据权限跳转首页
const IndexPage = ({ children, location }) => {
  if (location.pathname === '/') {
    let indexPage = '/dashboard/projectDashboard'; // 默认管理员统计页面
    const index = storage.get('indexPage');
    if(index){
      indexPage = index;
    }
    /*// 查看角色是否配置 index, 并且设置 index 页面
    getAuthority().forEach(item => {
      /!*const role = roles[item];
      if (role && role.index) {
        indexPage = role.index;
      }*!/
      console.log("item",item)
    });*/
    return <Redirect to={indexPage} />;
  }
  return children;

  // if (location.pathname === '/') {
  //     Authority.find
  //   return getAuthority().includes('admin') ? (
  //     <Redirect to="/dashboard/projectDashboard" />
  //   ) : (
  //     <Redirect to="/account/center" />
  //   );
  // }
  // return children;
};

export default ({ children, ...props }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    <IndexPage {...props}>{children}</IndexPage>
  </Authorized>
);
