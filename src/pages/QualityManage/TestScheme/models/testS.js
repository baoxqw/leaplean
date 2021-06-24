import { queryStation,addself,deleteSelf,childFetch,addchild,deleteChild } from '@/services/testS';

export default {
  namespace: 'testS',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    childData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      const { pageIndex = 0 } = payload;
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
    *addself({payload,callback},{call,put}){
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *addchild({payload,callback},{call,put}){
      const response = yield call(addchild, payload);
      if (callback) callback(response);
    },
    *deleteChild({payload,callback},{call,put}){
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *childFetch({payload,callback},{call,put}){
      const response = yield call(childFetch, payload);
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if(callback) callback(obj);
    },
    *deleteSelf({payload,callback},{call,put}){
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
    }



  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    child(state, action) {
      return {
        ...state,
        childData: action.payload,
      };
    },
  },
};
