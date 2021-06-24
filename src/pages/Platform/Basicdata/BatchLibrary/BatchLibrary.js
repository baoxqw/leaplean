import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Card,
  Divider,
  message,
  Popconfirm, Tooltip,
} from 'antd';

import NormalTable from '@/components/NormalTable';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../../Sysadmin/UserAdmin.less';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const FormItem = Form.Item;


@connect(({ BLibrary, loading }) => ({
  BLibrary,
  loading: loading.models.BLibrary,
  fetchLoading:loading.effects['BLibrary/fetch'],
  addLoading:loading.effects['BLibrary/add'],
}))
@Form.create()

class BatchLibrary extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    addVisible:false,
    updateVisible:false,
    updateSource:{},
    updateSourceCheck:false,
    conditions:[]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'BLibrary/fetch',
      payload:{
       ...page
      }
    })
  }

  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type: 'BLibrary/remove',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            dispatch({
              type: 'BLibrary/fetch',
              payload: {
                ...page,
                reqData: {
                  value,
                },
              },
            });
          });
        }else{
          message.error("删除失败")
        }
      }
    })
  };

  handleCorpAdd = ()=>{
    this.setState({
      addVisible:true,
    })
  }

  handleCancel = ()=>{
    this.setState({
      addVisible:false,
    })
  }

  updataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateSource:record,
      updateVisible:true
    })
  }

  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { searchcode, searchname } = values;
      this.setState({ value: searchcode });
      dispatch({
        type: 'BLibrary/fetch',
        payload: {
          ...page,
          reqData: {
            value: searchcode,
          },
        },
      });
    });
  };

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { value } = this.state;
    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
      reqData: {
        value,
      },
    };
    this.setState({
      page: {
        pageIndex: pagination.current, //第几页
        pageSize: pagination.pageSize, //每页要展示的数量
      },
    });
    dispatch({
      type: 'BLibrary/fetch',
      payload: params,
    });
  };

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { value } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      page: {
        pageSize: 10,
        pageIndex: 0,
      },
      value: '',
    });
    //清空后获取列表
    dispatch({
      type: 'BLibrary/fetch',
      payload: {
        reqData: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('searchcode')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.BatchLibrary}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {/*{
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }*/}
            </span>
          </Col>
        </Row>
        {/* {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目类型'>
              {getFieldDecorator('type')(
                <Select placeholder="请选择项目类型" style={{ width: '100%' }}>
                  <Option value="咨询类">咨询类</Option>
                  <Option value="技术服务类">技术服务类</Option>
                  <Option value="设备类">设备类</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>:''}*/}
      </Form>
    );
  }

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      addLoading,
      fetchLoading,
      BLibrary:{data},
      dispatch
    } = this.props;
    const { updateSource,updateVisible,page} = this.state;
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialName',

      },
      {
        title: '批次号',
        dataIndex: 'vbatchcode',

      },
      {
        title: '供应商批次号',
        dataIndex: 'vvendbatchcode',

      },
      {
        title: '上次检验日期',
        dataIndex: 'tchecktime',

      },
      {
        title: '质量等级',
        dataIndex: 'cqualitylevelid',

      },
      {
        title: '生产日期',
        dataIndex: 'dproducedate',

      },
      {
        title: '失效日期',
        dataIndex: 'dvalidate',

      },
      {
        title: '封存',
        dataIndex: 'bseal',

      },
      {
        title: '批次形成时间',
        dataIndex: 'tbatchtime',

      },
      {
        title: '在检',
        dataIndex: 'binqc',

      },
      {
        title: '创建批次档案单据类型',
        dataIndex: 'csourcetype',

      },
      {
        title: '创建批次档案单据号',
        dataIndex: 'vsourcebillcode',

      },
      {
        title: '创建批次档案单据行号',
        dataIndex: 'vsourcerowno',

      },
      {
        title: '创建批次档案单据BID',
        dataIndex: 'csourcebid',

       },
      {
        title: '创建批次档案单据HID',
        dataIndex: 'csourcehid',

      },
      {
        title: '集团',
        dataIndex: 'pkGroup',

      },
      {
        title: '版本号',
        dataIndex: 'version',

      },
      {
        title: '散列码',
        dataIndex: 'vhashcode',

      },
      {
        title: '生产批次号',
        dataIndex: 'vprodbatchcode',

      },
      {
        title: '首次入库日期',
        dataIndex: 'dinbounddate',

      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex:'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'BLibrary/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success('新建成功',1,()=>{
                this.setState({
                  addVisible:false
                })
                clear()
                dispatch({
                  type:'BLibrary/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              clear(1)
              message.error("新建失败")
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
    const OnSelfData = {
      visible:this.state.addVisible,
      loading:addLoading
    }

    const OnUpdateSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'BLibrary/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success('编辑成功',1,()=>{
                this.setState({
                  updateVisible:false,
                  updateSource: {}
                })
                clear()
                dispatch({
                  type:'BLibrary/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              clear(1)
              message.error("新建失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          updateSource: {}
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource,
      loading:addLoading
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false} >
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={fetchLoading}
            data={data}
            columns={columns}
            classNameSaveColumns = {"batchLibrary5"}
            onChange={this.handleStandardTableChange}
            title={() =>   <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>
            }
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BatchLibrary;
