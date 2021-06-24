import { queryScheme, childFetch,fetchList,subapprove,fetchVerify,lookDetail,fetchMataQu,matypeQu,
  queryRoleUser,subapprove2 } from '@/services/QI';
import { matype, queryMatemanage } from '@/services/material';

export default {
  namespace: 'QI',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
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
    *childFetch({ payload }, { call, put }) {
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
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *lookDetail({ payload, callback }, { call, put }) {
      const response = yield call(lookDetail, payload);
      if (callback) callback(response);
    },
    *subapprove({ payload, callback }, { call, put }) {
      const response = yield call(subapprove, payload);
      if (callback) callback(response);
    },
    *subapprove2({ payload, callback }, { call, put }) {
      const response = yield call(subapprove2, payload);
      if (callback) callback(response);
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      console.log('-结果',response)
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
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
    *queryRoleUser({ payload, callback }, { call, put }) {
      const response = yield call(queryRoleUser, payload);
      if (callback) callback(response);
    },
    *matypeQu({ payload,callback }, { call, put }) {
      const response = yield call(matypeQu, payload);
      if (callback) callback(response);
    },
    *fetchMataQu({ payload,callback }, { call, put }) {
      const response = yield call(fetchMataQu, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if(callback) callback(obj)
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
