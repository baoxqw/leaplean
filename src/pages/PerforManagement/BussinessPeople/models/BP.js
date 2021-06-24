import {
  addBP,
  fetchBP,
  fetchDept,
  fetchPerson,
  fetchProject,
  dataList
} from '@/services/BP';

export default {
  namespace: 'BP',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fetchBP, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBP, payload);
      if (callback) callback();
    },
    *fetchDept({ payload, callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if (callback) callback(response.resData);
    },
    *fetchPerson({ payload, callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
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
    *fetchProject({ payload, callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
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
      if (callback) callback(obj);
    },
    *dataList({ payload, callback }, { call, put }) {
      const response = yield call(dataList, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};
