import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  Card,
  Divider,
  message,
  Popconfirm, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import AddSelf from '@/pages/Platform/Basicdata/DeviceStatus/AddSelfDevice';
import UpdateSelf from '@/pages/Platform/Basicdata/DeviceStatus/UpdateSelfDevice';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';


const FormItem = Form.Item;


@connect(({ dstatus, loading }) => ({
  dstatus,
  loading: loading.models.dstatus,
}))
@Form.create()

class DeviceStatus extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    pageIndex:0,
    addVisible:false,
    updateVisible:false,
    updateSource:{},
    updateSourceCheck:false,
    conditions:[],
    pageNumber:true,
    value:'',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'dstatus/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { value } = this.state
    dispatch({
      type: 'dstatus/remove',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        message.success('删除成功',1,()=>{
          dispatch({
            type:'dstatus/fetch',
            payload:{
              reqData:{
                pageIndex:0,
                pageSize:10,
                reqData:{
                  value
                }
              }
            },
            callback:(res)=>{

            }
          })
        })

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
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {searchcode} = values;
      this.setState({value:searchcode})
      dispatch({
        type: 'dstatus/fetch',
        payload: {
          pageIndex:0,
          pageSize:10,
          reqData:{
            value:searchcode
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
      reqData:{
        value
      }
    };

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    this.setState({
      page:{
        pageIndex: pagination.current, //第几页
        pageSize: pagination.pageSize, //每页要展示的数量
      }
    });

    dispatch({
      type:'dstatus/fetch',
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
      type: 'dstatus/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
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
              {getFieldDecorator('searchcode')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.DeviceStatus}>
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

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dstatus:{data},
      dispatch
    } = this.props;
    const { updateSource,updateVisible,page,value} = this.state;
    const columns = [
      {
        title: '状态编码',
        dataIndex: 'code',

      },
      {
        title: '状态名称',
        dataIndex: 'name',

      },
      {
        title: '状态分类',
        dataIndex: 'type',
        sorter: (a, b) => a.type - b.type,
        render:(text,record)=>{
          if(text === 1){
            return '在用'
          }else if(text === 2){
            return '闲置'
          }else if(text === 3){
            return '封存'
          }else if(text === 4){
            return '报废'
          }else if(text === 5){
            return '处置'
          }
        }
      },
      {
        title: '是否启用',
        dataIndex: 'isOpen',
        render:(text,record)=>{
          return <Checkbox checked={text}/>
        }
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
          type:'dstatus/add',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success('新建成功',1,()=>{
                this.setState({
                  addVisible:false
                })
                clear()
                dispatch({
                  type:'dstatus/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
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
      visible:this.state.addVisible
    }

    const OnUpdateSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'dstatus/add',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success('编辑成功',1,()=>{
                this.setState({
                  updateVisible:false,
                  updateSource:{}
                })
                clear()
                dispatch({
                  type:'dstatus/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            }else{
              clear(1)
              message.error("编辑失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loading}
            data={data}
            columns={columns}
            classNameSaveColumns = {"DeviceStatus5"}
            // pagination={this.state.pageNumber?true:false}
            onChange={this.handleStandardTableChange}
            title={() =>  <div>
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

export default DeviceStatus;
