import { queryRole,addmeasure,removemeasure} from '@/services/measure';

import { message } from 'antd';

export default {
  namespace: 'measure',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list:[],
        pagination:{
          total:0,
          current:1
        }
      }
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        });
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
    *add({ payload,callback}, { call, put }) {
      const response = yield call(addmeasure, payload);
      if(callback) callback(response)
    },
    *update({ payload,callback}, { call, put }) {
      const response = yield call(addmeasure, payload);
      if(callback) callback(response)
    },
    *remove({ payload,callback}, { call, put }) {
      const response = yield call(removemeasure, payload);
      if(callback) callback(response)
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
