import {
  queryPostProjectBasicInfoById,
  fetchcorpDetaildata,
} from '@/services/api';

export default {
  namespace: 'postmanagement',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetchcorpDetail({ payload,callback }, { call, put }) {
      const response = yield call(fetchcorpDetaildata, payload);
      yield put({
        type: 'save',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData);

    },
    *fetchlicen({ payload,callback }, { call, put }) {
      const response = yield call(newqueryIcm, payload);
      yield put({
        type: 'saved',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData);

    },
    *fetchDetail({ payload,callback }, { call, put }) {
      const response = yield call(queryPostProjectBasicInfoById, payload);

      yield put({
        type: 'nnn',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData[0]);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        detail:action.payload.projectDetail,
        finance:action.payload.projectFinanceList,
        shareholder:action.payload.projectShareholderList,
        history:action.payload.projectHistoryList,
        distribution:action.payload.projectDistributionList,
        team:action.payload.projectTeamList,
        license:action.payload.projectLicenseList,
        investplan:action.payload.investplan,
      };
    },
    nnn(state, action) {
      return {
        ...state,
        currentDetail: action.payload,
      };
    },
    saved(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
