import {
  queryStation, fetchchildTwo, fetchchild, findrouttable, fetchbomall,
  findbomtable,
  findbomlist, fetchbom, fetchrout, fetchbomchild,
  findroutChild,
} from '@/services/productmodle';
import { matype, queryMatemanage, fetchMataCon } from '@/services/material';

export default {
  namespace: 'minfor',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
        },
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    * matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);

    },
    * fetchbom({ payload }, { call, put }) {
      const response = yield call(fetchbom, payload);
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
          return item;
        });
        const obj = {
          list: response.resData,
          pagination: {
            total: response.total,
          },
        };
        yield put({
          type: 'savebom',
          payload: obj,
        });
      }

    },
    * fetchbomtree({ payload, callback }, { call, put }) {
      const response = yield call(findbomlist, payload);
      let obj = [];
      if (response.resData) {
        obj = response.resData;
        obj.map((item, i) => {
          item.key = item.id;
          item.name = item.materialname;
        });
      }
      if (callback) callback(obj);

    },
    * fetchrout({ payload }, { call, put }) {
      const response = yield call(fetchrout, payload);
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
          return item;
        });
        const obj = {
          list: response.resData,
          pagination: {
            total: response.total,
          },
        };
        yield put({
          type: 'saverout',
          payload: obj,
        });
      }

    },
    * fetchbomall({ payload, callback }, { call, put }) {
      const response = yield call(fetchbomall, payload);
      console.log('-response---', response);
      let obj = [];
      if (response.resData) {
        response.resData.map((item) => {
          item.key = item.id;
        });
        obj = response.resData;
      }
      if (callback) callback(obj);
    },
    * fetchbomchild({ payload, callback }, { call, put }) {
      const response = yield call(fetchbomchild, payload);
      let obj = [];
      if (response.resData) {
        obj = response.resData;
        obj.map((item, i) => {
          item.key = 'bom' + item.id;
          item.name = item.materialname;
        });
      }
      if (callback) callback(obj);
    },
    * findroutChild({ payload, callback }, { call, put }) {
      const response = yield call(findroutChild, payload);
      let obj = [];
      if (response.resData) {
        obj = response.resData;
        obj.map((item) => {
          item.key = 'rout' + item.id;
        });
      }
      if (callback) callback(obj);
    },
    * fetchMataCon({ payload, callback }, { call, put }) {
      const response = yield call(fetchMataCon, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1,

        },
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          },
        };
      }
      if (callback) callback(obj);
    },
    * findrouttable({ payload, callback }, { call, put }) {
      const response = yield call(findrouttable, payload);
      let obj = [];
      if (response.resData) {
        obj = response.resData;
        obj.map((item, i) => {
          item.key = item.id;
          item.name = item.materialname;
        });
      }
      if (callback) callback(obj);
    },
    * findbomtable({ payload, callback }, { call, put }) {
      const response = yield call(findbomtable, payload);
      let obj = [];
      if (response.resData) {
        obj = response.resData;
      }
      if (callback) callback(obj);
    },
    * fetchroutmater({ payload, callback }, { call, put }) {
      const response = yield call(fetchroutmater, payload);

      response.resData.map(item => {
        item.key = item.id;
        return item;
      });
      if (callback) callback(response.resData);

    },
    * treenode({ payload, callback }, { call, put }) {
      const response = yield call(fetchchild, payload);
      let obj = [];
      if (response.resData) {
        response.resData.map((item, i) => {
          item.name = item.materialname;
          item.key = i;
          return item;
        });
        obj = response.resData;
      }
      if (callback) callback(obj);
    },
    * treenodeTwo({ payload, callback }, { call, put }) {
      const response = yield call(fetchchildTwo, payload);
      let obj = [];
      if (response.resData) {
        response.resData.map((item, i) => {
          item.name = item.materialname;
          item.key = item.id;
          return item;
        });
        obj = response.resData;
      }
      if (callback) callback(obj);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savebom(state, action) {
      return {
        ...state,
        bomdata: action.payload,
      };
    },
    bomlist(state, action) {
      return {
        ...state,
        bomlist: action.payload,
      };
    },
    routlist(state, action) {
      return {
        ...state,
        routlist: action.payload,
      };
    },
    saverout(state, action) {
      return {
        ...state,
        routdata: action.payload,
      };
    },
  },
};
