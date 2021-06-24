import { addself,fetch,remove } from '@/services/CR';

export default {
  namespace: 'CR',

  state: {
    tags: [],
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetch, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      };
      if(response.resData){

        function query(test){
          let str = "";
          switch (test){
            case 0:
              str = '无';
              break
            case 1:
              str = '自定义';
              break
            case 2:
              str = "时间戳 yyyyMMdd";
              break
            case 3:
              str = '时间戳 yyyyMMddHHmmss';
              break
            case 4:
              str = '随机码';
              break
            case 5:
              str = '流水号';
              break
          }
          return str;
        }

        response.resData.map(item=>{
          const prefixStr = query(item.prefix);
          const middleStr = query(item.middle);
          const suffixStr = query(item.suffix);
          item.prefixStr = prefixStr;
          item.middleStr = middleStr;
          item.suffixStr = suffixStr;
          item.key = item.id
          return item
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
    *addself({ payload,callback }, { call, put }) {
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
