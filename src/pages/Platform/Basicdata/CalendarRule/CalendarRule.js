import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import momentt from 'moment'
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Divider,
  Form,
  Popconfirm,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  TimePicker,
  message,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { toTree,getParentKey } from "@/pages/tool/ToTree";
import moment from './CalendarRuleUpdate';

const { TreeNode } = Tree;
const Search = Input.Search;
const { TextArea } = Input;
@connect(({ crule, loading }) => ({
  crule,
  loading: loading.models.crule,
}))
@Form.create()
class CalendarRule extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],
    dataList:[], //原始数据
    addtreeData:null,
    adddata:false,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,

    status:'',
    initData:{},
    node:{},
    cloneNode:{},
    addStatus:false,
    updateStatus:false,
    deleteStatus:false,
    allvalue:[]
  }

  onSelect = (selectedKeys, info) => {
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
      type: 'crule/newdata',
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
      let  obj = {
        ...values,
        sunday:values['sunday']?'1':'0',
        saturday:values['saturday']?'1':'0',
        monday:values['monday']?'1':'0',
        tuesday:values['tuesday']?'1':'0',
        wednesday:values['wednesday']?'1':'0',
        thursday:values['thursday']?'1':'0',
        friday:values['friday']?'1':'0',
        ondutytime:values.ondutytime?values.ondutytime.format('h:mm:ss'):'',
        offdutytime:values.offdutytime?values.offdutytime.format('h:mm:ss'):'',
      }
      if(status === '新建'){
        reqData = {
          pid:node.id?node.id:null,
          ...obj,
        }
      }else if(status === '编辑'){
        reqData = {
          pid:node.pid,
          id:node.id,
          ...obj
        }
      }

      dispatch({
        type:'crule/ruleadd',
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
                form.resetFields();
                this.setState({
                  cloneNode:{
                    ...this.state.cloneNode,
                    ...values
                  }
                })
              }
              dispatch({
                type: 'crule/newdata',
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
          /* if(status === '新建'){
             form.resetFields();
             this.setState({
               isdisabled:true,
               addStatus:false,
               updateStatus:false,
               deleteStatus:false,
             })
           }else{
             this.setState({
               isdisabled:true,
               addStatus:false,
               updateStatus:false,
               deleteStatus:false,
             })
           }
           dispatch({
             type: 'dapart/newdata',
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
           })*/
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
    const { dispatch } = this.props;
    const { node } = this.state;
    if(!node.id){
      message.error("请选择数据");
      return
    }
    dispatch({
      type: 'crule/delete',
      payload: {
        reqData:{
          id:node.id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type: 'crule/newdata',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData);
                  this.setState({
                    valueList: a,
                    node:{},
                    isdisabled:true
                  })
                }else{
                  this.setState({
                    valueList: [],
                    node:{},
                    isdisabled:true
                  })
                }
              }
            })
          })
        }
      }
    })
  }

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

  onClickCancle = ()=>{
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
  }


  onChanged = (value) => {
    
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
      type: 'crule/newdata',
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

  render() {
    const {
      form: { getFieldDecorator },
      form
    } = this.props;
    const { node,initData } = this.state;
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
    const {searchValue,isdisabled,expandedKeys,autoExpandParent} = this.state;

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
          <Card bodyStyle={{paddingTop:'16px'}} style={{ marginRight:'3%',width:'30%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
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
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              >
                {loop(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="工作日历规则" style={{ boxSizing:'border-box',width:'66%',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical"  onSubmit={this.handleSubmit}>
              <Form.Item label="工作日历规则编码">
                {getFieldDecorator('code',{
                  initialValue:node.code?node.code:'',
                  rules: [{required: true,message:'工作日历规则编码'}],
                })(<Input placeholder="请输入工作日历规则编码" disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="工作日历规则名称">
                {getFieldDecorator('name',{
                  initialValue:node.name?node.name:'',
                  rules: [{required: true}],
                })(<Input placeholder="工作日历规则名称" disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="上班时间">
                {getFieldDecorator('ondutytime',{
                  initialValue:node.ondutytime?momentt(node.ondutytime,'HH:mm:ss'):null,
                  rules: [{required: true}],
                })(
                  <TimePicker disabled={isdisabled} use24Hours format="h:mm:ss"  style={{width:'100%'}}/>,
                )}
              </Form.Item>
              <Form.Item label="下班时间">
                {getFieldDecorator('offdutytime', {
                  initialValue:node.offdutytime?momentt(node.offdutytime,'HH:mm:ss'):null,
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(<TimePicker use24Hours format="h:mm:ss" style={{width:'100%'}} disabled={isdisabled}/>,)}
              </Form.Item>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue:node.memo?node.memo:'',
                })(<TextArea rows={3} disabled={isdisabled} />)}
              </Form.Item>
              <Divider orientation="left">公休日设置</Divider>
              <Row gutter={16} style={{display:'flex',padding:'0 20px'}}>
                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('sunday',{
                    valuePropName: 'checked',
                    initialValue: node.sunday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周日</Checkbox>)}
                </Form.Item>
                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('monday',{
                    valuePropName: 'checked',
                    initialValue: node.monday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周一</Checkbox>)}
                </Form.Item>
                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('tuesday',{
                    valuePropName: 'checked',
                    initialValue: node.tuesday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周二</Checkbox>)}
                </Form.Item>
                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('wednesday',{
                    valuePropName: 'checked',
                    initialValue: node.wednesday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周三</Checkbox>)}
                </Form.Item>
              </Row>
              <Row gutter={16} style={{display:'flex',padding:'0 20px'}}>

                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('thursday',{
                    valuePropName: 'checked',
                    initialValue: node.thursday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周四</Checkbox>)}
                </Form.Item>

                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('friday',{
                    valuePropName: 'checked',
                    initialValue: node.friday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周五</Checkbox>)}
                </Form.Item>

                <Form.Item style={{width:'25%'}}>
                  {getFieldDecorator('saturday',{
                    valuePropName: 'checked',
                    initialValue: node.saturday== '1'?true:false,
                  })(<Checkbox disabled={isdisabled}>周六</Checkbox>)}
                </Form.Item>
              </Row>
              <div  style={{width:'100%',textAlign:'right'}}>

                <Button type="primary" disabled={isdisabled} htmlType="submit" style={{float:'right',marginLeft:'20px'}}>
                  提交
                </Button>
                <Button onClick={this.onClickCancle} style={{float:'right',}}>
                  取消
                </Button>

              </div>

            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CalendarRule;
