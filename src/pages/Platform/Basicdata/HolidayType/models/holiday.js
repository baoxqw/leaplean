import {
  queryRole,
  newdatasss,
  addData,
  removenewdata,
} from '@/services/holiday';

import { message } from 'antd';

export default {
  namespace: 'holiday',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(newdatasss, payload);
   
      if (callback) callback(response);
    },
    *addData({ payload,callback }, { call, put }) {
      const response = yield call(addData, payload);
      if (callback) callback(response);
    },
    *removenewdata({ payload, callback }, { call, put }) {
      const response = yield call(removenewdata, payload);
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

  },
};
