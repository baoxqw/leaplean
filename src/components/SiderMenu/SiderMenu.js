import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      status:false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  status = false

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        if(item.children){
          item.children.map(item=>{
            if(item.key === key || item.path === key){
              this.status = true
              console.log("status",this.status)
            }
          });
          this.setState({
            status
          })
        }
        return item.key === key || item.path === key
      }
      console.log("status",this.status)
      return false;
    });
  };

  handleOpenChange = openKeys => {
    openKeys = openKeys.filter(item=>item!==undefined);
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    if(this.status){
      let str = openKeys.pop();
      if(str && str.indexOf(openKeys[0]) !== -1){
        const keyLength = str.split("/").length;
        openKeys = openKeys.filter(item => item.split("/").length !== keyLength)
        openKeys = [...openKeys,str]
      }else{
        openKeys = [str]
      }
      this.setState({
        openKeys
      });
      return
    }

    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={215}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" style={{height:'28px'}}/><span style={{fontSize:12}}>智能网络协同制造系统</span>
          </Link>
        </div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
