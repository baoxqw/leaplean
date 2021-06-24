import { queryRole, adddevice, removedevice } from '@/services/dstatus';

import { message } from 'antd';

export default {
  namespace: 'dstatus',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      const pageIndex = payload.pageIndex;
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
      const response = yield call(adddevice, payload);
      if (callback) callback(response)
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removedevice, payload);
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
