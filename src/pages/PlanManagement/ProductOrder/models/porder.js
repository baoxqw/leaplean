import {
  queryStation, findbom, findSmall, findrout,
  addproduct, addProder, deleteProder, materialIdRout,
  findChild, batchadd, changest,materailSet
} from '@/services/planfor';
import { fetchUcum, matype, queryMatemanage } from '@/services/material';
import { fetchWork } from '@/services/workline';
import { fetchPerson, newdataPer, queryPersonal } from '@/services/api';
import { addWuLiao, addPersonal, findNum,materailIssue } from '@/services/porder';
export default {
  namespace: 'porder',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataNum: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      console.log("订单",response)
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *findNum({ payload, callback }, { call, put }) {
      const response = yield call(findNum, payload);
      console.log("response",response)
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
        response.resData.map(item => {
          if (!item.amount) {
            item.amount = 0;
          }
          item.key = item.id;
          item.stock = item.amount;
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
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *materailSet({ payload, callback }, { call, put }) {
      const response = yield call(materailSet, payload);
      if (callback) callback(response);
    },
    *changest({ payload, callback }, { call, put }) {
      const response = yield call(changest, payload);
      if (callback) callback(response);
    },
    *fetchonPerson({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *addproduct({ payload, callback }, { call, put }) {
      const response = yield call(addproduct, payload);
      if (callback) callback(response);
    },
    *findSmall({ payload, callback }, { call, put }) {
      const response = yield call(findSmall, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
        type: 'small',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *findbom({ payload, callback }, { call, put }) {
      const response = yield call(findbom, payload);
      if (callback) callback(response);
    },
    *findrout({ payload, callback }, { call, put }) {
      const response = yield call(findrout, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *fetchTable({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *addOrder({ payload, callback }, { call, put }) {
      const response = yield call(addProder, payload);

      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteProder, payload);
      if (callback) callback(response);
    },
    *fetchWork({ payload, callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *materialId({ payload, callback }, { call, put }) {
      const response = yield call(materialIdRout, payload);
      if (callback) callback(response)
    },
    *findChild({ payload, callback }, { call, put }) {
      const response = yield call(findChild, payload);
      if (callback) callback(response)
    },
    *batchadd({ payload, callback }, { call, put }) {
      const response = yield call(batchadd, payload);
      if (callback) callback(response)
    },
    *fetchUcum({ payload, callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *addWuLiao({ payload, callback }, { call, put }) {
      const response = yield call(addWuLiao, payload);
      if (callback) callback(response);
    },
    *fetchPerson({ payload, callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
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
    *addadd({ payload, callback }, { call, put }) {
      const response = yield call(addPersonal, payload);
      if (callback) callback(response)
    },
    *materailIssue({ payload, callback }, { call, put }) {
      const response = yield call(materailIssue, payload);
      console.log('materailIssue',response)
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
    small(state, action) {
      return {
        ...state,
        smalldata: action.payload,
      };
    },
    saveNum(state, action) {
      return {
        ...state,
        dataNum: action.payload,
      };
    },
  },
};
