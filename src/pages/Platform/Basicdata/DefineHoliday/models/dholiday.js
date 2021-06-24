import { queryHoliday,deleteHoliday,findHoliday } from '@/services/dholiday';
import { newdatasss } from '@/services/holiday';
import { addDefinition } from '@/services/calendar';

export default {
  namespace: 'dholiday',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHoliday, payload);
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
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if(callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteHoliday, payload);
      if(callback) callback(response);
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(newdatasss, payload);
      if(response && response.resData && response.resData.length){
        response.resData = response.resData.map((item)=>{
          item.key = item.id
          return item
        })
      }
      if (callback) callback(response);
    },
    *addDefinition({ payload,callback }, { call, put }) {
      const response = yield call(addDefinition, payload);
      if(callback) callback(response);
    },
    *findHoliday({ payload,callback }, { call, put }) {
      const response = yield call(findHoliday, payload);
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
