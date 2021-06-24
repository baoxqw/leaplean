import {
  queryWorktype, addWorktype, deleteWorktype, childFetch,
  matype, queryMatemanage, addchild, queryArea, fetchWork, deleteChild,
} from '@/services/pS';


export default {
  namespace: 'pS',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryWorktype, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1,
        },
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    * fetchArea({ payload, callback }, { call, put }) {
      const response = yield call(queryArea, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1,

        },
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };
      }
      if (callback) callback(obj);
    },
    * fetchWork({ payload, callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1,

        },
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };

      }
      ;
      if (callback) callback(obj);
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if (callback) callback(response);
    },
    * addchild({ payload, callback }, { call, put }) {
      const response = yield call(addchild, payload);
      if (callback) callback(response);
    },
    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteWorktype, payload);
      if (callback) callback(response);
    },
    * deleteChild({ payload, callback }, { call, put }) {
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    * matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    * childFetch({ payload, callback }, { call, put }) {
      const response = yield call(childFetch, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1,

        },
      };
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };
      }
      if (callback) callback(obj);
    },
    * fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1,
        },
      };
      if (callback) callback(obj);
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
