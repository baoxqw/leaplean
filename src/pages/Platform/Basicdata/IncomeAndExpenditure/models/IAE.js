import { queryIAE,fetchTree,removenewdata,addData } from '@/services/IAE';

import { message } from 'antd';

export default {
  namespace: 'IAE',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryIAE, payload);
     
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
      if (callback) callback(response);
    },
    *removenewdata({ payload, callback }, { call, put }) {
      const response = yield call(removenewdata, payload);
      if (callback) callback(response);
    },
    *addData({ payload, callback }, { call, put }) {
      const response = yield call(addData, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
