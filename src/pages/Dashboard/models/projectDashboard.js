import {
  fetchProjectDashboard ,
  fetchUserDashboard,
  fetchUserScheduled,

} from '@/services/analysis';
import {
  fetchWork,
  fetchWorkChild,
  ppProductOrder
} from '@/services/protype';
import { queryRole } from '@/services/api';
import { routerRedux } from 'dva/router';
import { queryStation,fetchTest, } from '@/services/planfor';

export default {
  namespace: 'projectDashboard',

  state: {
    dashboardData: {
      fundnet: 0,
      userSchedule:[],
      projectCount: 0,
      invest: {
        count: 0,
        investInStatistics: [],
        investOutStatistics: [],
      },
      roi: {
        week: 0,
        day: 0,
        average: 0,
        statistics: [],
      },
    },
  },

  effects: {
    // 获取用户面板数据
    *fetchUserDashboard(_, { call, put }) {
      const { resData } = yield call(fetchUserDashboard);

      yield put({
        type: 'setUserDashboard',
        payload: resData[0],
      });
    },
    // 获取用户日程
    *fetchUserScheduled({ payload,callback }, { call, put }) {
      const { resData } = yield call(fetchUserScheduled, payload);
      yield put({
        type: 'setUserSchedule',
        payload: resData,
      });

      if (callback) callback(resData);
    },
    *fetchProjectDashboard(_, { call, put, select }) {
      const { fundnet, invest, projectCount, roi } = yield call(fetchProjectDashboard);

      const dashboardData = yield select(({ projectDashboard }) => projectDashboard.dashboardData);
      let result = dashboardData;
      if (fundnet) {
        result = { ...result, fundnet };
      }
      if (invest) {
        result = { ...result, invest };
      }
      if (projectCount) {
        result = { ...result, projectCount };
      }
      if (roi) {
        result = { ...result, roi };
      }

      yield put({
        type: 'setProjectDashboard',
        payload: result,
      });
    },
    *fetchWork({ payload,callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if(callback) callback(obj);
    },
    *fetchWorkChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchWorkChild, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if(callback) callback(obj);
    },
    *ppProductOrder({ payload,callback }, { call, put }) {
      const response = yield call(ppProductOrder, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if(callback) callback(obj);
    },
    *fetch23({ payload,callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      if(callback) callback(response);
    },
    *loginUser({ payload,callback }, { call, put }) {
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
    *queryOrderProduct({ payload,callback }, { call, put }) {
      const response = yield call(queryStation, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if(callback) callback(obj);
    },
    *fetchTest({ payload,callback }, { call, put }) {
      const response = yield call(fetchTest, payload);
      if(callback) callback(response);
    },
  },

  reducers: {
    setProjectDashboard(state, { payload: dashboardData }) {
      return {
        ...state,
        dashboardData,
      };
    },
    setUserSchedule(state, { payload: userSchedule }) {
      return { ...state, userSchedule };
    },
    setUserDashboard(state, { payload: userDashboard }) {
      return {
        ...state,
        userDashboard,
      };
    },
  },
};
