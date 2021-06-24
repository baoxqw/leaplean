import { queryWorktype,addWorktype,deleteWorktype,deletedetail} from '@/services/cdetail';
import { detailadd } from '@/services/calendar';


export default {
  namespace: 'cdetail',


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
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if(callback) callback(response);
    },
    *detailadd({ payload,callback }, { call, put }) {
      const response = yield call(detailadd, payload);
      if(callback) callback(response);
    },
    *deletedetail({ payload,callback }, { call, put }) {
      const response = yield call(deletedetail, payload);
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
