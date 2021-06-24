import {
  newdatasss,
  addData,
  fetchPrepare,
  removePrepare,
  addPrepare,
} from '@/services/modelType';


export default {
  namespace: 'MT',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchPrepare({ payload }, { call, put }) {
      const response = yield call(fetchPrepare, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if(response.resData){
        response.resData.map(item =>{
          item.key =item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      yield put({
        type: 'savepre',
        payload: obj,
      });
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(newdatasss, payload);
      if (callback) callback(response);
    },
    *addPrepare({ payload,callback }, { call, put }) {
      const response = yield call(addPrepare, payload);
      if (callback) callback(response);
    },
    *removePrepare({ payload,callback }, { call, put }) {
      const response = yield call(removePrepare, payload);
      if (callback) callback(response);
    },
    *addData({ payload,callback }, { call, put }) {
      const response = yield call(addData, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savepre(state, action) {
      return {
        ...state,
        datapre: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
