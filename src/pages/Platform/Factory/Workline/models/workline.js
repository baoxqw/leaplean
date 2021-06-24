import { queryLine, fetchWorkCon, addLine, deleteLine, fetchMaterial,fetchWorkConditions,queryChild,childAdd,childDelete } from '@/services/workline';
import { matype, queryMatemanage, fetchMataCon,queryConditions } from '@/services/material';

export default {
  namespace: 'workline',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryLine, payload);
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
    *queryChild({ payload,callback }, { call, put }) {
      const response = yield call(queryChild, payload);
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
    *fetchWorkCon({ payload, callback }, { call, put }) {
      const response = yield call(fetchWorkCon, payload);
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
      if (callback) callback(obj);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addLine, payload);
      if (callback) callback(response)
    },
    *childAdd({ payload, callback }, { call, put }) {
      const response = yield call(childAdd, payload);
      if (callback) callback(response)
    },
    *childDelete({ payload, callback }, { call, put }) {
      const response = yield call(childDelete, payload);
      if (callback) callback(response)
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteLine, payload);
      if (callback) callback(response)
    },
    *fetchMaterial({ payload, callback }, { call, put }) {
      const response = yield call(fetchMaterial, payload);
      if (callback) callback(response.resData)
    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
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
    *fetchMataCon({ payload, callback }, { call, put }) {
      const response = yield call(fetchMataCon, payload);
      console.log("r",response)
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
    *queryConditions({ payload, callback }, { call, put }) {
      const response = yield call(queryConditions, payload);
      console.log("r",response)
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
    *fetchWorkConditions({ payload, callback }, { call, put }) {
      const response = yield call(fetchWorkConditions, payload);
      console.log("r",response)
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
