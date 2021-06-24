import React, { Suspense } from 'react';
import { Layout,Tabs,Dropdown,Menu,Icon  } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';
import storage from '@/utils/storage'
import styles from './BasicLayout.less';
import { toTree,dataAddPath } from '@/pages/tool/ToTree';
import router from 'umi/router';
import { Route } from 'react-router-dom';
// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
const { TabPane } = Tabs;


class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    //获取所有已存在key值
    this.state = ({
      tabList:[],
      tabListKey:[],
      activeKey:"",
      tabListArr:[],
      routeKey:"",
    })

    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    // dispatch({
    //   type: 'user/fetchCurrent',
    // });
    dispatch({
      type: 'setting/getSetting',
    });

    const userinfo = storage.get("userinfo");
    if(!userinfo){
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes:[],authority },
      });
      return
    }
    const menuList = userinfo.menuList || [];
    const menu = toTree(menuList);
    const menuPath = dataAddPath(menu);
    const roleList = userinfo.roleList;
    let status = false;
    if(roleList){
      for(let i=0;i<roleList.length;i++){
        if(roleList[i].roleCode === 'corpadmin'){
          status = true;
        }
      }
    }
    if(status){
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes,authority },
      });
      this.setData(routes)
    }else{
      this.setData2(routes,menuPath)
      const list = this.getTreeData(routes,menuPath)
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes:list,authority },
      });
    }
  }

  getTreeData = (routes,menu)=>{
    const indexPage = storage.get("indexPage");
    const list = [];
    const routesList = this.setDataTree1(routes);
    const menuList = this.setDataTree2(menu);
    routesList.forEach(item =>{
      menuList.forEach(it =>{
        if(item.path === it.url){
          list.push({
            ...it,
            path:it.url,
            component:item.component,
            exact:item.exact
          })
        }
      })
    })
    routesList.forEach(item =>{
      if(item.path === indexPage){
        list.unshift({
          ...item,
          id:0
        })
      }
    })
    return toTree(list);
  }

  setDataTree1 = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = data => {
      data.forEach(node => {
        if(node.path){
          treeList.push(node);
        }
        if (node.routes && node.routes.length > 0) {
          getTreeList(node.routes);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  setDataTree2 = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = data => {
      data.forEach(node => {
        if(node){
          treeList.push(node);
        }
        if (node.children && node.children.length > 0) {
          getTreeList(node.children);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  setData = (routes)=>{
    const routeKey = '/dashboard/projectDashboard'
    const tabName = '首页';
    const tabLists = this.updateTree(routes);
    let tabList=[]
    let tabListArr=[];
    tabLists.map((v) => {
      if(v.key === routeKey){
        if(tabList.length === 0){
          v.closable = false
          v.tab = tabName
          tabList.push(v);
        }
      }
      if(v.key){
        tabListArr.push(v.key)
      }
    });
    this.setState({
      tabList,
      tabListKey:[routeKey],
      activeKey:routeKey,
      tabListArr,
      routeKey
    })
  }

  setData2 = (routes,menu)=>{
    const routeKey = storage.get("indexPage") || "/dashboard/projectDashboard";
    const tabName = '首页';
    const tabLists = this.updateTree(routes);
    menu.push({
      name:"首页",
      url:routeKey
    })
    const menuList = this.updateTree2(menu);
    const list = []
    tabLists.forEach(item =>{
      menuList.forEach(it=>{
        if(item.key === it.key){
          list.push(item)
        }
      })
    })
    let tabList=[]
    let tabListArr=[];
    list.forEach((v) => {
      if(v.key === routeKey){
        if(tabList.length === 0){
          v.closable = false
          v.tab = tabName
          tabList.push(v);
        }
      }
      if(v.key){
        tabListArr.push(v.key)
      }
    });
    this.setState({
      tabList,
      tabListKey:[routeKey],
      activeKey:routeKey,
      tabListArr,
      routeKey
    })
  }

  updateTree = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = data => {
      data.forEach(node => {
        if(!node.level){
          treeList.push({ tab: node.name, key: node.path,locale:node.locale,closable:true,content:node.component });
        }
        if (node.routes && node.routes.length > 0) { //!node.hideChildrenInMenu &&
          getTreeList(node.routes);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  updateTree2 = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = data => {
      data.forEach(node => {
        if(!node.level){
          treeList.push({ tab: node.name, key: node.url,locale:node.locale,closable:true,content:node.component });
        }
        if (node.children && node.children.length > 0) { //!node.hideChildrenInMenu &&
          getTreeList(node.children);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  activeStatus = true;

  componentDidUpdate(preProps) {
    const { collapsed, isMobile,menuData,location:{ pathname } } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
    //从其他地方点击跳转时
    if(this.activeStatus){
      const { tabList,tabListKey } = this.state;
      const tabLists = this.updateTreeList(menuData);
      this.setState({
        activeKey:pathname
      })
      tabLists.map((v) => {
        if(v.key === pathname){
          if(tabList.length === 0){
            v.closable = false
            this.setState({
              tabList:[...tabList,v]
            })
          }else{
            if(!tabListKey.includes(pathname)){
              const {closable, content, locale, tab} = v;
              this.setState({
                tabList:[...tabList,{ closable, content, key:pathname, locale, tab }],
                tabListKey:[...tabListKey, pathname]
              })
            }
          }
        }
      })
    }
    this.activeStatus = true;
  }

  getContext() {
    const { location, breadcrumbNameMap, menuData } = this.props;
    return {
      location,
      breadcrumbNameMap,
      menuData,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return '智能网络协同制造系统';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });


    return `${pageName} - 智能网络协同制造系统`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    // 下面注释的是右侧栏全局设置工具
    // return <SettingDrawer />;
  };

  //截取路由 '/a/b/1'
  StringToRoute = ( v ) => {
    const str = /\/:(.+)/g
    const key = v.replace(str,(_,g)=>'')
    const keyArr = key.split('/')
    const keyString = [keyArr[0],keyArr[1],keyArr[2]]
    return (keyString.toString()).replace(/,/g,'/')
  }

  onHandlePage = ( e ) =>{//点击左侧菜单
    const { menuData } = this.props
    let { key, title='' } = e
    const tabLists = this.updateTreeList(menuData);
    const {tabListKey, tabList, tabListArr} =  this.state;
    if(tabListArr.includes(key)){
      router.push({pathname:key})
    }else{
      key = '/exception/404'
      router.push({pathname:'/exception/404'}) //不存在路由 404
    }

    this.setState({
      activeKey:key
    })

    tabLists.map((v,i) => {
      if(v.key === key){
        if(tabList.length === 0){
          v.closable = false
          this.setState({
            tabList:[...tabList,v]
          })
        }else{
          if(!tabListKey.includes(key)){
            const {closable, content, locale, tab} = v;
            this.setState({
              tabList:[...tabList,{ closable, content, key, locale, tab: !title ? tab : title }],
              tabListKey:[...tabListKey, key]
            })
          }
        }
      }
    })
    // this.setState({
    //   tabListKey:this.state.tabList.map((va)=>va.key)
    // })
  }
  // 切换 tab页 router.push(key);
  onChange = key => {
    this.setState({ activeKey:key });
    router.push(key)
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove = (targetKey) => {
    let {activeKey} = this.state;
    let lastIndex;
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const tabList = [],tabListKey=[]
    this.state.tabList.map(pane => {
      if(pane.key !== targetKey){
        tabList.push(pane)
        tabListKey.push(pane.key)
      }
    });
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = tabList[lastIndex].key;
    }
    router.push(activeKey)
    this.setState({ tabList, activeKey,tabListKey });
  }

  updateTreeList = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = data => {
      data.forEach(node => {
        if(!node.level){
          treeList.push({ tab: node.name, key: node.path,locale:node.locale,closable:true,content:node.component });
        }
        if (node.children && node.children.length > 0) { //!node.hideChildrenInMenu &&
          getTreeList(node.children);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  onClickHover=(e)=>{
    let { key } = e,{activeKey,tabList,tabListKey,routeKey} = this.state;
    if(key === '1'){
      tabList= tabList.filter((v)=>v.key !== activeKey || v.key === routeKey)
      tabListKey = tabListKey.filter((v)=>v !== activeKey || v === routeKey)
      this.setState({
        activeKey:routeKey,
        tabList,
        tabListKey
      })
    }else if(key === '2'){
      tabList= tabList.filter((v)=>v.key === activeKey || v.key === routeKey)
      tabListKey = tabListKey.filter((v)=>v === activeKey || v === routeKey)
      this.setState({
        activeKey,
        tabList,
        tabListKey
      })
    }else if(key === '3'){
      tabList= tabList.filter((v)=>v.key === routeKey)
      tabListKey = tabListKey.filter((v)=>v === routeKey)
      this.setState({
        activeKey:routeKey,
        tabList,
        tabListKey
      })
    }
    this.activeStatus = false;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
      hidenAntTabs
    } = this.props;
    let {activeKey,routeKey} = this.state;
    if(pathname === '/'){
      // router.push(routeKey)
      activeKey = routeKey
    }

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前标签页</Menu.Item>
        <Menu.Item key="2">关闭其他标签页</Menu.Item>
        <Menu.Item key="3">关闭全部标签页</Menu.Item>
      </Menu>
    );
    const operations = (
      <Dropdown overlay={menu} >
        <a className="ant-dropdown-link" style={{marginRight:8}}>
          操作<Icon type="down" />
        </a>
      </Dropdown>
    );

    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
            onHandlePage ={this.onHandlePage}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {hidenAntTabs ?
              (<Authorized authority={routerConfig} noMatch={<Exception403 />}>
                {children}
              </Authorized>) :
              (this.state.tabList && this.state.tabList.length ? (
                <Tabs
                  //className={styles.tabs}
                  activeKey={activeKey}
                  onChange={this.onChange}
                  tabBarExtraContent={operations}
                  tabBarStyle={{background:'#fff'}}
                  tabPosition="top"
                  tabBarGutter={-1}
                  hideAdd
                  type="editable-card"
                  onEdit={this.onEdit}
                >
                  {this.state.tabList.map(item => (
                    <TabPane tab={item.tab} key={item.key} closable={item.closable}>
                      <Authorized  noMatch={<Exception403 />}>
                        {/*{item.content}*/}
                        <Route key={item.key} path={item.path} component={item.content} exact={item.exact} />
                      </Authorized>
                    </TabPane>
                  ))}
                </Tabs>
              ) : null)}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu,findRoles }) => ({
  collapsed: global.collapsed ,
  activeStatus: global.activeStatus ,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
