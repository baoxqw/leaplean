import { fetchTree } from '@/services/TB';

export default {
  namespace: 'TB',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree,payload);
      if(callback) callback(response.resData)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
