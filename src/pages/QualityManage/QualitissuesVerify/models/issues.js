import { queryScheme, childFetch,fetchList,subapprove,submitCheck,
  fetchVerify,fetchAdvice,detailcheck,fetchProcessId} from '@/services/issues';
import { matype, queryMatemanage } from '@/services/material';

export default {
  namespace: 'issues',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryScheme, payload);
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

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchVerify({ payload }, { call, put }) {
      const response = yield call(fetchVerify, payload);
      console.log("response",response)
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

      yield put({
        type: 'saveVerify',
        payload: obj,
      });
    },
    * childFetch({ payload }, { call, put }) {
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
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };
      } else {
        obj = {};
      }

      yield put({
        type: 'savechild',
        payload: obj,
      });
    },
    * matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *subapprove({ payload, callback }, { call, put }) {
      const response = yield call(subapprove, payload);
      if (callback) callback(response);
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryScheme, payload);
      if (callback) callback(response);
    },
    *fetchAdvice({ payload,callback }, { call, put }) {
      const response = yield call(fetchAdvice, payload);
      if (callback) callback(response);
    },
    *detailcheck({ payload,callback }, { call, put }) {
      const response = yield call(detailcheck, payload);
      if (callback) callback(response);
    },
    *fetchProcessId({ payload,callback }, { call, put }) {
      const response = yield call(fetchProcessId, payload);
      if (callback) callback(response);
    },
    *submitCheck({ payload,callback }, { call, put }) {
      const response = yield call(submitCheck, payload);
      if (callback) callback(response);
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      if (callback) callback(response);
    },
    * fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveVerify(state, action) {
      return {
        ...state,
        dataVerify: action.payload,
      };
    },
    savechild(state, action) {
      return {
        ...state,
        childData: action.payload,
      };
    },
  },
};
