import { queryDC, addDC, deleteDC, childFetch, deleteChild, addChild, fetchWorkunit, childFetchListEnd } from '@/services/DC';
import { queryRole } from '@/services/dstatus';
import { newdataPer, queryPersonal } from '@/services/api';
import { queryEC } from '@/services/EC';

export default {
  namespace: 'DC',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDC, payload);
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
          return item
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
    *fetchStatus({ payload, callback }, { call, put }) {
      const response = yield call(queryRole, payload);
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
      yield put({
        type: 'childfetch',
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
      if (callback) callback(obj);
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
    *fetchWorkunit({ payload, callback }, { call, put }) {
      const response = yield call(fetchWorkunit, payload);
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
    *fetchEC({ payload, callback }, { call, put }) {
      const response = yield call(queryEC, payload);

      if (callback) callback(response)
    },
    *addDC({ payload, callback }, { call, put }) {
      const response = yield call(addDC, payload);

      if (callback) callback(response)
    },
    *addChild({ payload, callback }, { call, put }) {
      const response = yield call(addChild, payload);
      if (callback) callback(response)
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteDC, payload);

      if (callback) callback(response)
    },
    *deleteChild({ payload, callback }, { call, put }) {
      const response = yield call(deleteChild, payload);

      if (callback) callback(response)
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
    childfetch(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
