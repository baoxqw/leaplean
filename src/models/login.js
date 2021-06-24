import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { requestLogin, requestLogout } from '@/services/user';
import storage from '@/utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    userinfo: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const data = yield call(requestLogin, payload);

      if (!data) return;
      const { sessionID, ...userinfo } = data;
      // 本地持久化 sessionID
      storage.set('sessionID', sessionID);
      storage.set('userinfo', userinfo);
      let indexPage = "";
      userinfo.roleList.map(item =>{
        indexPage = item.indexpage;
      })
      storage.set('indexPage', indexPage);
      // 角色权限设置
      const getAuthority = userData => {
        if (userData.rootFlag === 1) return ['admin'];
        return Array.prototype.map.call(userData.roleList, item => item.roleCode);
      };
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: getAuthority(userinfo),
          userinfo,
        },
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: userinfo,
      });

      reloadAuthorized();
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params;
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length);
      //     if (redirect.match(/^\/.*#/)) {
      //       redirect = redirect.substr(redirect.indexOf('#') + 1);
      //     }
      //   } else {
      //     window.location.href = redirect;
      //     return;
      //   }
      // }

      yield put(routerRedux.replace('/'));
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call }) {
      yield call(requestLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: undefined,
          currentAuthority: [],
        },
      });
      reloadAuthorized();

      // 清除本地数据
      storage.remove(['userinfo', 'sessionID']);

      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(
      state,
      {
        payload: { currentAuthority, ...rest },
      }
    ) {
      setAuthority(currentAuthority);
      return {
        ...state,
        ...rest,
      };
    },
  },
};
