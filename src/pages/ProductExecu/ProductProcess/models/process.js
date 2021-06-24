import { queryStation,findlist,addmethods,addmodel,changemethods,
  endmethods,findworking,checklist,fetchFileList,findIssuesDetail,
  addissuesword} from '@/services/productexecu';
import {  fetchUnit } from '@/services/productmodle';
import moment from "moment";
export default {
  namespace: 'process',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    datalist: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *addmethods({ payload,callback }, { call, put }) {
      const response = yield call(addmethods, payload);
      if(callback) callback(response)
    },
    *endmethods({ payload,callback }, { call, put }) {
      const response = yield call(endmethods, payload);
      if(callback) callback(response)
    },
    *addmodel({ payload,callback }, { call, put }) {
      const response = yield call(addmodel, payload);
      if(callback) callback(response)
    },
    *findIssuesDetail({ payload,callback }, { call, put }) {
      const response = yield call(findIssuesDetail, payload);
      if(callback) callback(response)
    },
    *addissuesword({ payload,callback }, { call, put }) {
      const response = yield call(addissuesword, payload);
      if(callback) callback(response)
    },
    *changemethods({ payload,callback }, { call, put }) {
      const response = yield call(changemethods, payload);
      if(callback) callback(response)
    },
    *findworking({ payload,callback }, { call, put }) {
      const response = yield call(findworking, payload);
      if(callback) callback(response)
    },
    *checklist({ payload,callback }, { call, put }) {
      const response = yield call(checklist, payload);
      if(callback) callback(response)
    },
    *findlist({ payload }, { call, put }) {
      const response = yield call(findlist, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
      if( response.resData){
        response.resData.map((item)=>{
          if(item.actendtime && item.actstarttime){
            let  b= moment(item.actendtime,'YYYY-MM-DD HH:mm:ss');
            let  a= moment(item.actstarttime,'YYYY-MM-DD HH:mm:ss');
            let c = b.diff(a,'days');
            let m = b.diff(a,'minute');
            let s = b.diff(a,'second');
           item.surday = c
           item.surmin = m
           item.sursec = s
           item.key = item.id
          }
          else{
            item.surday = 0
            item.surmin = null
            item.sursec = null
          }
          switch(item.processstatus){
            case 0:
              item.processstatusend = '未下达';
              break;
            case 1:
              item.processstatusend = '已下达班组';
              break;
            case 2:
              item.processstatusend = '已派工';
              break;
            case 3:
              item.processstatusend = '开始生产'
              break;
            case 4:
              item.processstatusend = '结束生产';
              break;
            case 5:
              item.processstatusend = '取消生产';
              break;
            case 6:
              item.processstatusend = '暂停生产';
              break;
            case 7:
              item.processstatusend = '取消暂停';
              break;
          }
        })
         obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          },
           total:response.total
        };
      }
      yield put({
        type: 'savelist',
        payload: obj,
      });
    },
    *fetchUnit({ payload,callback }, { call, put }) {
      const response = yield call(fetchUnit, payload);
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
      if(callback) callback(obj);
    },
    *fetchFileList({ payload, callback }, { call, put }) {
      const response = yield call(fetchFileList, payload);
      let object = []
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT';
            break;
          case 'dev': //开发环境
            //env = 'http://192.168.2.166:8080';
            env = 'http://127.0.0.1:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.com/nienboot-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          item.url = env+item.path+'/'+item.name;
          item.thumbUrl = env+item.path+'/'+item.name;
          return item
        });
        object = response.resData

      }
      if (callback) callback(object);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savelist(state, action) {
      return {
        ...state,
        datalist: action.payload,
      };
    },
  },
};


