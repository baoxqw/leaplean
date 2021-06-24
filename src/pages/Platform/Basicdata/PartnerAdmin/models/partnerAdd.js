import { queryPartnerAdd,addPartnerAdd } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'partnerAdd',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPartnerAdd, payload);
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
      const response = yield call(addPartnerAdd, payload);
      /*yield put({
        type: 'save',
        payload: response,
      });*/
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
