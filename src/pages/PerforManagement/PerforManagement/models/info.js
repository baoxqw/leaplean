import { queryInfo, queryCoinmarketcap, queryHuobi, queryBinance, queryOkex, addInfo, findInfo, huobiFindHuobi, querySelect } from '@/services/info';
import { message } from 'antd';

export default {
  namespace: 'info',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataLists: {}
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryInfo, payload);

      yield put({
        type: 'save',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData)
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(findInfo, payload);
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
        type: 'findd',
        payload: obj,
      });
      if (callback) callback()
    },
    *coinmarketcap({ payload, callback }, { call, put }) {
      
      const response = yield call(queryCoinmarketcap, payload);
      if (callback) callback(response)
    },
    *huobi({ payload, callback }, { call, put }) {
      const response = yield call(queryHuobi, payload);
      
      if (callback) callback(response)
    },
    *binance({ payload, callback }, { call, put }) {
      const response = yield call(queryBinance, payload);
      
      if (callback) callback(response)
    },
    *okex({ payload, callback }, { call, put }) {
      const response = yield call(queryOkex, payload); 
      if (callback) callback(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addInfo, payload);
      if (callback) callback(response)
    },
    *huobiQuery({ payload, callback }, { call, put }) {
      const response = yield call(huobiFindHuobi, payload);
      if (callback) callback(response)
    },
    *query({ payload, callback }, { call, put }) {
      const response = yield call(querySelect, payload);
      if (callback) callback(response)
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        projectDetail: action.payload.projectDetail,
        projectDistributionList: action.payload.projectDistributionList,
        projectFinanceList: action.payload.projectFinanceList,
        projectHistoryList: action.payload.projectHistoryList,
        projectLicenseList: action.payload.projectLicenseList,
        projectShareholderList: action.payload.projectShareholderList,
        projectTeamList: action.payload.projectTeamList,
      };
    },
    findd(state, action) {
      return {
        ...state,
        dataLists: action.payload,
      }
    }
  },
};
