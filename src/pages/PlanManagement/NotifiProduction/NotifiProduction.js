import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Divider,
  Button,
  Card,
  message,
  Input,
  Popconfirm,
  Tooltip,
  Checkbox,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';

import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
@connect(({ NPro, loading }) => ({
  NPro,
  queryLoading: loading.effects['NPro/fetch'],
  loading: loading.models.NPro,
  addLoading: loading.effects['NPro/addProduct'],
}))
@Form.create()
class NotifiProduction extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    addVisible:false,
    updateVisible:false,
    updateRecord:{},
    value:''
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'NPro/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  updataRoute = (e,record) => {
    e.preventDefault();
    this.setState({
      updateVisible:true,
      updateRecord:record
    })
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type:'NPro/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'NPro/fetch',
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
    form.validateFieldsAndScroll((err, values) => {
      if(err) return;
      const { searchcode } = values;
      this.setState({value:searchcode})
      dispatch({
        type:'NPro/fetch',
        payload:{
          reqData:{
            value:searchcode
          }
        }
      })
    })
  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    this.setState({
      value:'',
      page:{
        pageSize:10,
        pageIndex:0
      }
    })
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'NPro/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
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
                <Tooltip title={IntegratedQuery.Area}>
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
      </Form>
    );
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { value} = this.state;
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
    });
    dispatch({
      type:'NPro/fetch',
      payload: obj,
    });

  };

  render() {
    const {
      loading,
      NPro:{data},
      dispatch,
      queryLoading,
      addLoading
    } = this.props;
    console.log('---',data)
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '工作令',
        dataIndex: 'workOrderName',
      },
      {
        title: '订货单位',
        dataIndex: 'orderUnit',
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
      },
      {
        title: '产品',
        dataIndex: 'materialName',
      },
      {
        title: '订货数量',
        dataIndex: 'num',
      },
      {
        title: '技术状态',
        dataIndex: 'tech',
      },
      {
        title: '交付时间',
        dataIndex: 'dueTime',
      },
      {
        title: '军种',
        dataIndex: 'militaryType',
      },
      {
        title: '是否军检',
        dataIndex: 'militaryCensor',
        render:((text,record)=>{
          return <Checkbox checked={text}/>
        })
      },
      {
        title: '审核人',
        dataIndex: 'reviewName',
      },
      {
        title: '制表人',
        dataIndex: 'watchName',
      },
      {
        title: '是否准批',
        dataIndex: 'isApproval',
        render:((text,record)=>{
          return <Checkbox checked={text}/>
        })
      },
      {
        title: '单据日期',
        dataIndex: 'receiptTime',
      },
      {
        title: '制表组',
        dataIndex: 'watchGroup',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
          </Fragment>
        },
      },
    ];

    const { page,addVisible,updateVisible,updateRecord,value } = this.state;

    const AddData = {
      visible:addVisible,
      loading:addLoading
    };

    const AddOn = {
      onSave:(res,clear)=>{
        console.log('新建数据',res)
        dispatch({
          type:'NPro/add',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            console.log('新建结果',res)
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                clear();
                this.setState({
                  addVisible:false
                });
                dispatch({
                  type:'NPro/fetch',
                  payload:{
                    ...page,
                  }
                })
              })
            }else{
              clear(1);
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
    };

    const UpdateData = {
      visible:updateVisible,
      record:updateRecord,
      loading:addLoading
    };

    const UpdateOn = {
      onSave:(res,clear)=>{
        dispatch({
          type:'NPro/add',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  updateVisible:false
                });
                dispatch({
                  type:'NPro/fetch',
                  payload:{
                    ...page,
                  }
                })
              })
            }else{
              clear(1);
              message.error("编辑失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          updateRecord:{}
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
            classNameSaveColumns={"NPro"}
            title={() =><div style={{marginTop:'1px'}}>
              <Button icon="plus" onClick={ this.handleCorpAdd } type="primary" >
                新建
              </Button>
            </div>}
          />
          <AddSelf on={AddOn}  data={AddData}/>
          <UpdateSelf on={UpdateOn}  data={UpdateData}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NotifiProduction;
