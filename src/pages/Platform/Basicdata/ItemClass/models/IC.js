import {
  queryMaterial,
  addMaterial,
  deleteMaterial
} from '@/services/IC';

export default {
  namespace: 'IC',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryMaterial, payload);
 
      if(callback) callback(response)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMaterial, payload);

      if(callback) callback(response)
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteMaterial, payload);
 
      if(callback) callback(response)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
