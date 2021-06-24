import { queryEC,addEC,deleteEC } from '@/services/EC';

export default {
  namespace: 'EC',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryEC, payload);
     
      if(callback) callback(response)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addEC, payload);
      if(callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteEC, payload);
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
