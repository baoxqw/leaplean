import {
  queryRole, findRoleBussiness, getRole, roleIdAntu, newdata, newregister, queryRoleForTable, Distribution, removenewdata, findnewdata,
  removeRoleBussiness, bussTree, newdataList, findRoleA, selectBus, addRoleBussiness, updateRoleBussiness, fetchAntu
} from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'businessadmin',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(newdataList, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
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
    *find({ payload }, { call, put }) {
      const response = yield call(findRoleBussiness, payload);
      /*const obj = {
         list: response.resData,
         pagination:{
           total: response.total
         }
       };*/
      yield put({
        type: 'save',
        payload: 1,
      });
    },
    *fetchfortable({ payload }, { call, put }) {

      const response = yield call(queryRoleForTable, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdata, payload);
      if (callback) callback(response);
    },
    *tree({ payload, callback }, { call, put }) {
      const response = yield call(bussTree, payload);
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id
        })
      }
      if (callback) callback(response);
    },
    *findnewdata({ payload, callback }, { call, put }) {
      const response = yield call(findnewdata, payload);
      yield put({
        type: 'save',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData[0]);
    },
    *register({ payload, callback }, { call, put }) {
      const response = yield call(newregister, payload);
      if (response) {
        message.success('成功');
      }
      yield put({
        type: 'newdata',
        payload: {},
      });
      if (callback) callback(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRoleBussiness, payload);
      if (callback) callback(response)
    },
    *newdataList({ payload, callback }, { call, put }) {
      const response = yield call(newdataList, payload);

      if (callback) callback(response)
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
      if (response) {
        message.success('删除成功');
      }
      yield put({
        type: 'save',
        payload: {

        },
      });
      if (callback) callback();
    },
    *rrr({ payload, callback }, { call, put }) {
      const { id, pageIndex } = payload;
      const response = yield call(removeRole, id);
      if (response) {
        message.success('删除成功');
        yield put({
          type: 'find',
          payload: {
            id: 1,
            pageIndex,
            pageSize: 10
          },
        });
      } else {
        message.error('删除失败');
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(removeRoleBussiness, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRoleBussiness, payload);
      // yield put({
      //   type: 'savesource',
      //   payload:response
      // });
      if (callback) callback();
    },
    *fetchAntu({ payload, callback }, { call, put }) {
      const response = yield call(fetchAntu, payload);
      if (callback) callback(response);
    },
    *findlist({ payload }, { call, put }) {
      const response = yield call(findRoleA, payload);

      /* const obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };*/
      yield put({
        type: 'save',
        payload: 1,
      });
    },
    *select({ payload, callback }, { call, put }) {
      const response = yield call(selectBus, payload);

      if (callback) callback(response);
    },
    *roleIdAntu({ payload, callback }, { call, put }) {
      const response = yield call(roleIdAntu, payload);

      if (callback) callback(response);
    },
    *distribution({ payload, callback }, { call, put }) {
      const response = yield call(Distribution, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        dataSor: action.payload,
      };
    },
    savesource(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
