import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
  Upload, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/Platform/Basicdata/WorkType/WorkTypeAdd';
import UpdateSelf from '@/pages/Platform/Basicdata/WorkType/WorkTypeUpdate';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;
const { Option } = Select;
@connect(({ worktype, loading }) => ({
  worktype,
  queryLoading: loading.effects['worktype/fetch'],
  addLoading: loading.effects['worktype/add'],
}))
@Form.create()
class WorkType extends PureComponent {
  state = {
    addVisible:false,
    updateVisible:false,
    updateSource:{},
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    value:''
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'worktype/fetch',
      payload:{
        ...page
      }
    })

  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  handleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          code:values.codesadd,
          name:values.namesadd,
        }
      }
      dispatch({
        type:'worktype/add',
        payload:obj,
        callback:(res)=>{
          if(res.errMsg === "成功"){
            this.setState({
              addVisible:false
            })
            dispatch({
              type:'worktype/fetch',
              payload:{
                pageSize:10,
                pageIndex:0
              }
            })
          }
        }
      })
    })
  }

  handleCancel  =()=>{
    this.setState({
      addVisible:false
    })
  }

  //取消
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type:'worktype/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'worktype/fetch',
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
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;
      this.setState({value:code})
      dispatch({
        type:'worktype/fetch',
        payload:{
          ...page,
          reqData:{
            value:code
          }
        }
      })
    })

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page,value } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      value:"",
      page:{
        pageSize:10,
        pageIndex:0
      },
    })
    //清空后获取列表
    dispatch({
      type:'worktype/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    });
  };
  //编辑
  updataRoute = (record)=>{

    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { value } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        value
      }

    };
    this.setState({
      page:{
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
      }
    })
    dispatch({
      type:'worktype/fetch',
      payload: obj,
    });

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.WorkType}>
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      worktype:{data},
      queryLoading,
      addLoading
    } = this.props;
    const { updateSource,page,value } = this.state;
    const columns = [
      {
        title: '工作单元类型编码',
        dataIndex: 'code',

      },
      {
        title: '工作单元类型名称',
        dataIndex: 'name',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        sort:2,
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'worktype/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'worktype/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            } else {
              message.error(`新建失败 ${res.userObj ? res.userObj.msg : ''}`, 3.5, () => {
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
    const OnSelfData = {
      visible:this.state.addVisible,
      loading:addLoading
    }

    const OnUpdateData = {
      visible:this.state.updateVisible,
      record:updateSource,
      loading:addLoading
    }
    const OnUpdateSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'worktype/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateVisible:false,
                  updateSource:{}
                })
                clear()
                dispatch({
                  type:'worktype/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            } else {
              message.error(`新建失败 ${res.userObj ? res.userObj.msg : ''}`, 3.5, () => {
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
          updateSource: {}
        })
      }
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={data}
            columns={columns}
            classNameSaveColumns = {"workType6"}
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

export default WorkType;
