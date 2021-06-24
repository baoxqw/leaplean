import { queryMatemanage,getRole, newdata,matype,maunit,submitData,newdataList,
  removeDM,findnewdataDapart,fetchUcum,addMatemanage,deleteMatemanage,addMatemanageList
} from '@/services/material';
import {
  bussTree
} from '@/services/api';
export default {
  namespace: 'material',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

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
    *fetchUcum({ payload,callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
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
      if(callback) callback(obj)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMatemanage, payload);
      if (callback) callback(response);
    },
    *addList({ payload,callback }, { call, put }) {
      const response = yield call(addMatemanageList, payload);
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteMatemanage, payload);
      if (callback) callback(response);
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdata, payload);
      if (callback) callback(response);
    },
    *matype({ payload,callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *maunit({ payload,callback }, { call, put }) {
      const response = yield call(maunit, payload);
      if (callback) callback(response);
    },
    *submit({ payload,callback }, { call, put }) {
      const response = yield call(submitData, payload);
      if (callback) callback(response);
    },
    *findnewdata({ payload,callback }, { call, put }) {
      const response = yield call(findnewdataDapart, payload);
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *removeDM({ payload, callback }, { call, put }) {
      const response = yield call(removeDM, payload);
      if (callback) callback(response);
    },
    *tree({ payload, callback }, { call, put }) {
      const response = yield call(bussTree, payload);
      console.log('--树-',response)
      let obj = []
      if(response.resData){
        obj = response.resData
      }
     
      if (callback) callback(response);
    },
    *newdataList({ payload,callback }, { call, put }) {
      const response = yield call(newdataList, payload);
      console.log('列表',response)
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
            current: pageIndex + 1
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
