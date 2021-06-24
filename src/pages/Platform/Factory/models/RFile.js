import {
  queryRole,
  removenewdata,
  fetchstore,
  deletestore,
  findrespository,
  addData,
  addstore,
  quickAdd
} from '@/services/RFile';
import { newdataPer, queryPersonal } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'RFile',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      const { pageIndex = 0 } = payload;
      let obj = []
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchstore({ payload, callback }, { call, put }) {
      const response = yield call(fetchstore, payload);
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
            current: pageIndex + 1
          }
        };
      }
      yield put({
        type: 'savestore',
        payload: obj,
      });
      if (callback) callback(obj)
    },
    *removenewdata({ payload, callback }, { call, put }) {
      const response = yield call(removenewdata, payload);
      if (callback) callback(response);
    },
    *deletestore({ payload, callback }, { call, put }) {
      const response = yield call(deletestore, payload);
      if (callback) callback(response);
    },
    *addstore({ payload, callback }, { call, put }) {
      const response = yield call(addstore, payload);
      if (callback) callback(response);
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *fetchTable({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj)
    },
    *findrespository({ payload, callback }, { call, put }) {
      const response = yield call(findrespository, payload);
      if (callback) callback(response);
    },
    *addData({ payload, callback }, { call, put }) {
      const response = yield call(addData, payload);
      if (callback) callback(response);
    },
    *quickAdd({ payload, callback }, { call, put }) {
      const response = yield call(quickAdd, payload);
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
    savestore(state, action) {
      return {
        ...state,
        datastore: action.payload,
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
