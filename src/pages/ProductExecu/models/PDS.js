import {
  queryStation, findprocess, findprocessChild, findprocessSuper,
  fetchtable, addSuperData, setStatus
} from '@/services/productexecu';
import { matype, queryMatemanage } from '@/services/material';
import { Processperson } from '@/services/PDS';
export default {
  namespace: 'PDS',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataChild: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      const pageIndex = payload.pageIndex;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *findprocess({ payload, callback }, { call, put }) {
      const response = yield call(findprocessSuper, payload);
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
      if (callback) callback(obj)
    },
    *findprocessstatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchtable, payload);
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
        type: 'child',
        payload: obj,
      });
    },
    *findprocessChild({ payload, callback }, { call, put }) {
      const response = yield call(findprocessChild, payload);
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
        type: 'child',
        payload: obj,
      });
    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
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
        })
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
    *Processperson({ payload, callback }, { call, put }) {
      const response = yield call(Processperson, payload);
      if (callback) callback(response)
    },
    *addSuperData({ payload, callback }, { call, put }) {
      const response = yield call(addSuperData, payload);
      if (callback) callback(response);
    },
    *setStatus({ payload, callback }, { call, put }) {
      const response = yield call(setStatus, payload);
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
    child(state, action) {
      return {
        ...state,
        dataChild: action.payload,
      };
    },
    saveassign(state, action) {
      return {
        ...state,
        dataassign: action.payload,
      };
    },
  },
};
