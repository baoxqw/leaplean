import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Input,
  Tree,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import { getParentKey,toTreeMaterial } from '@/pages/tool/ToTree';
import { groupBy } from '@/pages/tool/Group/index';

const Search = Input.Search;
const { TreeNode } = Tree;

@connect(({ porder, loading }) => ({
  porder,
  loading: loading.models.porder,
}))
@Form.create()
class SmallOk extends PureComponent {
  state = {
    BStatus:false,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,

    dataList:[],
    valueList:[],

    tableList:[],
    dataObj:{},

    minTree:null
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const { dispatch } = this.props;
      const { materialBaseId,taskId } = nextProps.data.record;
      dispatch({
        type:'porder/findNum',
        payload:{
          pageIndex:0,
          pageSize:1000000,
          reqData:{
            taskId
          }
        },
        callback:(res)=>{
          if(res.list.length){
            res.list.map(item=>{
              if(item.materialId === materialBaseId){
                item.oneNum = 1;
              }
            })
            res.list = res.list.sort((a,b)=>{
              return a.level - b.level
            })
            const list = JSON.stringify(res.list);
            const tree = toTreeMaterial(JSON.parse(list));
            let parseList = JSON.parse(list);
            this.minQitaoTree(parseList,parseList[parseList.length - 1].level,parseList[0].level?parseList[0].level:parseList[parseList.length - 1].level-1);
            parseList.map(item =>{
              if(item.materialId === materialBaseId){
                item.stock = item.stock - item.amount;
              }
            })
            let d = {}
            parseList.map(item =>{
              if(item.materialId === materialBaseId){
                d = item;
              }
            })
            this.setState({
              dataList:res.list,
              valueList:tree,
              tableList:res,
              dataObj:nextProps.data.record,
              minTree:d.stock
            })
          }
        }
      })
    }
  }

  minQitaoTree = (list,level,minLevel)=>{
    let status = true;
    const levelList = [];
    // ????????????????????????
    for(let i = 0;i<list.length;i++){
      if(list[i].level === level){
        const filterData = list.filter(item =>{
          return item.materialId === list[i].fatherMaterialId
        })
        levelList.push({
          data:list[i],
          pData:filterData.length?filterData[0]:null,
          pid:list[i].fatherMaterialId?list[i].fatherMaterialId:null
        })
      }
    }
    // ????????????id??????
    const groupList = groupBy(levelList,(item)=>{
      return item.pid
    })
    // ??????????????????????????????
    for(let i = 0;i<groupList.length;i++){
      const dataList = groupList[i];
      let maxNum = 0;
      for(let j = 0;j<dataList.length;j++){
        const jData = dataList[j].data;
        const { oneNum,stock } = jData;
        if(!stock){
          maxNum = 0;
          status = false;
          break;
        }else{
          const num = parseInt(stock / oneNum);
          // ???????????????0????????????
          if(j === 0){
            maxNum = num;
          }else{
            if(num > 0){
              if(num < maxNum){
                maxNum = num;
              }
            }else{
              status = false;
              maxNum = 0;
              break;
            }
          }
        }
      }
      if(!maxNum){
        status = false;
        break;
      }else{
        list.map(item =>{
          if(item.materialId === dataList[0].pid){
            item.stock = maxNum + item.stock;
          }
        })
      }
    }
    if(status && level !== minLevel){
      this.minQitaoTree(list,level-1,minLevel)
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      this.setState({
        BStatus:true
      })
      let obj = {
        ...values,
        prodquan:Number(values.prodquan),
        procersscards:Number(values.procersscards),
        mode:Number(this.state.value)
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    this.clear();
    onCancel()
  }

  clear = ()=> {
    const { dispatch,data:{record} } = this.props;
    dispatch({
      type:'porder/findNum',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:1000000,
          taskId:record.taskId
        }
      },
      callback:(res)=>{
        if(res.list.length){
          res.list[0].oneNum = 1;
        }
        this.setState({
          tableList:res,
        })
      }
    })
  }

  //??????
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    dispatch({
      type:'porder/findNum',
      payload:{
        reqData:{
          taskId:nextProps.data.record.taskId
        }
      },
    })
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList,dataList } = this.state;
    if(!value){
      this.setState({expandedKeys:[]})
      return
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.materialName.indexOf(value) > -1) {
          return getParentKey(item.id, valueList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeys:strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (selectedKeys, info) => {
    if(selectedKeys.length){
      const { props:{ dataRef } } = info.selectedNodes[0];
      const data = JSON.parse(JSON.stringify(dataRef));
      if('children' in data){
        delete data.children
      }
      this.setState({
        tableList:{
          list:[data]
        }
      })
    }else{
      const { dispatch} = this.props;
      const { dataObj } = this.state;
      dispatch({
        type:'porder/findNum',
        payload:{
          reqData:{
            pageIndex:0,
            pageSize:1000000,
            taskId:dataObj.taskId
          }
        },
        callback:(res)=>{
          if(res.list.length){
            res.list[0].oneNum = 1;
          }
          this.setState({
            tableList:res,
          })
        }
      })
    }
  };

  render() {
    const {
      //porder:{ dataNum },
      loading,
      on,
      data
    } = this.props;

    const { onCancel } = on;

    const {searchValue,expandedKeys,autoExpandParent,valueList,tableList} = this.state;

    const { visible } = data;

    const columns = [
      {
        title: '????????????',
        dataIndex: 'materialName',
      },
      {
        title: '????????????',
        dataIndex: 'materialCode',
      },
      {
        title: '????????????',
        dataIndex: 'grossDemandNum',
      },
      {
        title:'????????????',
        dataIndex: 'netDemandNum',
      },
      {
        title: '???????????????',
        dataIndex: 'oneNum',
      },
      {
        title: '??????',
        dataIndex: 'level',
      },
      {
        title: '???????????????',
        dataIndex: 'amount',
      },
      {
        title: '???????????????',
        dataIndex: 'planNum',
      },
      {
        title:'??????',
        dataIndex: 'grphid',
      },
      {
        title: '?????????',
        dataIndex: 'workName',
      },
      {
        title:'??????',
        dataIndex: 'model',
      },

      {
        title:'????????????',
        dataIndex: 'config',
      },
      {
        title:'????????????',
        dataIndex: 'needed',
      },
      {
        title:'????????????',
        dataIndex: 'configured',
      },
      {
        title:'????????????',
        dataIndex: 'transfer',
      },
      {
        title:'????????????',
        dataIndex: 'satisfaction',
      },
      {
        title:'??????',
        dataIndex: 'status'
      },
      {
        title:'??????',
        dataIndex: 'duration',
      },
      {
        title:'????????????',
        dataIndex: 'planStartDate',
      },
      {
        title:'????????????',
        dataIndex: 'planEndDate',
      },
      {
        title:'??????????????????',
        dataIndex: 'suppliesCode',
      },
      {
        title:'??????',
        dataIndex: 'memo',
      },
      {
        title:"",
        width:100,
        dataIndex: 'caozuo',
      }
    ];

    const loop = data =>
      data.map(item => {
        const index = item.materialName.indexOf(searchValue);
        const beforeStr = item.materialName.substr(0, index);
        const afterStr = item.materialName.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.materialName}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });

    return (
      <Modal
        title="?????????????????????"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        //onOk={()=>this.handleOk(onOk)}
        footer={false}
      >
        <div style={{display:'flex',height: `${window.innerHeight > 960 ? 760 : window.innerHeight / 1.5}px` }}>
          <div style={{ width:'28%',boxSizing:'border-box',overflow:'auto' }}>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
            <Tree
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={this.onSelect}
            >
              {loop(valueList)}
            </Tree>
          </div>
          <div style={{ width:'70%',boxSizing:'border-box',overflow:'hodden',marginLeft:'2%' }}>
            <NormalTable
              loading={loading}
              data={tableList}
              columns={columns}
              pagination={false}
            />

            <div style={{padding:18,display:'flex',justifyContent:'flex-end'}}>
              <h3>??????????????????: { this.state.minTree }</h3>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default SmallOk;
