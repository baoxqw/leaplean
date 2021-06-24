import { queryDuty,deleteSelf,addself,sourcefetch,
  addsource,childFetch,addbook,deleteChild,deleteSource,
  addproject,fetchproject,deleteproject,addFile,fetchList,
  deleteend,addProList} from '@/services/qualitymanage';
import {  matype,queryMatemanage,} from '@/services/material';
import { addWuLiao,addPersonal } from '@/services/porder';
import { queryRole } from '@/services/measure';
export default {
  namespace: 'testduty',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    sourceData: {
      list: [],
      pagination: {},
    },
    projectData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDuty, payload);
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
    *sourcefetch({ payload,callback }, { call, put }) {
      const response = yield call(sourcefetch, payload);
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
          item.key = item.id+'_index'
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
        type: 'source',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let obj = []
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'https://49.234.209.104/nienboot-0.0.1-SNAPSHOT';
            break;
          case 'dev': //开发环境
            env = 'http://127.0.0.1:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          item.url = env+item.path+'/'+item.name;
          item.thumbUrl = env+item.path+'/'+item.name;
          return item
        });
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *deleteend({ payload,callback }, { call, put }) {
      const response = yield call(deleteend, payload);
      if(callback) callback(response)
    },
    *addProList({ payload,callback }, { call, put }) {
      const response = yield call(addProList, payload);
      if(callback) callback(response)
    },
    *fetchproject({ payload,callback }, { call, put }) {
      const response = yield call(fetchproject, payload);
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
        type: 'child',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *deleteSelf({payload,callback},{call,put}){
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
    },
    *addFile({payload,callback},{call,put}){
      const response = yield call(addFile, payload);
      if (callback) callback(response);
    },
    *deleteproject({payload,callback},{call,put}){
      const response = yield call(deleteproject, payload);
      if (callback) callback(response);
    },
    *childFetch({payload,callback},{call,put}){
      const response = yield call(childFetch, payload);
      if (callback) callback(response);
    },
    *deleteChild({payload,callback},{call,put}){
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *matype({ payload,callback}, { call, put }) {
      const response = yield call(matype, payload);
      if(callback) callback(response)
    },
    *addbook({ payload,callback}, { call, put }) {
      const response = yield call(addbook, payload);
      if(callback) callback(response)
    },
    *fetchMata({ payload,callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let { pageIndex = 0 } = payload;
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
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      
      if(callback) callback(obj)
    },
    *fetchWork({ payload,callback }, { call, put }) {
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
    *addWuLiao({ payload,callback }, { call, put }) {
      const response = yield call(addWuLiao, payload);
      if (callback) callback(response);
    },
    *addself({payload,callback},{call,put}){
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *addsource({payload,callback},{call,put}){
      const response = yield call(addsource, payload);
      if (callback) callback(response);
    },
    *addproject({payload,callback},{call,put}){
      const response = yield call(addproject, payload);
      if (callback) callback(response);
    },
    *deleteSource({payload,callback},{call,put}){
      const response = yield call(deleteSource, payload);
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
    source(state, action) {
      return {
        ...state,
        sourceData: action.payload,
      };
    },
    child(state, action) {
      return {
        ...state,
        projectData: action.payload,
      };
    },
  },
};
