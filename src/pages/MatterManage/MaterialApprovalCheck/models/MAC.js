import { fetchWork,fetchVerify ,queryScheme,fetchAdvice,detailcheck,
  submitCheck} from '@/services/MAC';


export default {
  namespace: 'MAC',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataNum: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      console.log("订单",response)
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
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
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
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
    *submitCheck({ payload,callback }, { call, put }) {
      const response = yield call(submitCheck, payload);
      if (callback) callback(response);
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryScheme, payload);
      if (callback) callback(response);
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


  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    small(state, action) {
      return {
        ...state,
        smalldata: action.payload,
      };
    },
    saveVerify(state, action) {
      return {
        ...state,
        dataVerify: action.payload,
      };
    },
  },
};
