import { queryWorktype,calendarAdd,ruleadd,detailadd,fetchType,
  calendarFetch,calendarDelete,fetchWork,detailAdd,detailBir,
  addDefinition,findCalend,workcalendardate,addchild,childFetch,
  deleteChild} from '@/services/calendar';
import { newdatasss } from '@/services/holiday';


export default {
  namespace: 'calendar',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tableList: {
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
        response.resData.map(item=>{
          item.key = item.id
          return item
        });
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
    *calendarFetch({ payload }, { call, put }) {
      const response = yield call(calendarFetch, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'table',
        payload: obj,
      });
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if(callback) callback(response);
    },
    *childFetch({ payload,callback }, { call, put }) {
      const response = yield call(childFetch, payload);
      if(callback) callback(response);
    },
    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(newdatasss, payload);
      if (callback) callback(response);
    },
    *deleteChild({ payload,callback }, { call, put }) {
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *calendarAdd({ payload,callback }, { call, put }) {
      const response = yield call(calendarAdd, payload);
      if (callback) callback(response);
    },
    *ruleadd({ payload,callback }, { call, put }) {
      const response = yield call(ruleadd, payload);
      if(callback) callback(response);
    },
    *detailadd({ payload,callback }, { call, put }) {
      const response = yield call(detailadd, payload);
      if(callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(calendarDelete, payload);
      if(callback) callback(response);
    },
    *fetchType({ payload,callback }, { call, put }) {
      const response = yield call(fetchType, payload);
      if(callback) callback(response);
    },
    *fetchWork({ payload,callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      if(callback) callback(response);
    },
    *addchild({ payload,callback }, { call, put }) {
      const response = yield call(addchild, payload);
      if(callback) callback(response);
    },
    *detailAdd({ payload,callback }, { call, put }) {
      const response = yield call(detailAdd, payload);
      if(callback) callback(response);
    },
    *detailBir({ payload,callback }, { call, put }) {
      const response = yield call(detailBir, payload);
      if(callback) callback(response);
    },
    *addDefinition({ payload,callback }, { call, put }) {
      const response = yield call(addDefinition, payload);
      if(callback) callback(response);
    },
    *findCalend({ payload,callback }, { call, put }) {
      const response = yield call(findCalend, payload);
      if(callback) callback(response);
    },
    *workcalendardate({ payload,callback }, { call, put }) {
      const response = yield call(workcalendardate, payload);
      if(callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    table(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
