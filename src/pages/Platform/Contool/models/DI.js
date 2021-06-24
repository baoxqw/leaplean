import { queryStation, addfile,addfilekehu,addList,addListBOm } from '@/services/DI';

export default {
    namespace: 'DI',
    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryStation, payload);
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
        },
        *addfile({ payload, callback }, { call, put }) {
            const response = yield call(addfile, payload);
            if (callback) callback(response);
        },
        *addfilekehu({ payload, callback }, { call, put }) {
            const response = yield call(addfilekehu, payload);
            if (callback) callback(response);
        },
        *addList({ payload, callback }, { call, put }) {
            const response = yield call(addList, payload);
            if (callback) callback(response);
        },
      *addListBOm({ payload, callback }, { call, put }) {
        const response = yield call(addListBOm, payload);
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


