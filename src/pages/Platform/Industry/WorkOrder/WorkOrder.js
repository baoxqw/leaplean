import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  Button,
  Card,
  Tree,
  message,
  Popconfirm, Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import WorkOrderAdd from '@/pages/Platform/Industry/WorkOrder/WorkOrderAdd';
import WorkOrderUpdate from '@/pages/Platform/Industry/WorkOrder/WorkOrderUpdate';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';
import DetailLook from '@/pages/MatterManage/MaterialApproval/DetailLook';
import storage from '@/utils/storage';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ WO, loading }) => ({
  WO,
  queryLoading: loading.effects['WO/fetch'],
  addLoading: loading.effects['WO/add'],
  subLoading: loading.effects['WO/addsubapprove'],
}))
@Form.create()
class WorkOrder extends PureComponent {
  state = {
    valueList: [],
    dataList: [],
    page: {
      pageIndex: 0,
      pageSize: 10,
    },
    conditions: [],
    expandedKeys: [],
    selectedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    query: '',
    info: {},
    addVisible: false,
    updateVisible: false,
    record: {},
    rowId:null,
    detailVisible:false,
    approvalStatus:false,
    workRole:false,
  };

  columns = [
    {
      title: '工作令编码',
      dataIndex: 'code',
      key: 'code',

    },
    {
      title: '工作令名称',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: '单据状态',
      dataIndex: 'status',
      key: 'status',

    },
    {
      title: '项目分类号',
      dataIndex: 'developCategory',
      key: 'developCategory'
    },
    {
      title: '项目名称',
      dataIndex: 'modelNumber',
      key: 'modelNumber',

    },
    {
      title: '型号',
      dataIndex: 'pname',
      key: 'pname',
    },
    {
      title: '项目分类号',
      dataIndex: 'developCategory',
      key: 'developCategory',
    },
    {
      title: '经费来源',
      dataIndex: 'sourceOfFunding',
      key: 'sourceOfFunding',

    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',

    },
    {
      title: '终止时间',
      dataIndex: 'endDate',
      key: 'endDate',

    },
    {
      title: '停止标志',
      dataIndex: 'stopSign',
      key: 'stopSign',

    },
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',

    },
    {
      title: '申请部门',
      dataIndex: 'deptName',
      key: 'deptName',

    },
    {
      title: '延期使用日期',
      dataIndex: 'extension',
      key: 'extension',

    },
    {
      title: '工作令描述',
      dataIndex: 'description',
      key: 'description',

    },
    {
      title: '研制状态',
      dataIndex: 'developmentName',
      key: 'developmentName',

    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      fixed: 'right',
      render: (text, record) =>
        <Fragment>
          <a href="#javascript:;" onClick={(e) => this.handleUpdate(e, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>

        </Fragment>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    //  树的数据
    dispatch({
      type: 'WO/tree',
      payload: {},
      callback: (res) => {
        if (res) {
          const a = toTree(res);
          this.setState({
            dataList: res,
            valueList: a,
          });
        }else{
          this.setState({
            dataList: [],
            valueList: [],
          });
        }
      },
    });
    //  表格的数据
    const object = {
      pageIndex: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'WO/fetch',
      payload: object,
    });
  }

  //删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'WO/remove',
      payload: {
        reqData: {
          id: record.id,
        },
      },
      callback: (res) => {
        if (res.errCode === '0') {
          message.success('删除成功', 1.5, () => {
            const { query, page,conditions } = this.state;
            dispatch({
              type: 'WO/fetch',
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
      },
    });
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
          code: 'PID',
          exp: '=',
          value: info.selectedNodes[0].props.dataRef.id,
        }]
      });
      obj.conditions = [{
        code: 'PID',
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
      type: 'WO/fetch',
      payload: obj,
    });
  };

  onChange = value => {
    this.setState({ value });
  };
  //查询
  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { code } = values;
      dispatch({
        type: 'WO/fetch',
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
    });
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
      type: 'WO/fetch',
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
      type: 'WO/fetch',
      payload: obj,
    });
    this.setState({
      page: obj,
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
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });


  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList, dataList } = this.state;
    if (!value) {
      this.setState({ expandedKeys: [] });
      return;
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, valueList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    const strExpandedKeys = expandedKeys.map(item => {
      return item + '';
    });
    this.setState({
      expandedKeys: strExpandedKeys,
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  //发起审批
  addApproval = ()=>{
    const { page, record,conditions } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'WO/addsubapprove',
      payload: {
        reqData: {
          title: '待审批',
          billCode: record.code,
          billType: '初始状态',
          billId: record.id,
          auditType: 'WorkOrder',
          messageType: 3,
          receiverId: 82,
          jump: 0,
        },
      },
      callback: (res) => {
        console.log('---提交结果',res)
        if (res.errMsg === '成功') {
          message.success('提交成功', 1, () => {
            this.setState({
              rowId: null,
              record:{},
              approvalStatus:false
            })
            if (conditions.length) {
              dispatch({
                type: 'WO/fetch',
                payload:{
                  ...page,
                  conditions
                },
              });
            }else{
              dispatch({
                type: 'WO/fetch',
                payload:{
                  ...page,
                },
              });
            }

          });
        } else {
          message.error('提交失败');
        }
      },
    });
  }
  //查看流程
  lookDetail = () => {
    this.setState({
      detailVisible:true
    });
  };


  render() {
    const {
      WO: { dataSor },
      form: { getFieldDecorator },
      loading,
      dispatch,
      queryLoading,
      addLoading,
      subLoading
    } = this.props;

    const { searchValue,page,query, conditions,expandedKeys,rowId,detailVisible,approvalStatus,workRole,
      autoExpandParent,selectedKeys,addVisible,updateVisible,record,info, } = this.state;
    console.log('000recordSub',record)
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
        return <TreeNode key={item.id} title={name} dataRef={item} />;
      });

    const OnAdd = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'WO/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'WO/fetch',
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
                clear(1);
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
          type:'WO/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({updateVisible:false,record: {}})
                clear()
                dispatch({
                  type:'WO/fetch',
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
                clear(1);
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


    const detailDates = {
      record:record,
      visible: detailVisible,
    };
    const detailOn = {
      onCancel: () => {
        this.setState({
          detailVisible: false,
        });
      },
    };
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex' }}>
          <Card style={{ width: '25%', marginRight: '3%', boxSizing: 'border-box', overflow: 'hodden' }}
                bordered={false}>
            <div style={{ overflow: 'hidden', float: 'right', marginTop: '3px' }}> {
              selectedKeys.length ? <Button icon="plus" type="primary" onClick={this.handleModalVisible}>
                新建
              </Button> : ''
            }</div>
            <div style={{ overflow: 'hidden', borderBottom: '1px solid #f5f5f5' }}>
              <h3 style={{ height: '50px', lineHeight: '40px', float: 'left' }}>工作令</h3>
            </div>
            <div>
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
          <Card style={{ width: '70%', boxSizing: 'border-box', overflow: 'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={16}>
                <Col md={14} sm={16}>
                  <FormItem label='综合查询'>
                    {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                      <Tooltip title={IntegratedQuery.WorkOrder}>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }/>)}
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
                loading={queryLoading}
                data={dataSor}
                classNameSaveColumns={'workOrder6'}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
                rowClassName={this.setRowClassName}
                onRow={(record )=>{
                  return {
                    onClick:()=>{
                      if(record.status === '初始状态'){
                        this.setState({
                          approvalStatus:true
                        })
                      }else{
                        this.setState({
                          approvalStatus:false
                        })
                      }
                      const user = storage.get("userinfo");
                      const roleList = user.roleList || []
                      roleList.map((item)=>{
                        if(item.roleName === '事业部计划员'){
                          this.setState({
                            workRole:true
                          })
                        }
                      })
                      this.setState({
                        rowId: record.id,
                        record,
                      })
                    },
                    rowKey:record.id
                  }
                }}
                title={() => <div>
                  <Button style={{marginTop:'-30px'}}
                          loading={subLoading}
                          onClick={this.addApproval}
                          disabled={!(approvalStatus && workRole)} type="primary">
                    发起审批
                  </Button>
                  <Button disabled={!rowId} onClick={this.lookDetail} type="primary" style={{ marginLeft: 12 }}>
                    查看流程
                  </Button>
                </div>}
              />
            </div>
            <DetailLook data={detailDates} on={detailOn} />
            <WorkOrderAdd on={OnAdd} data={OnData}/>
            <WorkOrderUpdate on={OnUpdate} data={OnDataUpdate}/>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default WorkOrder;

