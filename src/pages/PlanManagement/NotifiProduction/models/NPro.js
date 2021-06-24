import { queryPro,addProduct,findtree,fetchMata,deleteProduct } from '@/services/NPro';
import { newdataPer, queryPersonal } from '@/services/api';
import { fetchMataCon, matype } from '@/services/material';

export default {
  namespace: 'NPro',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPro, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProduct, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteProduct, payload);
      if (callback) callback(response);
    },
    *findtree({ payload, callback }, { call, put }) {
      const response = yield call(findtree, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(fetchMata, payload);
      console.log('--',response)
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
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
    *fetchTable({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
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
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *fetchMataCon({ payload, callback }, { call, put }) {
      const response = yield call(fetchMataCon, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        },
      };
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
      if (callback) callback(obj)
    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response)
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
