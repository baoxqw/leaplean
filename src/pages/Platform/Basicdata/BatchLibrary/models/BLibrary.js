import { queryBatch,adddevice,removedevice} from '@/services/BLibrary';
import {  matype, queryMatemanage } from '@/services/material';
import { message } from 'antd';

export default {
  namespace: 'BLibrary',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(queryBatch, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *add({ payload,callback}, { call, put }) {
      const response = yield call(adddevice, payload);
      if(callback) callback(response)
    },
    *remove({ payload,callback}, { call, put }) {
      const response = yield call(removedevice, payload);
      if(callback) callback(response)
    },
    *matype({ payload,callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload,callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if(callback) callback(obj)
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
