import { queryWorktype,deleterule,newdata } from '@/services/crule';
import { ruleadd } from '@/services/calendar';


export default {
  namespace: 'crule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWorktype, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      if(response.resData){
         obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *ruleadd({ payload,callback }, { call, put }) {
      const response = yield call(ruleadd, payload);
      if(callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleterule, payload);
      if(callback) callback(response);
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdata, payload);
      if(callback) callback(response);
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
