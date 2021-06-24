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
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TreeNode } = Tree;
import storage from '@/utils/storage'
// test git
const fieldLabels = {
  name: 'LP名称',
  shortname: 'LP简称',
  type: '性质',
  contactperson: '联系人',
  contactinfo: '联系方式',
  email: '电子邮件',
  subscribed: '认缴投资额',
  payin: '实缴投资额',
  paydate: '缴纳时间',
  memo: '备注',
};
const newtreeData = []
const sour = [
  {
    title: '中国',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '河南',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: '浙江',
        value: '0-0-2',
        key: '0-0-2',
      },
      {
        title: '上海',
        value: '0-0-3',
        key: '0-0-3',
      },
    ],
  },
  {
    title: '美国',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '纽约',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '洛杉矶',
        value: '0-1-2',
        key: '0-1-2',
      },
      {
        title: '芝加哥',
        value: '0-1-3',
        key: '0-1-3',
      },
    ],
  },
  {
    title: '韩国',
    value: '0-2',
    key: '0-2',
    children: [
      {
        title: '首尔',
        value: '0-2-1',
        key: '0-2-1',
      },
      {
        title: '仁川',
        value: '0-2-2',
        key: '0-2-2',
      },
    ],
  },
];
const DirectoryTree = Tree.DirectoryTree;

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

@connect(({ businessadmin, loading }) => ({
  businessadmin,
  loading: loading.models.businessadmin,
}))
@Form.create()
class BusinessAdmin extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],
    allvalue:[],
    dataList:[], //原始数据
    pid:null,
    id:null,
    initData:[],
    addtreeData:null,
    adddata:false,
  }
  onSelect = (selectedKeys, info) => {
    const { dispatch} = this.props;
    if(info.selectedNodes){
      if(!info.selectedNodes[0].props.dataRef){
        return
      }
      dispatch({
        type: 'roareaadminle/findnewdata',
        payload: {
          reqData:{
            id:info.selectedNodes[0].props.dataRef.id
          }
        },
        callback:(res)=>{

        }
      })
      this.setState({
        addtreeData:info.selectedNodes[0].props.dataRef.name,
        addpid:info.selectedNodes[0].props.dataRef.id,
        initData:info.selectedNodes[0].props.dataRef,
        treeData:info.selectedNodes[0].props.dataRef.pname,
        pid:info.selectedNodes[0].props.dataRef.pid,
        id:info.selectedNodes[0].props.dataRef.id,
      })
    }

  };

  onCheck = (checkedKeys, info) => {

  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'businessadmin/newdata',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData)
          this.setState({
            dataList:res.resData,
            valueList: a,
            allvalue:a
          })
        }
      }
    })

  }
  onChanged = value => {
    this.setState({ addid:value });
  };
  onChange = value => {
    this.setState({ value });
  };
  handleSubmit = e => {
    const { dispatch,form} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const obj = {
          ...values,
          agreement:values['agreement']?1:0,
          icon:values['icon']?values['icon']:null,
          pid:this.state.adddata?this.state.addpid:this.state.pid,
          id:this.state.adddata?'':this.state.id
        }
        dispatch({
          type: 'businessadmin/register',
          payload: {
            reqData:obj
          },
          callback:(res)=>{
            dispatch({
              type: 'businessadmin/newdata',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData)
                  this.setState({
                    dataList:res.resData,
                    valueList: a,
                    addtreeData:null,
                    treeData:null
                  })
                }
              }
            })
            form.resetFields();
            this.setState({isdisabled:true})
          }
        })
      }
    });
  };
  //编辑
  handleUpdate = e =>{
    this.setState({
      isdisabled:false,
      adddata:false,
    })
  }
  //新建
  handleModalVisible = (e,form) =>{
    this.setState({
      isdisabled:false,
      initData:[],
      adddata:true,
    })
  }
  handleRemove = e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'businessadmin/removenewdata',
      payload: {
        reqData:{
          id:this.state.id,
        }
      },
      callback:(res)=>{
        dispatch({
          type: 'businessadmin/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            if (res.resData){
              const a = toTree(res.resData)
              this.setState({
                dataList:res.resData,
                valueList: a
              })
            }
          }
        })
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
      form
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
    const {initData,isdisabled} = this.state;
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <h3 style={{borderBottom:'1px solid #f5f5f5',height:'50px',lineHeight:'50px'}}>地区分类</h3>
            <div >
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
                treeData={sour}
                defaultExpandedKeys={['0-0']}
                //onCheck={this.onCheck}
                //checkable
              >

              </Tree>
            </div>

          </Card>
          <Card title="分类明细--" style={{ flex:'1',width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <h2>00000</h2>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BusinessAdmin;
;
