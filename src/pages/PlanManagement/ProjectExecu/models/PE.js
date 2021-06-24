import { tree, findChild, TaskCode, findRight, findRightPlan, findRightTask, findRightAll } from '@/services/PE';

export default {
    namespace: 'PE',
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
        *tree({ payload, callback }, { call, put }) {
            const response = yield call(tree, payload);

            let obj = []
            if (response.resData) {
                obj = response.resData;
                obj.map((item, i) => {
                    item.key = item.id + "一"
                    item.newCode = item.productNoticeCode
                })
            }
            if (callback) callback(obj)
        },
        *findChild({ payload, callback }, { call, put }) {
            const response = yield call(findChild, payload);
            let obj = []
            if (response.resData) {
                obj = response.resData;
                obj.map((item, i) => {
                    item.key = item.id + "二"
                    item.newCode = `${item.code}${item.graphid ? `【${item.graphid}】` : ''}`
                })
            }
            if (callback) callback(obj)
        },
        *TaskCode({ payload, callback }, { call, put }) {
            const response = yield call(TaskCode, payload);
            let obj = []
            if (response.resData) {
                obj = response.resData;
                obj.map((item, i) => {
                    item.key = item.id + "三"
                    item.newCode = `${item.code}${item.graphid ? `【${item.graphid}】` : ''}`
                })
            }
            if (callback) callback(obj)
        },
        *findRight({ payload, callback }, { call, put }) {
            const response = yield call(findRight, payload);
            let obj = []
            if (response.resData) {
                response.resData.map(item => {
                    item.key = item.id + "ORI";
                });
                obj = response.resData
            }
            if (callback) callback(obj)

        },
        *findRightPlan({ payload, callback }, { call, put }) {
            const response = yield call(findRightPlan, payload);
            let obj = []
            if (response.resData) {
                response.resData.map(item => {
                    item.key = item.id + "PLAN";
                });
                obj = response.resData
            }
            if (callback) callback(obj)
        },
        *findRightTask({ payload, callback }, { call, put }) {
            const response = yield call(findRightTask, payload);
            let obj = []
            if (response.resData) {
                response.resData.map(item => {
                    item.key = item.id + "Task";
                });
                obj = response.resData
            }
            if (callback) callback(obj)
        },
        *findRightAll({ payload, callback }, { call, put }) {
            const response = yield call(findRightAll, payload);
            let obj = []
            if (response.resData) {
                response.resData.map(item => {
                    item.key = item.id + "All";
                    item.taskCode = item.code
                });
                obj = response.resData
            }
            yield put({
                type: 'save',
                payload: obj,
            });
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
    },
};
