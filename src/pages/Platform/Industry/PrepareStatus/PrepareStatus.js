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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import styles from '../../Sysadmin/UserAdmin.less';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;

@connect(({ PS, loading }) => ({
  PS,
  loading: loading.models.PS,
  addLoading: loading.effects['PS/addPrepare'],
  findLoading:loading.effects['PS/fetchPrepare']
}))
@Form.create()

class PrepareStatus extends PureComponent {
  state = {
    pageIndex:0,
    addVisible:false,
    updateVisible:false,
    updateSource:{},
    updateSourceCheck:false,
    conditions:null,
    page:{
      pageSize:10,
      pageIndex:0
    },
    expandForm:false,
    value:""
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'PS/fetchPrepare',
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
      type: 'PS/removePrepare',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success('删除成功',1,()=>{
            dispatch({
              type:'PS/fetchPrepare',
              payload:{
                ...page,
                reqData:{
                  value
                }
              }
            })
          })
        }
      }
    })
  };

  updataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateSource:record,
      updateSourceCheck:record.basecodeflag,
      updateVisible:true
    })
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {code} = values;
      this.setState({value:code})
      dispatch({
        type:'PS/fetchPrepare',
        payload:{
          ...page,
          reqData:{
            value:code
          }
        }
      })
    })
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { value} = this.state;
    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
    };

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        value
      }
    };
   this.setState({
     page:{
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
     }
   })
    dispatch({
      type:'PS/fetchPrepare',
      payload: obj,
    });

  };

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      page:{
        pageSize:10,
        pageIndex:0
      },
      value:''
    })
    //清空后获取列表
    dispatch({
      type:'PS/fetchPrepare',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.PrepareStatus}>
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

  handleCorpAdd = ()=>{
    this.setState({
      addVisible:true
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      findLoading,
      PS:{ datapre },
      dispatch,
      addLoading,
    } = this.props;
    const { stepFormValues,updateSource,updateSourceCheck,updateVisible,page} = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: 'code',

      },
      {
        title: '名称',
        dataIndex: 'name',

      },
      {
        title: '标识',
        dataIndex: 'logo',

      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex:'caozuo',
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
      onOk:(obj,clear)=>{
        dispatch({
          type:'PS/addPrepare',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('新建成功',1,()=>{
                clear()
                dispatch({
                  type:'PS/fetchPrepare',
                  payload:{
                    pageIndex:0,
                    pageSize:10
                  }
                })
                this.setState({
                  addVisible:false
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
    const OnSelfData = {
      visible:this.state.addVisible,
      loading:addLoading,
    }

    const OnUpdateSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'PS/addPrepare',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('编辑成功',1,()=>{
                clear()
                dispatch({
                  type:'PS/fetchPrepare',
                  payload:{
                    pageIndex:0,
                    pageSize:10
                  }
                })
                this.setState({
                  updateVisible:false,
                  updateSource:{}
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
          updateSource:{}
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource,
      loading:addLoading,
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={findLoading}
            data={datapre}
            columns={columns}
            classNameSaveColumns={"prepareStatus6"}
            onChange={this.handleStandardTableChange}
            title={() => <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
              新建
            </Button>
            }
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PrepareStatus;
