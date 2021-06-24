import {
  fetchneed,
  deleteneed,
  finddept,
  addneed,
  addneedBatch,
  addapproval,
  fetchapproval,
  fetchapprovalchild,
  addapprovalchild,
  deleteapprovalchild,
  deleteapproval,
  generateA,
  generateB,
  approvalList,
  addBaveDemand,
  fetchdispatch,
  adddispatch,
  deletedispatch,
  fetchdispatchchild,
  adddispatchchild,
  adddispatchchildbatchadd,
  deletedispatchchild,
  TableSuperData,
  TableChildData,
  childBatchAdd,
  findChildData,
  fetchstorage,
  deletestorage,
  addstorage,
  fetchstoragechild,
  addstoragechild,
  deletestoragechild,
  fetchstock,
  addstock,
  fetchstockend,
  deletestock,
  findlocation,
  addpie,
  pailiaopiliang,
  kuwei,
  queryStationWork,
  fetchbook,
  fetchaspx,
  addsave,
  addsaveList,
  saveList,
  addsaveout,
  addsavenew,
  saveListNew,
  addsubapprove,
  fetchStockRedis
} from '@/services/MManage';
import { newdataPer, queryPersonal } from '@/services/api';
import { matype, queryMatemanage } from '@/services/material';
import { fetchstore, findrespository } from '@/services/RFile';
import { queryStation, queryArea } from '@/services/station';
import { queryBatch } from '@/services/BLibrary';

export default {
  namespace: 'MManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    redisExitData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWorktype, payload);
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
    *fetchStation({ payload, callback }, { call, put }) {
      const response = yield call(queryStation, payload);
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
    *fetchstorefile({ payload, callback }, { call, put }) {
      const response = yield call(fetchstore, payload);
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
            current: pageIndex + 1
          }
        };
      }
      if (callback) callback(obj)
    },
    *fetchArea({ payload, callback }, { call, put }) {
      const response = yield call(queryArea, payload);
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
    *fetchBatch({ payload, callback }, { call, put }) {
      const response = yield call(queryBatch, payload);
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
    *fetchstore({ payload, callback }, { call, put }) {
      const response = yield call(fetchstore, payload);
      let obj = [];
      if (response.resData && response.resData.length) {
        obj = response.resData
      }
      if (callback) callback(obj)
    },
    *findrespository({ payload, callback }, { call, put }) {
      const response = yield call(findrespository, payload);
      if (callback) callback(response);
    },
    *addsubapprove({ payload, callback }, { call, put }) {
      const response = yield call(addsubapprove, payload);
      if (callback) callback(response);
    },
    *fetchstock({ payload }, { call, put }) {
      const response = yield call(fetchstock, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      let { pageIndex = 0 } = payload;
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
        type: 'savestock',
        payload: obj,
      });
    },
    *fetchstorage({ payload }, { call, put }) {
      const response = yield call(fetchstorage, payload);
      const { pageIndex } = payload;
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
        });
        obj = {
          list: response.resData,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        }
      }
      yield put({
        type: 'savestorage',
        payload: obj,
      });
    },
    *findChildData({ payload, callback }, { call, put }) {
      const { selectedRowKeys } = payload;
      let arr = [];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const response = yield call(findChildData, { reqData: { id: selectedRowKeys[i] } });
        if (response && response.resData && response.resData.length) {
          arr.push(response.resData[0])
        }
      }
      if (callback) callback(arr)
    },
    *fetchneed({ payload, callback }, { call, put }) {
      const response = yield call(fetchneed, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
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
        type: 'saveneed',
        payload: obj,
      });
      if (callback) callback(obj)
    },
    *fetchdispatch({ payload, callback }, { call, put }) {
      const response = yield call(fetchdispatch, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      };
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id
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
      yield put({
        type: 'savedispatch',
        payload: obj,
      });
    },
    *fetchapproval({ payload }, { call, put }) {
      const response = yield call(fetchapproval, payload);
      const { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      if (response.resData) {
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
        type: 'saveapproval',
        payload: obj,
      });
    },
    *TableSuperData({ payload, callback }, { call, put }) {
      const response = yield call(TableSuperData, payload);
      if (callback) callback(response)
    },
    *addsave({ payload, callback }, { call, put }) {
      const response = yield call(addsave, payload);
      if (callback) callback(response)
    },
    *addsaveout({ payload, callback }, { call, put }) {
      const response = yield call(addsaveout, payload);
      if (callback) callback(response)
    },
    *addsaveList({ payload, callback }, { call, put }) {
      const response = yield call(addsaveList, payload);
      if (callback) callback(response)
    },

    *addpie({ payload, callback }, { call, put }) {
      const response = yield call(addpie, payload);
      if (callback) callback(response)
    },
    *fetchapprovalchild({ payload, callback }, { call, put }) {
      const response = yield call(fetchapprovalchild, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },

    *fetchstoragechild({ payload, callback }, { call, put }) {
      const response = yield call(fetchstoragechild, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      const { pageIndex = 0 } = payload;
      if (response.resData) {
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

    *TableChildData({ payload, callback }, { call, put }) {
      const response = yield call(TableChildData, payload);
      if (callback) callback(response);
    },
    *addsavenew({ payload, callback }, { call, put }) {
      const response = yield call(addsavenew, payload);
      if (callback) callback(response);
    },

    *fetchdispatchchild({ payload, callback }, { call, put }) {
      const response = yield call(fetchdispatchchild, payload);
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      if (response.resData) {
        response.resData.map(item => {
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addWorktype, payload);
      if (callback) callback(response);
    },
    *adddispatch({ payload, callback }, { call, put }) {
      const response = yield call(adddispatch, payload);
      if (callback) callback(response);
    },

    *adddispatchchild({ payload, callback }, { call, put }) {
      const response = yield call(adddispatchchild, payload);
      if (callback) callback(response);
    },

    *adddispatchchildbatchadd({ payload, callback }, { call, put }) {
      const response = yield call(adddispatchchildbatchadd, payload);
      if (callback) callback(response);
    },
    *fetchstockend({ payload, callback }, { call, put }) {
      const response = yield call(fetchstockend, payload);
      if (callback) callback(response);
    },

    *childBatchAdd({ payload, callback }, { call, put }) {
      const { reqDataList } = payload;

      for (let i = 0; i < reqDataList.length; i++) {
        const response = yield call(adddispatchchild, { reqData: { ...reqDataList[i] } });
        if (response.errMsg === "成功") {
          reqDataList[i].outId = response.id;
          reqDataList[i].tupdatetime = new Date()
        }
      }
      const response = yield call(saveListNew, { reqDataList });
      if (callback) callback(response);
    },

    *childBatchAddSSS({ payload, callback }, { call, put }) {
      const { reqDataList } = payload;

      let status = false;
      let name = '';
      for (let i = 0; i < reqDataList.length; i++) {
        const res = yield call(fetchstockend, { reqData: { materialId: reqDataList[i].materialId } });
        let count = 0;
        for (let j = 0; j < reqDataList.length; j++) {
          if (reqDataList[i].materialId === reqDataList[j].materialId) {
            count += reqDataList[j].amount;
          }
        }

        if (res.resData[0].amount < count) {
          name = reqDataList[i].materialName;
          status = true;
          break
        }
      }


      if (status) {
        callback({
          code: 0,
          name
        });
        return
      }
      if (callback) callback({ code: 1 });
    },

    *addstoragechild({ payload, callback }, { call, put }) {
      const response = yield call(addstoragechild, payload);
      if (callback) callback(response);
    },
    *approvalList({ payload, callback }, { call, put }) {
      const response = yield call(approvalList, payload);
      if (callback) callback(response);
    },
    *saveListNew({ payload, callback }, { call, put }) {
      const response = yield call(saveListNew, payload);
      if (callback) callback(response);
    },

    *saveList({ payload, callback }, { call, put }) {
      const response = yield call(saveList, payload);
      if (callback) callback(response);
    },

    *deleteapprovalchild({ payload, callback }, { call, put }) {
      const response = yield call(deleteapprovalchild, payload);
      if (callback) callback(response);
    },

    *deletestorage({ payload, callback }, { call, put }) {
      const response = yield call(deletestorage, payload);
      if (callback) callback(response);
    },

    *deletestoragechild({ payload, callback }, { call, put }) {
      const response = yield call(deletestoragechild, payload);
      if (callback) callback(response);
    },

    *deletedispatchchild({ payload, callback }, { call, put }) {
      const response = yield call(deletedispatchchild, payload);
      if (callback) callback(response);
    },
    *addapprovalchild({ payload, callback }, { call, put }) {
      const response = yield call(addapprovalchild, payload);
      if (callback) callback(response);
    },
    *deleteneed({ payload, callback }, { call, put }) {
      const response = yield call(deleteneed, payload);
      if (callback) callback(response);
    },
    *deleteapproval({ payload, callback }, { call, put }) {
      const response = yield call(deleteapproval, payload);
      if (callback) callback(response);
    },
    *finddept({ payload, callback }, { call, put }) {
      const response = yield call(finddept, payload);
      if (callback) callback(response);
    },
    *findlocation({ payload, callback }, { call, put }) {
      const response = yield call(findlocation, payload);
      if (callback) callback(response);
    },
    *newdata({ payload, callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *addneed({ payload, callback }, { call, put }) {
      const response = yield call(addneed, payload);
      if (callback) callback(response);
    },
    *addneedBatch({ payload, callback }, { call, put }) {
      const response = yield call(addneedBatch, payload);
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
    *matype({ payload, callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *addapproval({ payload, callback }, { call, put }) {
      const response = yield call(addapproval, payload);
      if (callback) callback(response);
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
    *generateA({ payload, callback }, { call, put }) {
      const response = yield call(generateA, payload);
      if (callback) callback(response)
    },
    *generateB({ payload, callback }, { call, put }) {
      const response = yield call(generateB, payload);
      if (callback) callback(response)
    },
    *addBaveDemand({ payload, callback }, { call, put }) {
      const response = yield call(addBaveDemand, payload);
      if (callback) callback(response)
    },
    *addstorage({ payload, callback }, { call, put }) {
      const response = yield call(addstorage, payload);
      if (callback) callback(response)
    },
    *deletedispatch({ payload, callback }, { call, put }) {
      const response = yield call(deletedispatch, payload);
      if (callback) callback(response)
    },
    *deletestock({ payload, callback }, { call, put }) {
      const response = yield call(deletestock, payload);
      if (callback) callback(response)
    },
    *addstock({ payload, callback }, { call, put }) {
      const response = yield call(addstock, payload);
      if (callback) callback(response)
    },
    *pailiaopiliang({ payload, callback }, { call, put }) {
      const response = yield call(pailiaopiliang, payload);
      if (callback) callback(response)
    },
    *kuwei({ payload, callback }, { call, put }) {
      const response = yield call(kuwei, payload);
      if (callback) callback(response)
    },
    *fetchAreaWork({ payload, callback }, { call, put }) {
      const response = yield call(queryStationWork, payload);
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
    *fetchStore({ payload, callback }, { call, put }) {
      const response = yield call(fetchstore, payload);
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
    *fetchbook({ payload, callback }, { call, put }) {
      const response = yield call(fetchbook, payload);
      let { pageIndex = 0 } = payload;
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
        }

      }
      if (callback) callback(obj)
      yield put({
        type: 'savebook',
        payload: obj,
      });
    },
    *fetchaspx({ payload, callback }, { call, put }) {
      const response = yield call(fetchaspx, payload);

      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination: {
          total: 0,
          current: 1

        }
      }
      if (response.resData && response.resData.length) {
        let arrOut = [];
        let arrWare = [];
        response.resData.map(item => {
          if (item.tableName === "OUT") {
            arrOut.push(item)
          }
          if (item.tableName === "WARE") {
            arrWare.push(item)
          }
        });

        for (let i = 0; i < arrWare.length; i++) {
          for (let j = 0; j < arrOut.length; j++) {
            if (arrWare[i].materialId === arrOut[j].materialId) {
              arrWare[i].outAmount = arrOut[j].amount;
            }
          }
        }

        arrWare.map(item => {
          item.key = item.materialId;
          item.count = (item.amount || 0) - (item.outAmount || 0);
          return item
        });
        obj = {
          list: arrWare,
          pagination: {
            total: response.total,
            current: pageIndex + 1
          }
        }

      }
      if (callback) callback(obj)
      yield put({
        type: 'saveaspx',
        payload: obj,
      });
    },
    *fetchStockRedis({ payload, callback }, { call, put }) {
      const response = yield call(fetchStockRedis, payload);
      console.log("response",response)
      let obj = [];
      if(response.resData){
        response.resData.map((item,index) =>{
          item.key = index;
        })
        obj = response.resData;
      }
      if(callback) callback(obj)
      yield put({
        type: 'redisExitData',
        payload: obj,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savestorage(state, action) {
      return {
        ...state,
        datastorage: action.payload,
      };
    },
    saveneed(state, action) {
      return {
        ...state,
        dataneed: action.payload,
      };
    },
    savestock(state, action) {
      return {
        ...state,
        datastock: action.payload,
      };
    },
    savedispatch(state, action) {
      return {
        ...state,
        datadispatch: action.payload,
      };
    },
    saveapproval(state, action) {
      return {
        ...state,
        dataapproval: action.payload,
      };
    },
    savebook(state, action) {
      return {
        ...state,
        databook: action.payload,
      };
    },
    saveaspx(state, action) {
      return {
        ...state,
        dataaspx: action.payload,
      };
    },
    redisExitData(state, action) {
      return {
        ...state,
        redisExitData: action.payload,
      };
    },
  },
};
