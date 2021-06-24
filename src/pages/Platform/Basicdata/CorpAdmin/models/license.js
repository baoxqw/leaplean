import { queryCorp, removeCorp, addCorp, updateCorp,queryLicen } from '@/services/api';

export default {
  namespace: 'license',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryLicen, payload);
      //发出Action 更新state
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response.resData);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCorp, payload);

      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCorp, payload);
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateCorp, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
