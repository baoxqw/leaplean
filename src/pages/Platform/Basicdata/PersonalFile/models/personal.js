import { queryPersonal,removePersonal,newdataPer,findRole,addPersonal,roleIdAntu, queryDept,newdata,newregister,queryRoleForTable,Distribution,removenewdata,findnewdata, removeRole, addRole, updateRole,fetchAntu,fetchDept,fetchPerson } from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'personal',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPersonal, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *queryDept({ payload,callback }, { call, put }) {
      const response = yield call(queryDept, payload);
      console.log("response",response)
      if (callback) callback(response);
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findRole, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchfortable({ payload }, { call, put }) {
      const response = yield call(queryRoleForTable, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *findnewdata({ payload,callback }, { call, put }) {
      const response = yield call(findnewdata, payload);
     /* const obj = {
       list: response.list,
       pagination:{
         total: response.pagination.total
       }
     };
      yield put({
        type: 'save',
        payload: obj,
      });*/
      if (callback) callback(response);
    },
    *register({ payload ,callback}, { call, put }) {
      const response = yield call(newregister, payload);
      if(response){
        message.success('成功');
      }
      yield put({
        type: 'newdata',
        payload: {},
      });
      if(callback) callback(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPersonal, payload);
      if(callback) callback(response)

    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *removenewdata({ payload, callback }, { call, put }) {
      const response = yield call(removenewdata, payload);
      if(response){
        message.success('删除成功');
      }
      yield put({
        type: 'save',
        payload: {

        },
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removePersonal, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const {req,pageIndex} = payload
      const response = yield call(updateRole, req);
      yield put({
        type: 'find',
        payload:{
          pageIndex,
          pageSize:10
        }
      });
      if (callback) callback();
    },
    *fetchAntu({ payload,callback }, { call, put }) {
      const response = yield call(fetchAntu, payload);
      if (callback) callback(response);
    },
    *roleIdAntu({ payload,callback }, { call, put }) {
      const response = yield call(roleIdAntu, payload);
      if (callback) callback(response);
    },
    *distribution({ payload,callback }, { call, put }) {
      const response = yield call(Distribution, payload);
      if (callback) callback(response);
    },
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if(callback) callback(response.resData)
    },
    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
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
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
