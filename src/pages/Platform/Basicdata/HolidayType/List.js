import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  TreeSelect ,
  Button,
  Card,
  Tree,
  message, Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { toTree,getParentKey,dataAddKey } from "@/pages/tool/ToTree";

const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ holiday, loading }) => ({
  holiday,
  loading: loading.models.holiday,
}))
@Form.create()
class List extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],

    dataList:[], //原始数据

    initData:[],
    addtreeData:null,
    adddata:false,

    status:'',

    node:{},

    cloneNode:{},

    addStatus:false,
    updateStatus:false,
    deleteStatus:false,
    allvalue:[],

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }

  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    if(info.selectedNodes[0]){
      const node = info.selectedNodes[0].props.dataRef;
      this.setState({
        node,
        isdisabled:true,
        cloneNode:node,
      })
    }else{
      this.setState({
        node:{},
        isdisabled:true,
        addStatus:false,
        updateStatus:false,
        deleteStatus:false,
      })
    }
  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'holiday/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            dataList:res.resData,
            valueList: a,
          })
        }
      }
    })
  }

  onChanged = (value,label, extra) => {
    this.setState({
      node:{
        ...this.state.node,
        pid:value,
      }
    });
  };

  onFocusValue = ()=>{
    const { dispatch} = this.props;
    dispatch({
      type: 'holiday/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            allvalue:a
          })
        }
      }
    })
  }

  onChange = value => {
   
    this.setState({ value });
  };

  handleSubmit = e => {
    const { dispatch,form } = this.props;
    const { status,node } = this.state;
    e.preventDefault();
    if(!status){
      message.error("请选择操作方式")
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      let reqData;
      if(status === '新建'){
        reqData = {
          pid:node.id?node.id:null,
          ...values
        }
      }else if(status === '编辑'){
        reqData = {
          pid:node.pid,
          id:node.id,
          ...values
        }
      }
      dispatch({
        type:'holiday/addData',
        payload:{
          reqData:{
            ...reqData,
          }
        },
        callback:(res)=>{
          if(res){
            message.success(`${status === '新建'?'新建成功':'编辑成功'}`,1.5,()=>{
              if(status === '新建'){
                form.resetFields();
              }
              if(status === '编辑'){
                this.setState({
                  cloneNode:{
                    ...this.state.cloneNode,
                    ...values
                  }
                })
              }
              dispatch({
                type: 'holiday/newdatasss',
                payload: {
                  reqData:{}
                },
                callback:(res)=>{
                  if (res.resData){
                    const a = toTree(res.resData);
                    this.setState({
                      dataList:res.resData,
                      valueList: a,
                      isdisabled:true,
                      addStatus:false,
                      updateStatus:false,
                      deleteStatus:false,
                    })
                  }
                }
              })
            })
          }
        }
      })
    });
  };
  //编辑
  handleUpdate = e =>{
    const { node } = this.state;
    if(!node.id){
      message.error("请选择节点");
      return
    }
    this.setState({
      status:'编辑',
      isdisabled:false,
      addStatus:true,
      deleteStatus:true,
    })
  }
  //新建
  handleModalVisible = () =>{
    this.setState({
      isdisabled:false,
      status:'新建',
      node:{
        id:this.state.node.id,
        pName:this.state.node.name,
        pid:this.state.node.pid,
      },
      updateStatus:true,
      deleteStatus:true,
    })
  }

  handleRemove = e =>{
    const { dispatch,form} = this.props;
    const { node } = this.state;
    if(!node.id){
      message.error("请选择数据");
      return
    }
    dispatch({
      type: 'holiday/removenewdata',
      payload: {
        reqData:{
          id:node.id,
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type: 'holiday/newdatasss',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData);
        
                  this.setState({
                    dataList:res.resData,
                    valueList: a,
                    node:{}
                  })
                }else{
                  this.setState({
                    dataList:[],
                    valueList: [],
                    node:{}
                  })
                }
              }
            })
          })
        }
      }
    })
  }

  cancled = ()=>{
    const { form} = this.props;
    if(this.state.isdisabled){
      return
    };
    form.resetFields();

    this.setState({
      node:this.state.cloneNode,
      isdisabled:true,
      addStatus:false,
      updateStatus:false,
      deleteStatus:false,
    })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });
  yy = data =>
    data.map(item => {
      const { TreeNode } = TreeSelect;
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList,dataList } = this.state;

    if(!value){
      this.setState({expandedKeys:[]})
      return
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
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

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset:12,
        },
        sm: {
          span: 16,
          offset:14,
        },
      },
    };
    const { node,isdisabled,searchValue,expandedKeys,autoExpandParent } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
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
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card bodyStyle={{paddingTop:'16px'}} style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              {
                this.state.addStatus?<Button icon="plus" disabled type="primary" >
                  新建
                </Button>:<Popconfirm title={node.id?"是否创建当前项子节点":"新建节点"} onConfirm={() => this.handleModalVisible()}>
                  <Button icon="plus" disabled={this.state.addStatus} type="primary" >
                    新建
                  </Button>
                </Popconfirm>
              }
              <Button style={{marginLeft:'20px'}} disabled={this.state.updateStatus} onClick={() => this.handleUpdate(true)}>
                编辑
              </Button>
              {
                this.state.deleteStatus?<Button disabled style={{marginLeft:'20px'}}  >
                  刪除
                </Button>:<Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleRemove()}>
                  <Button  style={{marginLeft:'20px'}}  >
                    刪除
                  </Button>
                </Popconfirm>
              }
            </div>
            <div style={{marginTop:'20px'}}>
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
              <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
              >
                {loop(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="假日类型" style={{ flex:'1',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical"  onSubmit={this.handleSubmit}>
              <Form.Item label="假日类型编码：">
                {getFieldDecorator('code', {
                  initialValue:node.code?node.code:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写假日类型编码',
                    },
                  ],
                })(<Input placeholder='请填写假日类型编码' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="假日类型名称：">
                {getFieldDecorator('name', {
                  initialValue:node.name?node.name:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写假日类型名称',
                    },
                  ],
                })(<Input placeholder='请填写假日类型名称' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="上级分类：">
                {getFieldDecorator('pName', {
                  initialValue:node.pName?node.pName:''
                })(<TreeSelect
                  treeDefaultExpandAll
                  onChange={this.onChanged}
                  onFocus={this.onFocusValue}
                  placeholder='上级分类'
                  disabled={isdisabled}>
                  {this.yy(this.state.allvalue)}
                </TreeSelect>)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" style={{marginRight:'20px'}}>
                  提交
                </Button>
                <Button onClick={this.cancled}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default List;

