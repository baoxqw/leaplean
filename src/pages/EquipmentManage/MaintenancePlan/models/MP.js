import {
  queryMP, addMP, deleteMP, childFetch,
  addChild, childFetchList, childFetchListEnd,
  findprojectdata, addChildComme, addend, deleteend,
} from '@/services/MP';
import { newdataPer, queryPersonal } from '@/services/api';
import { queryDC } from '@/services/DC';

export default {
  namespace: 'MP',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMP, payload);
      let { pageIndex = 0 } = payload;
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
        });
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
    *childFetch({ payload, callback }, { call, put }) {
      const response = yield call(childFetch, payload);
      let { pageIndex = 0 } = payload;
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
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj)
    },
    *findprojectdata({ payload, callback }, { call, put }) {
      const response = yield call(findprojectdata, payload);
      let { pageIndex = 0 } = payload;
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
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }

      if (callback) callback(obj)
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *deleteend({ payload, callback }, { call, put }) {
      const response = yield call(deleteend, payload);
      if (callback) callback(response);
    },
    *addMP({ payload, callback }, { call, put }) {
      const response = yield call(addMP, payload);
      if (callback) callback(response);
    },
    *addChildComme({ payload, callback }, { call, put }) {
      const response = yield call(addChildComme, payload);
      if (callback) callback(response);
    },
    *addChild({ payload, callback }, { call, put }) {
      const response = yield call(addChild, payload);

      if (callback) callback(response);
    },
    *childFetchList({ payload, callback }, { call, put }) {
      const response = yield call(childFetchList, payload);
      let obj = []
      if (response.resData) {
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *childFetchListEnd({ payload, callback }, { call, put }) {
      const response = yield call(childFetchListEnd, payload);
      let { pageIndex = 0 } = payload;
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
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      yield put({
        type: 'saveend',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteMP, payload);
      if (callback) callback(response);
    },
    *addend({ payload, callback }, { call, put }) {
      const response = yield call(addend, payload);
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
    *fetchStatus({ payload, callback }, { call, put }) {
      const response = yield call(queryDC, payload);
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
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
    saveend(state, action) {
      return {
        ...state,
        dateend: action.payload,
      };
    },
  },
};
