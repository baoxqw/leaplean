
import { queryTask, childSourceQuery, changeStatus,addMerge,workList,childFetchProduct,addLower } from '@/services/TaskM';

import { childFetch } from '@/services/pfor';

export default {
  namespace: 'TaskM',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    sourceData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTask, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
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
        type: 'save',
        payload: obj,
      });
    },
    *childFetchProduct({ payload, callback }, { call, put }) {
      const response = yield call(childFetchProduct, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
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
      if (callback) callback(obj);
      // yield put({
      //   type: 'saveProduct',
      //   payload: obj,
      // });
    },
    *childSourceQuery({ payload, callback }, { call, put }) {
      const response = yield call(childSourceQuery, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
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
      if (callback) callback(obj);
      // yield put({
      //   type: 'source',
      //   payload: obj,
      // });
    },
    *childFetch({ payload, callback }, { call, put }) {
      const response = yield call(childFetch, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
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
      if (callback) callback(obj);
    },
    *addMerge({ payload, callback }, { call, put }) {
      const response = yield call(addMerge, payload);
      if (callback) callback(response);
    },
    *addLower({ payload, callback }, { call, put }) {
      const response = yield call(addLower, payload);
      if (callback) callback(response);
    },
    *changeStatus({ payload, callback }, { call, put }) {
      const response = yield call(changeStatus, payload);
      if (callback) callback(response);
    },
    *workList({ payload, callback }, { call, put }) {
      const response = yield call(workList, payload);
      const { pageIndex = 0 } = payload;
      let obj ={
        list:[],
        pagination: {
          total: 0,
          current: 1
        }
      };
      if (response.resData) {
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
      if (callback) callback(obj);
    },
    *originFetch({ payload, callback }, { call, put }) {
      const response = yield call(originFetch, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
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
      if (callback) callback(obj);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    source(state, action) {
      return {
        ...state,
        sourceData: action.payload,
      };
    },
    saveProduct(state, action) {
      return {
        ...state,
        productData: action.payload,
      };
    },
  },
};
