import { queryCorp, removeCorp, addCorp, updateCorp } from '@/services/api';

export default {
  namespace: 'corp',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    //call：执行异步函数 put：发出一个 Action，类似于 dispatch
    *fetch({ payload }, { call, put }) {
      //执行异步请求 拿到结果
      const response = yield call(queryCorp, payload);
      //发出Action 更新state
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchLicen({ payload,callback }, { call, put }) {
      //执行异步请求 拿到结果
      const response = yield call(queryLicen, payload);
      //发出Action 更新state
      yield put({
        type: 'save',
        payload: response,
      });
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
