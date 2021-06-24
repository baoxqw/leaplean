import { queryRole, addwork, deletework } from '@/services/workcenter';

export default {
  namespace: 'workcenter',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      const { pageIndex = 0 } = payload;
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
        })
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
      if (callback) callback(obj);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addwork, payload);
      if (callback) callback(response)
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(addwork, payload);
      if (callback) callback(response)
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deletework, payload);
      if (callback) callback(response)
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
