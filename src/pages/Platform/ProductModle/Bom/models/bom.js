import {
  queryRole, finddefault, fetchWork, fetchUnit, addbom, findversion, findbomlist,
  deletebom, fetchchild, addchild, deletechild, subti,
  defaultChange,findVersion,
} from '@/services/productmodle';
import { matype, queryMatemanage, fetchUcum,fetchMataCon } from '@/services/material';
import { addWuLiao, addPersonal } from '@/services/porder';
import { } from '@/services/material';
import { deleteend, fetchList, upload } from '@/services/rout';

import { message } from 'antd';

export default {
  namespace: 'bom',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchMataCon({ payload, callback }, { call, put }) {
      const response = yield call(fetchMataCon, payload);
      console.log("r",response)
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1
        },
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if (callback) callback(obj)
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
          return item
        })
        const obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
        yield put({
          type: 'save',
          payload: obj,
        });
      }

    },
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response)
    },
    *findVersion({ payload, callback }, { call, put }) {
      const response = yield call(findVersion, payload);
      if (callback) callback(response)
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
    *addWuLiao({ payload, callback }, { call, put }) {
      const response = yield call(addWuLiao, payload);
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(upload, payload);
      if (callback) callback(response)
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let object = []
      if (response.resData) {
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
    *findversion({ payload, callback }, { call, put }) {
      const response = yield call(findversion, payload);
      if (callback) callback(response)
    },
    *finddefault({ payload, callback }, { call, put }) {
      const response = yield call(finddefault, payload);
      if (callback) callback(response)
    },
    *subti({ payload, callback }, { call, put }) {
      const response = yield call(subti, payload);
      if (callback) callback(response)

    },
    *default({ payload, callback }, { call, put }) {
      const response = yield call(defaultChange, payload);
      if (callback) callback(response)

    },
    *findbomlist({ payload, callback }, { call, put }) {
      const response = yield call(findbomlist, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      let { pageIndex = 0 } = payload;
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
          return item
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        }
      }
      if (callback) callback(obj)
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
      }
      if (response.resData) {
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }

      if (callback) callback(obj)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addbom, payload);
      console.log('---新建之后',response)
      if (callback) callback(response)

    },
    *addchild({ payload, callback }, { call, put }) {
      const response = yield call(addchild, payload);
      if (callback) callback(response)

    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deletebom, payload);
      if (callback) callback(response)

    },
    *deletechild({ payload, callback }, { call, put }) {
      const response = yield call(deletechild, payload);
      if (callback) callback(response)

    },
    *deleteend({ payload, callback }, { call, put }) {
      const response = yield call(deleteend, payload);
      if (callback) callback(response)
    },
    *fetchWork({ payload, callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
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
      const response = yield call(fetchUnit, payload);
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
    *fetchchild({ payload, callback }, { call, put }) {
      const response = yield call(fetchchild, payload);
      let obj = []
      if (response.resData) {
        obj = response.resData
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
  },
};
