import {
  queryRole, fetchWork, addProtype,
  fetchArea, removeProtype, fetchStation
} from '@/services/protype';

import { message } from 'antd';

export default {
  namespace: 'protype',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
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
    *fetchWork({ payload, callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list:[],
        pagination:{
          total:0,
          current:1
        }
      }
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        });
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchArea({ payload, callback }, { call, put }) {
      const response = yield call(fetchArea, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list:[],
        pagination:{
          total:0,
          current:1
        }
      }
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        });
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchStation({ payload, callback }, { call, put }) {
      const response = yield call(fetchStation, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list:[],
        pagination:{
          total:0,
          current:1
        }
      }
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        });
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProtype, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeProtype, payload);
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
