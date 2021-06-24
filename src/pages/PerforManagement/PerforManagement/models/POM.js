import {
  addPOM,
  fetchPOM,
} from '@/services/POM';

export default {
  namespace: 'POM',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchPOM, payload);

      /*const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };*/
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.resData);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addPOM, payload);
      if (callback) callback();
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};
