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
  message,
  Popconfirm, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import TeamAdd from '@/pages/Platform/Factory/Team/TeamAdd';
import TeamUpdate from '@/pages/Platform/Factory/Team/TeamUpdate';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

@connect(({ team, loading }) => ({
  team,
  queryLoading: loading.effects['team/fetch'],
  addLoading: loading.effects['team/add'],
}))
@Form.create()
class Team extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    teamAddVisible:false,
    teamUpdateVisible:false,
    teamUpdateRecord:{},
    value:''
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'team/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      teamAddVisible:true
    })
  };

  upDataRoute = (e,record) => {
    e.preventDefault();
    this.setState({
      teamUpdateRecord:record,
      teamUpdateVisible:true
    })
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type:'team/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'team/fetch',
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
        type:'team/fetch',
        payload:{
          reqData:{
            value:code
          }
        },
      })
    })
  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
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
      type:'team/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    });
  };

  //分页
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
      type:'team/fetch',
      payload: obj,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.Team}>
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
      loading,
      team:{data},
      dispatch,
      queryLoading,
      addLoading
    } = this.props;

    const { page,teamAddVisible,teamUpdateVisible,teamUpdateRecord,value } = this.state;

    const columns = [
      {
        title: '班组编号',
        dataIndex: 'code',

      },
      {
        title: '班组名称',
        dataIndex: 'name',

      },
      {
        title: '班组长',
        dataIndex: 'teamLeaderName',

      },
      {
        title: '部门',
        dataIndex: 'deptName',

      },
      {
        title: '状态',
        dataIndex: 'status',

      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.upDataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const teamAddData = {
      visible:teamAddVisible,
      loading:addLoading
    };

    const teamAddOn = {
      onSave:(res,clear)=>{
        dispatch({
          type:'team/teamAdd',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                clear();
                this.setState({
                  teamAddVisible:false
                })
                dispatch({
                  type:'team/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
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
          teamAddVisible:false
        })
      }
    };

    const teamUpdateData = {
      visible:teamUpdateVisible,
      record:teamUpdateRecord,
      loading:addLoading
    };

    const teamUpdateOn = {
      onSave:(res,clear)=>{
        dispatch({
          type:'team/teamAdd',
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
                  teamUpdateVisible:false,
                  teamUpdateRecord:{}
                });
                dispatch({
                  type:'team/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
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
          teamUpdateVisible:false,
          teamUpdateRecord:{}
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
            classNameSaveColumns = {"team5"}
            columns={columns}
            onChange={this.handleStandardTableChange}
            title={() =>    <div>
              <Button icon="plus" onClick={ this.handleCorpAdd } type="primary" >
                新建
              </Button>
            </div>
            }
          />

          <TeamAdd data={teamAddData} on={teamAddOn}/>

          <TeamUpdate data={teamUpdateData} on={teamUpdateOn}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Team;
