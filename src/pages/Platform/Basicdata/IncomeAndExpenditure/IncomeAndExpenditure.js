import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  TextArea,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Select,
  Modal,
  message, Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { Option } = Select;
const { TreeNode } = Tree;
import storage from '@/utils/storage'
// test git

const splitSymbol = "-";
const dataAddKey = (data,Pindex='') => {
  return data.map((item, index) => {
    item.key = Pindex+''+index;
    if(item.children){
      dataAddKey(item.children,`${item.key}${splitSymbol}`)
    }
    return item;
  })
}

function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.routes;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {};
  data.forEach((item) =>{
    map[item.id] = item;
  });
  let val = [];
  data.forEach((item)=>{
    //item.key = item.id;
    // 以当前遍历项的pid,去map对象中找到索引的id
    let parent = map[item.pid];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || ( parent.children = [] )).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

@connect(({ IAE, loading }) => ({
  IAE,
  loading: loading.models.IAE,
}))
@Form.create()
class IncomeAndExpenditure extends PureComponent {
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
    allvalue:[]
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
      type: 'IAE/newdatasss',
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
      type: 'IAE/newdatasss',
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
      message.error("请选择操作方式");
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
        type:'IAE/addData',
        payload:{
          reqData:{
            ...reqData,
          }
        },
        callback:(res)=>{
          
          if(res.errMsg === "成功"){
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
                type: 'IAE/newdatasss',
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
      type: 'IAE/removenewdata',
      payload: {
        reqData:{
          id:node.id,
        }
      },
      callback:(res)=>{
       
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type: 'IAE/newdatasss',
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
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

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
    const { node,isdisabled } = this.state;
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
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
            <h3 style={{borderBottom:'1px solid #f5f5f5',height:'50px',lineHeight:'50px'}}>所有数据</h3>
            <div >
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="分类明细" style={{ flex:'1',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical"  onSubmit={this.handleSubmit}>
              <Form.Item label="收支项目编号：">
                {getFieldDecorator('code', {
                  initialValue:node.code?node.code:'',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请填写收支项目编号' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="收支项目名称：">
                {getFieldDecorator('name', {
                  initialValue:node.name?node.name:'',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请填写收支项目名称' disabled={isdisabled}/>)}
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
              <Form.Item label="是否收入：">
                {getFieldDecorator('incomeflag', {
                  initialValue:node.incomeflag
                })(<Select placeholder="请选择是否收入" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="是否支出：">
                {getFieldDecorator('outflag', {
                  initialValue:node.outflag
                })(<Select placeholder="请选择是否支出" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="是否收支：">
                {getFieldDecorator('ioflag', {
                  initialValue:node.ioflag
                })(<Select placeholder="请选择是否收支" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="封存标志：">
                {getFieldDecorator('sealflag', {
                  initialValue:node.sealflag
                })(<Select placeholder="请选择封存标志" disabled={isdisabled}>
                  <Option value={0}>未封存</Option>
                  <Option value={1}>已封存</Option>
                </Select>)}
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

export default IncomeAndExpenditure;

