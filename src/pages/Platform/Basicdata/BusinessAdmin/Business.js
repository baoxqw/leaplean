import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  Divider ,
  Button,
  Card,
  Tree,
  message, Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import BusinessAdd from '@/pages/Platform/Basicdata/BusinessAdmin/BusinessAdd';
import BusinessUpdate from '@/pages/Platform/Basicdata/BusinessAdmin/BusinessUpdate';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;
@connect(({ businessadmin, loading }) => ({
  businessadmin,
  queryLoading: loading.effects['businessadmin/fetch'],
  addLoading: loading.effects['businessadmin/add'],
}))
@Form.create()
class Business extends PureComponent {
  state = {
    valueList:[],
    dataList:[],
    page: {
      pageIndex:0,
      pageSize:10
    },
    conditions: [],
    expandedKeys: [],
    selectedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    query: '',
    info:{},
    addVisible:false,
    updateVisible:false,
    record:{}
  }

  columns = [
    {
      title: '客商编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '客商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属地区',
      dataIndex: 'areaclname',
      key: 'areaclname',
    },
    {
      title: '简称',
      dataIndex: 'shortname',
      key: 'shortname',
    },
    {
      title: '客商类型',
      dataIndex: 'custtype',
      key: 'custtype',
      render:(text,item)=>{
        if(text == 1){
          return '客商'
        }else if(text == 2){
          return '客户'
        }else if(text == 3){
          return '供应商'
        }
      },
    },
    {
      title: '所属地区',
      dataIndex: 'areaclid',
      key: 'areaclid',
    },
    {
      title: '简称',
      dataIndex: 'shortname',
      key: 'shortname',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '网址',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: '等级',
      dataIndex: 'custlevel',
      key: 'custlevel',
    },
    {
      title: '法人姓名',
      dataIndex: 'respsnname',
      key: 'respsnname',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '邮编',
      dataIndex: 'zipcode',
      key: 'zipcode',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'uscc',
      key: 'uscc',
    },
    {
      title: '注册资本',
      dataIndex: 'regmoney',
      key: 'regmoney',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      fixed:'right',
      render: (text, record) =>
        <Fragment>
          <a href="#javascript:;" onClick={(e) => this.handleUpdate(e,record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?"  onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
    },
  ];

  componentDidMount(){
    const { dispatch} = this.props;
    //  树的数据
    dispatch({
      type:'businessadmin/tree',
      payload:{},
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData)
          this.setState({
            dataList:res,
            valueList: a,
            allvalue:a
          })
        }
      }
    })
    //  表格的数据
    const object = {
      pageIndex:0,
      pageSize:10,
    }
    dispatch({
      type:'businessadmin/fetch',
      payload:object
    })
  }

  onChange = value => {

    this.setState({ value });
  };
  //查询
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props
    form.validateFieldsAndScroll((err, values) => {
      if(err) return;
      const { code } = values;
      dispatch({
        type: 'businessadmin/fetch',
        payload: {
          reqData: {
            value: code,
          },
          pageIndex: 0,
          pageSize: 10,
        },
      });
      this.setState({
        query: code,
        page: {
          pageIndex: 0,
          pageSize: 10,
        },
      });
    })
  };
  //取消
  handleReset = () => {
    const { dispatch, form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions: [],
      page: {
        pageIndex: 0,
        pageSize: 10,
      },
      query: '',
      expandedKeys: [],
      selectedKeys: []
    });
    dispatch({
      type: 'businessadmin/fetch',
      payload: {
        pageIndex: 0,
        pageSize: 10,
      },
    });
  };
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions, query } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      reqData: {
        value: query,
      },
    };
    if (conditions.length) {
      obj.conditions = conditions;
    }
    dispatch({
      type: 'businessadmin/fetch',
      payload: obj,
    });
    this.setState({
      page: obj,
    });
  };
  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'businessadmin/remove',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        if (res.errCode === '0') {
          message.success('删除成功', 1.5, () => {
            const { query, page,conditions } = this.state;
            dispatch({
              type: 'businessadmin/fetch',
              payload: {
                ...page,
                reqData: {
                  value: query,
                },
                conditions
              },
            });
          });
        } else {
          message.error('删除失败');
        }
      }
    })
  };

  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    this.setState({
      selectedKeys,
    });
    const obj = {
      pageIndex: 0,
      pageSize: 10,
    };
    if (info.selectedNodes[0]) {
      this.setState({
        info:info.selectedNodes[0].props.dataRef,
        conditions:[{
          code: 'AREACL_ID',
          exp: '=',
          value: info.selectedNodes[0].props.dataRef.id,
        }]
      });
      obj.conditions = [{
        code: 'AREACL_ID',
        exp: '=',
        value: info.selectedNodes[0].props.dataRef.id,
      }];
    } else {
      this.setState({
        conditions: [],
        info:{}
      });
    }
    dispatch({
      type: 'businessadmin/fetch',
      payload: obj,
    });
  };
  //编辑
  handleUpdate = (e, record) => {
    e.preventDefault();
    this.setState({
      record,
      updateVisible:true
    })
  };
  //新建
  handleModalVisible = () => {
    this.setState({
      addVisible:true
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
      businessadmin:{dataSor},
      form: { getFieldDecorator },
      queryLoading,
      addLoading,
      dispatch
    } = this.props;
    const { addVisible,updateVisible,record,conditions,searchValue, expandedKeys, selectedKeys, autoExpandParent,query,page,info } = this.state;

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


    const OnAdd = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'businessadmin/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("添加成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'businessadmin/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value:query
                    },
                    conditions
                  }
                })
              })
            }else{
              message.error("新建失败",1.5,()=>{
                clear(1)
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnData = {
      visible:addVisible,
      record:info,
      loading:addLoading
    }

    const OnUpdate = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'businessadmin/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({updateVisible:false,record: {}})
                clear()
                dispatch({
                  type:'businessadmin/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value:query
                    },
                    conditions
                  }
                })
              })
            }else{
              message.error("编辑失败",1.5,()=>{
                clear(1)
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          record: {}
        })
      }
    }
    const OnDataUpdate = {
      visible:updateVisible,
      record,
      loading:addLoading
    }

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card
          style={{ width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }}
          bordered={false}>
            <div style={{ overflow: 'hidden', float: 'right', marginTop: '3px' }}> {
              selectedKeys.length ? <Button icon="plus" type="primary" onClick={this.handleModalVisible}>
                新建
              </Button> : ''
            }</div>
            <div style={{overflow:'hidden',borderBottom:'1px solid #f5f5f5',}}>
              <h3 style={{height:'50px',lineHeight:'40px',float:'left'}}>客商档案</h3>
            </div>
            <div >
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
          <Card
          style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }}
          bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={16}>
                <Col md={14} sm={16}>
                  <FormItem label='综合查询'>
                    {getFieldDecorator('code')(<Input placeholder='请输入查询条件' />)}
                  </FormItem>
                </Col>
                <Col md={10} sm={16}>
                  <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
               取消
              </Button>
            </span>
                </Col>
              </Row>
            </Form>
            <div style={{ marginTop: 12 }}>
              <NormalTable
                style={{marginTop:'8px'}}
                loading={queryLoading}
                data={dataSor}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
              />
            </div>

            <BusinessAdd on={OnAdd} data={OnData}/>
            <BusinessUpdate on={OnUpdate} data={OnDataUpdate}/>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Business;

