import {
  queryStation, fetchProduct,
  addself, deleteSelf, addrepair, fetchrepair,
  deleteRepair,
} from '@/services/equipmanage';
import { queryWorktype } from '@/services/bType';
import { newdataPer, queryPersonal } from '@/services/api';
import { fetchRepairPiece, addpeice, deletepeice } from '@/services/EMA';
import { matype, queryMatemanage } from '@/services/material';

export default {
  namespace: 'EMA',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchProduct({ payload }, { call, put }) {
      const response = yield call(fetchProduct, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      const { pageIndex = 0 } = payload;
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
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
        type: 'save',
        payload: obj,
      });
    },
    *fetchRepairPiece({ payload, callback }, { call, put }) {
      const response = yield call(fetchRepairPiece, payload);
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
      if (callback) callback(obj);
      yield put({
        type: 'savepiece',
        payload: obj,
      });
    },
    *fetchrepair({ payload, callback }, { call, put }) {
      const response = yield call(fetchrepair, payload);
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
        })
      }
      if (callback) callback(response);
    },
    *deleteRepair({ payload, callback }, { call, put }) {
      const response = yield call(deleteRepair, payload);
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
    *fetchHitch({ payload, callback }, { call, put }) {
      const response = yield call(queryWorktype, payload);
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

      if (callback) callback(obj);
    },
    *addself({ payload, callback }, { call, put }) {
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *addrepair({ payload, callback }, { call, put }) {
      const response = yield call(addrepair, payload);
      if (callback) callback(response);
    },
    *deleteSelf({ payload, callback }, { call, put }) {
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *deletepeice({ payload, callback }, { call, put }) {
      const response = yield call(deletepeice, payload);
      if (callback) callback(response);
    },
    *addpeice({ payload, callback }, { call, put }) {
      const response = yield call(addpeice, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
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

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savepiece(state, action) {
      return {
        ...state,
        datapiece: action.payload,
      };
    },
  },
};
