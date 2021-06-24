import {
  queryRole,
  findRole,
  getRole,
  roleIdAntu,
  newdatasss,
  addData,
  newdata,
  newregister,
  queryRoleForTable,
  Distribution,
  removenewdata,
  findnewdata,
  removeRole,
  addRole,
  updateRole,
  fetchAntu,
  findId
} from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'areaadmin',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findRole, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
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
      const response = yield call(newdata, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(newdatasss, payload);
      if (callback) callback(response);
    },
    *findnewdata({ payload,callback }, { call, put }) {
      const response = yield call(findnewdata, payload);
      yield put({
        type: 'save',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData[0]);
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
      const {obj,pageIndex} = payload
      const response = yield call(addRole, obj);
      if(response.resData){
        message.success('操作成功');
        yield put({
          type: 'find',
          payload: {
            id:1,
            pageIndex,
            pageSize:10
          },
        });
        if (callback) callback();
      }else{
        message.success('操作失败');
      }
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
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const {id,pageIndex} = payload;
      const response = yield call(removeRole, id);
      if (response) {
        message.success('删除成功');
        yield put({
          type: 'find',
          payload: {
            id:1,
            pageIndex,
            pageSize:10
          },
        });
      }else{
        message.error('删除失败');
      }
      if (callback) callback();
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

    *addData({ payload,callback }, { call, put }) {
      const response = yield call(addData, payload);
      if (callback) callback(response);
    },
    *findId({ payload,callback }, { call, put }) {
      const response = yield call(findId, payload);
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
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
