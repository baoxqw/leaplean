import { queryRole,findRole,getRole,roleIdAntu, newdata,submitData,newregister,
  queryRoleForTable,Distribution,removeDM,findnewdataDapart, removeRole, addRole, updateRole,fetchAntu } from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'dapart',

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
      /*yield put({
        type: 'save',
        payload: response,
      });*/
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
    *removeDM({ payload, callback }, { call, put }) {
      const response = yield call(removeDM, payload);
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
