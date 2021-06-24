import { queryStation,findChild,fetchtable,deleteSuper,updateSuper,
  addteamsource,addSuperData,fetchtablechild,changeSuper} from '@/services/productexecu';
import {  matype, queryMatemanage } from '@/services/material';
import { queryTeam } from '@/services/team';
import { fetchWork } from '@/services/workline';
import { newdataPer, queryPersonal } from '@/services/api';
import { setStatus } from '@/services/wokplan';
export default {
  namespace: 'workplan',
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
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchtable({ payload,callback }, { call, put }) {
      const response = yield call(fetchtable, payload);
      let obj = []
      if(response.resData){
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *fetchtable2({ payload,callback }, { call, put }) {
      const response = yield call(fetchtablechild, payload);
      let obj = []
      if(response.resData){
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *fetchassign({ payload }, { call, put }) {
      const response = yield call(queryTeam, payload);
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
      yield put({
        type: 'saveassign',
        payload: obj,
      });
    },
    *findChild({ payload,callback }, { call, put }) {
      const response = yield call(findChild, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }

      if (callback) callback(obj);
    },
    *matype({ payload,callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *changeSuper({ payload,callback }, { call, put }) {
      const response = yield call(changeSuper, payload);
      if (callback) callback(response);
    },
    *deleteSuper({ payload,callback }, { call, put }) {
      const response = yield call(deleteSuper, payload);
      if (callback) callback(response);
    },
    *addteamsource({ payload,callback }, { call, put }) {
      const response = yield call(addteamsource, payload);
      if (callback) callback(response);
    },
    *updateSuper({ payload,callback }, { call, put }) {
      const response = yield call(updateSuper, payload);
      if (callback) callback(response);
    },
    *addSuperData({ payload,callback }, { call, put }) {
      const response = yield call(addSuperData, payload);
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
    *fetchWork({ payload,callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
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
    *setStatus({ payload,callback }, { call, put }) {
      const response = yield call(setStatus, payload);
      if(callback) callback(response)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
