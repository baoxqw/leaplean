
import {  fetchanly, fetchTeam } from '@/services/PSched';
import { queryTeam, } from '@/services/team';
import {  Processperson } from '@/services/PDS';
import {  setStatus,findprocessSuper } from '@/services/productexecu';
import { newdataPer, queryPersonal } from '@/services/api';
export default {
  namespace: 'PSched',
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
    *fetchPsndoc({ payload,callback }, { call, put }) {
      const response = yield call(fetchanly, payload);
     let userobject = []
     if(response.resData){
       userobject = response.resData
     }
      yield put({
        type: 'save',
        payload: userobject,
      });
      if (callback) callback(userobject);
    },
    *matype({ payload,callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdataPer, payload);

      if (callback) callback(response);
    },
    *fetchProduct({ payload,callback }, { call, put }) {
      const response = yield call(queryTeam, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if(callback) callback(obj);
    },
    *Processperson({ payload,callback }, { call, put }) {
      const response = yield call(Processperson, payload);
      if(callback) callback(response)
    },
    *setStatus({ payload,callback }, { call, put }) {
      const response = yield call(setStatus, payload);
      if (callback) callback(response);
    },
    *findprocess({ payload,callback }, { call, put }) {
      const response = yield call(findprocessSuper, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if(callback) callback(obj)
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
    *fetchTeam({ payload,callback }, { call, put }) {
      const response = yield call(fetchTeam, payload);
      let userobject = []
      if(response.resData){
        userobject = response.resData
      }
      if(callback) callback(userobject)
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
