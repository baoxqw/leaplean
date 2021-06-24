import { querySysuser, removeSysuser, findPageSysuser, addSysuser, evenSysuser, updateSysuser, findSysuser, assignSysuser, distSysuser } from '@/services/api';
import { message } from 'antd';
import { fetchCMX, fetchPerson, fetchTree } from '@/services/CMX';
import { fetchpApproval } from '@/services/papproval';
import { fetchBM } from '@/services/BM';
import { fetchRR } from '@/services/RR';

export default {
  namespace: 'sysuser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    list: {

    }
  },

  effects: {
    *find({ payload }, { call, put }) {
      const response = yield call(findSysuser, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        }
      }
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
          return item
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchCMX({ payload, callback }, { call, put }) {
      const response = yield call(fetchCMX, payload);
      if (callback) callback(response);
    },
    *fetchpApproval({ payload, callback }, { call, put }) {
      const response = yield call(fetchpApproval, payload);
      if (callback) callback(response);
    },
    *fetchBM({ payload, callback }, { call, put }) {
      const response = yield call(fetchBM, payload);
      if (callback) callback(response);
    },
    *fetchRR({ payload, callback }, { call, put }) {
      const response = yield call(fetchRR, payload);
      if (callback) callback(response);
    },
    *findPage({ payload }, { call, put }) {
      const response = yield call(findPageSysuser, payload);
      const obj = {
        list: response.resData,
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSysuser, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeSysuser, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateSysuser, payload);
      yield put({
        type: 'find',
        payload: {
          id: 1
        }
      });
      if (callback) callback();
    },
    *assign({ payload, callback }, { call, put }) {
      const response = yield call(assignSysuser, payload);

      /*const obj ={
        list:response.resData
      };
      yield put({
        type: 'aaa',
        payload: obj,
      });*/
      if (!response.resData) {
        response.resData = []
      }
      if (callback) callback(response.resData);
    },

    *dist({ payload, callback }, { call, put }) {
      const { req, pageIndex } = payload
      const response = yield call(distSysuser, req);

      yield put({
        type: 'find',
        payload: {
          id: req.id,
          pageIndex,
          pageSize: 10
        },
      });
      if (callback) callback();
    },
    *even({ payload, callback }, { call, put }) {
      const response = yield call(evenSysuser, payload);
      if (callback) callback(response.resData);
    },

    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
      if (callback) callback(response);
    },
    *fetchPerson({ payload, callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
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
      if (callback) callback(obj)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    aaa(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
