import {
  fetchPrepareList, addlist, newdataType, addchild, deleteChild, addStation, addNeed, newdataDept,
  fetchMata, addself, deleteSelf, childFetch, fetchWork, childFetchProject,
  childFetchProjectStage, addselfStage, findPlan
} from '@/services/pfor';
import { bussTree, newdataList, } from '@/services/WO';
import { newdataPer, queryPersonal } from '@/services/api';

import { fetchPrepare } from '@/services/modelType';
import { fetchUcum, matype, queryMatemanage } from '@/services/material';
import { addWuLiao, addPersonal } from '@/services/porder';
import { queryPro } from '@/services/NPro';
export default {
  namespace: 'pfor',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchPrepareList, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
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
    *fetchCode({ payload,callback}, { call, put }) {
      const response = yield call(queryPro, payload);
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
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1,
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchWork({ payload, callback }, { call, put }) {
      const response = yield call(fetchWork, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *childFetch({ payload, callback }, { call, put }) {
      const response = yield call(childFetch, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *childFetchProject({ payload, callback }, { call, put }) {
      const response = yield call(childFetchProject, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *childFetchProjectStage({ payload, callback }, { call, put }) {
      const response = yield call(childFetchProjectStage, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addlist, payload);
      if (callback) callback(response);
    },
    *addselfStage({ payload, callback }, { call, put }) {
      const response = yield call(addselfStage, payload);
      if (callback) callback(response);
    },
    *addself({ payload, callback }, { call, put }) {
      const response = yield call(addself, payload);
      if (callback) callback(response);
    },
    *deleteSelf({ payload, callback }, { call, put }) {
      const response = yield call(deleteSelf, payload);
      if (callback) callback(response);
    },
    *addStation({ payload, callback }, { call, put }) {
      const response = yield call(addStation, payload);

      if (callback) callback(response);
    },
    *findtree({ payload, callback }, { call, put }) {
      const response = yield call(bussTree, payload);
      if (callback) callback(response);
    },
    *fetchMata({ payload, callback }, { call, put }) {
      const response = yield call(fetchMata, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
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
    *fetchHitch({ payload, callback }, { call, put }) {
      const response = yield call(fetchPrepare, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }

      if (callback) callback(obj);
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *newdataDept({ payload, callback }, { call, put }) {
      const response = yield call(newdataDept, payload);
      let obj = []
      if (response.resData) {
        obj = response.resData
      }
      if (callback) callback(response);
    },
    *newdataType({ payload, callback }, { call, put }) {
      const response = yield call(newdataType, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *addchild({ payload, callback }, { call, put }) {
      const response = yield call(addchild, payload);

      if (callback) callback(response);
    },
    *findPlan({ payload, callback }, { call, put }) {
      const response = yield call(findPlan, payload);

      if (callback) callback(response);
    },
    *deleteChild({ payload, callback }, { call, put }) {
      const response = yield call(deleteChild, payload);

      if (callback) callback(response);
    },
    *fetchTable({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
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
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *fetchMataMtaterial({ payload, callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
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
    *fetchUcum({ payload, callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);

      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData && response.resData.length) {
        response.resData.map(item => {
          item.key = item.id;
        })
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
    *addWuLiao({ payload, callback }, { call, put }) {
      const response = yield call(addWuLiao, payload);
      if (callback) callback(response);
    },
    *addNeed({ payload, callback }, { call, put }) {
      const response = yield call(addNeed, payload);
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
  },
};
