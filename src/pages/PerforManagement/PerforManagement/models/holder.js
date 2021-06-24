//股东信息
import {
  fetchfinace,
  addfinace,
  deleteATholder,
  submitProjectAddFormholder,
  queryattchmentListholder
} from '@/services/api';

export default {
  namespace: 'holder',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addfinace, payload);
      if (callback) callback();
    },
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchfinace, payload);
      yield put({
        type: 'save',
        payload: response.resData
      });
      if (callback) callback(response.resData);
    },
    *attachmentdel({ payload, callback }, { call, put }) {
      const { id, pageIndex} = payload;
      const response = yield call(deleteATholder, id);
      yield put({
        type: 'queryattchment',
        payload: {
          id:id,
          pageIndex,
          pageSize:5
        }
      });
      if (callback) callback();
    },
    *submitProjectAddForm({ payload,callback }, { call, put }) {
      const response = yield call(submitProjectAddFormholder, payload);
      if (callback) callback();
      // if (response) {
      //   message.success('创建成功');
      // }else{
      //   message.error('创建失败');
      // }
      //
      // yield put({
      //   type: 'newsave',
      //   payload: response
      // });

    },
    *queryattchment({ payload,callback }, { call, put }) {
      const response = yield call(queryattchmentListholder, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      if(response.resData){
        const datasource =  response.resData.map((item,index)=>{
          item.key = index + 1
          return item
        })
        yield put({
          type: 'bb',
          payload: datasource,
        });
      }else{
        yield put({
          type: 'bb',
          payload: [],
        });
      }
      if (callback) callback(response.resData);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    bb(state, action) {
      return {
        ...state,
        datasource: action.payload,
      };
    },
  },
};
