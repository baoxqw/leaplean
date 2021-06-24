
import { fetchUcum, matype, queryMatemanage } from '@/services/PL';
import {  bussTree } from '@/services/WO';
import {  fetchPrepareList } from '@/services/pfor';

export default {
    namespace: 'PL',
    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryStation, payload);
            const pageIndex = payload.pageIndex;
            let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
            if (response.resData) {
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
        *fetchTable({ payload }, { call, put }) {
            const response = yield call(fetchPrepareList, payload);
            const pageIndex = payload.pageIndex;
            let obj = {
        list: [],
        pagination:{
          total: 0,
          current: 1

        }
      }
            if (response.resData) {
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
                type: 'savetable',
                payload: obj,
            });
        },
        *tree({ payload,callback }, { call, put }) {
            const response = yield call(bussTree, payload);
            let obj = []
            if(response.resData){
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
        savetable(state, action) {
            return {
                ...state,
                datatable: action.payload,
            };
        },

    },
};
