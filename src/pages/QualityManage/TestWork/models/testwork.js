import { queryStation,addself,deleteSelf,childFetch,
  addchild,deleteChild,addsample,fetchsample,deletesample,
  deletetype,deletedevice,addtestdate,addtestdevice,fetchtestdate,fetchdevice,
} from '@/services/testwork';
import { queryRole,} from '@/services/protype';
export default {
  namespace: 'testwork',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      const { pageIndex = 0 } = payload
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1

          }
        };
      }

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchsample({ payload }, { call, put }) {
      const response = yield call(fetchsample, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      const { pageIndex = 0 } = payload
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1

          }
        };
      }

      yield put({
        type: 'savesample',
        payload: obj,
      });
    },
    *fetchProduct({ payload,callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if(callback) callback(obj);
    },
    *addself({payload,callback},{call,put}){
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *addtestdate({payload,callback},{call,put}){
      const response = yield call(addtestdate, payload);
      if (callback) callback(response);
    },
    *addtestdevice({payload,callback},{call,put}){
      const response = yield call(addtestdevice, payload);
      if (callback) callback(response);
    },
    *deletetype({payload,callback},{call,put}){
      const response = yield call(deletetype, payload);
      if (callback) callback(response);
    },
    *deletedevice({payload,callback},{call,put}){
      const response = yield call(deletedevice, payload);
      if (callback) callback(response);
    },
    *deletesample({payload,callback},{call,put}){
      const response = yield call(deletesample, payload);
      if (callback) callback(response);
    },
    *addchild({payload,callback},{call,put}){
      const response = yield call(addchild, payload);
      if (callback) callback(response);
    },
    *addsample({payload,callback},{call,put}){
      const response = yield call(addsample, payload);
      if (callback) callback(response);
    },
    *deleteChild({payload,callback},{call,put}){
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *childFetch({payload,callback},{call,put}){
      const response = yield call(childFetch, payload);
      if (callback) callback(response);
    },
    *deleteSelf({payload,callback},{call,put}){
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
    },
    *fetchtestdate({payload,callback},{call,put}){
      const response = yield call(fetchtestdate, payload);
      let obj = []
      if(response.resData){
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *fetchdevice({payload,callback},{call,put}){
      const response = yield call(fetchdevice, payload);
      let obj = []
      if(response.resData){
        obj = response.resData
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
    savesample(state, action) {
      return {
        ...state,
        sampledata: action.payload,
      };
    },
  },
};
