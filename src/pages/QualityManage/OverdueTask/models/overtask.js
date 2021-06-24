import { queryStation,addself,deleteSelf,childFetch,addchild,deleteChild } from '@/services/overtask';
import {  matype, queryMatemanage } from '@/services/material';
import { newdataPer, queryPersonal } from '@/services/api';
export default {
  namespace: 'overtask',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      const { pageIndex = 0 } = payload;
      if(response.resData){
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
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *fetchTable({ payload,callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
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
    *addself({payload,callback},{call,put}){
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *addchild({payload,callback},{call,put}){
      const response = yield call(addchild, payload);
      if (callback) callback(response);
    },
    *deleteChild({payload,callback},{call,put}){
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *childFetch({payload,callback},{call,put}){
      const response = yield call(childFetch, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if(callback) callback(obj);
    },
    *deleteSelf({payload,callback},{call,put}){
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
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
