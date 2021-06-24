import { queryWorktype,addWorktype,deleteWorktype } from '@/services/worktype';


export default {
  namespace: 'worktype',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWorktype, payload);
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
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if(callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteWorktype, payload);
      if(callback) callback(response);
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
