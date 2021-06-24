import { queryPartner,addPartner,removePartner,updatePartner } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'partner',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPartner, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPartner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { obj, pageIndex,id} = payload;
      const response = yield call(removePartner, obj);
      if (response) {
        message.success('删除成功');
      }else{
        message.error('删除失败');
      }

      yield put({
        type: 'fetch',
        payload: {
          id,
          pageIndex,
          pageSize:10
        }
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePartner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
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
