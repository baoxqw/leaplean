import {
  queryRout, addRout, deleteRout, upload, uploadlist, findChild, childAddRout,
  genversionnoRout, materialIdRout, addChild, defaultRout, isVersionRout, fetchList,
  deleteend
} from '@/services/rout';
import { fetchUcum, matype, queryMatemanage } from '@/services/material';
import { fetchRegion } from '@/services/unitwork';
import { fetchProduct } from '@/services/area';
import { addWuLiao, addPersonal } from '@/services/porder';
import { queryWorktype } from '@/services/worktype';
import { newdataPer, queryPersonal } from '@/services/api';
import { queryRole } from '@/services/protype';

export default {
  namespace: 'rout',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRout, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *findChild({ payload, callback }, { call, put }) {
      const response = yield call(findChild, payload);
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
          return item
        });
      }
      if (callback) callback(response.resData)
    },
    *addWuLiao({ payload, callback }, { call, put }) {
      const response = yield call(addWuLiao, payload);
      if (callback) callback(response);
    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let object = []
      if (response.resData) {
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
        response.resData.map(item => {
          item.key = item.id;
          item.uid = item.id;
          item.url = env + item.path + '/' + item.name;
          item.thumbUrl = env + item.path + '/' + item.name;
          return item
        });
        object = response.resData

      }
      if (callback) callback(object);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
        if (obj.list[0] === null) {
          obj.list[0] = {}
        }
      }
      if (callback) callback(obj)
    },
    *fetchUcum({ payload, callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
      }
      if (callback) callback(obj)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRout, payload);
      if (callback) callback(response);
    },
    *deleteend({ payload, callback }, { call, put }) {
      const response = yield call(deleteend, payload);
      if (callback) callback(response)
    },
    *childadd({ payload, callback }, { call, put }) {
      const response = yield call(childAddRout, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteRout, payload);
      if (callback) callback(response);
    },
    *fetchRegion({ payload, callback }, { call, put }) {
      const response = yield call(fetchRegion, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },
    *fetchProduct({ payload, callback }, { call, put }) {
      const response = yield call(fetchProduct, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },
    *fetchUnit({ payload, callback }, { call, put }) {
      const response = yield call(queryWorktype, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj)
    },
    *genversionno({ payload, callback }, { call, put }) {
      const response = yield call(genversionnoRout, payload);
      if (callback) callback(response);
    },
    *materialId({ payload, callback }, { call, put }) {
      const response = yield call(materialIdRout, payload);
      const pageIndex = payload.pageIndex;
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
      if (callback) callback(obj)
    },
    *addChild({ payload, callback }, { call, put }) {
      const response = yield call(addChild, payload);
      if (callback) callback(response)
    },
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(upload, payload);
      if (callback) callback(response)
    },
    *uploadlist({ payload, callback }, { call, put }) {
      const response = yield call(uploadlist, payload);
      let obj = []
      if (response.resData) {
        obj = response.resData
        obj.map((item, i) => {
          item.key = item.id
          item.name = item.name
          item.uid = i
          item.url = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT' + item.path + '/' + item.name
          item.thumbUrl = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT' + item.path + '/' + item.name
          return item
        })
      }
      if (callback) callback(obj)
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);

      if (callback) callback(response);
    },
    *fetchTable({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj)
    },
    *fetchProcess({ payload, callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      let { pageIndex = 0 } = payload;
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
          return item
        })
      }
      const obj = {
        list: response.resData,
        pagination: {
          total: response.total,
          current: pageIndex + 1
        }
      };
      if (callback) callback(obj)
    },
    *default({ payload, callback }, { call, put }) {
      const response = yield call(defaultRout, payload);
      if (callback) callback(response);
    },
    *isversion({ payload, callback }, { call, put }) {
      const response = yield call(isVersionRout, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
  },
};
