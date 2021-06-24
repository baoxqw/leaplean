import {
  addBL,
  fetchBL,
} from '@/services/Cre';

export default {
  namespace: 'Cre',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fetchBL, payload);

      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBL, payload);
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
