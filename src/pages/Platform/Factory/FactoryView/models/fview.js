import { queryView} from '@/services/fview';

export default {
  namespace: 'fview',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryView, payload);

      if(callback) callback(response.userObj)
    }
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
