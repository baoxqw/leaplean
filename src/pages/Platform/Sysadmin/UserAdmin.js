import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Divider,
  Checkbox,
  Modal,
  message,
  Transfer,
  Popconfirm,
  Tooltip
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import storage from '@/utils/storage'
import UserAdd from '@/pages/Platform/Sysadmin/UserAdd';
import UserUpdate from '@/pages/Platform/Sysadmin/UserUpdate';
import { InfoCircleOutlined } from '@ant-design/icons';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery.js';

const FormItem = Form.Item;

function arrList(array=[]) {
  let arr = [];
  for(let i=0;i<array.length;i++){
    const data = {
      key: i,
      id: array[i].id,
      title: array[i].name,
      description: array[i].name,
      chosen: Math.random() * 2 > 1,
    };
    arr.push(data);
  }
  return arr
}

@connect(({ sysuser, loading }) => ({
  sysuser,
  queryLoading: loading.effects['sysuser/find'],
  addLoading: loading.effects['sysuser/add'],
}))
@Form.create()
class UserAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    assignRoleModalVisible: false,
    visible: false,
    fields: {},
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    userId:null,
    conditions:[],
    page:{
      pageIndex:0,
      pageSize:10
    },
    value:''
  };

  showModal = async (e,record) => {
    e.preventDefault();
    await this.setState({
      visible: true,
    });
    const userinfo = storage.get("userinfo");
    const corpId = userinfo.corp.id;
    const userId = record.id;
    this.setState({
      userId
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/assign',
      payload:{
        id:record.id,
        pageIndex:0,
        pageSize:10000
      },
      callback: res =>{
        /*let newArray = [];
        for(let i=0;i<res.length;i++){
          const data = {
            key: i.toString(),
            id: res[i].id,
            title: res[i].name,
            description: res[i].name,
            chosen: Math.random() * 2 > 1,
          };
          newArray.push(data);
        }
        this.setState({
          mockData:newArray
        });*/
        const obj = {
          reqData:{
            corpId,
            userId,
          }
        };
        dispatch({
          type:'sysuser/even',
          payload: obj,
          callback:async ress =>{

            const left = arrList(res); //右边所有项带上key
            let rightRight = [];  //右边key集合
            /*for(let i=0;i<res.length;i++){
              flag = false
              for(let j=0;j<ress.length;j++){
                if(res[i].id === ress[j].roleId){
                  flag = true;
                  rightRight.push(res[i].key);
                  break
                }
              }
              if(flag===false){
                leftList.push(res[i])
              }
            }*/

            for(let i=0;i<left.length;i++){
              for(let j=0;j<ress.length;j++){
                if(left[i].id === ress[j].roleId){
                  rightRight.push(left[i].key);
                  break
                }
              }
            }

           await this.setState({
              mockData:left,
              targetKeys:rightRight
            });

          }
        })
      }
    });
  };

  columns = [
    {
      title: `${formatMessage({ id: 'validation.code' })}`,
      dataIndex: 'code',

    },
    {
      title: `${formatMessage({ id: 'validation.name' })}`,
      dataIndex: 'name',

    },
    {
      title: `${formatMessage({ id: 'validation.root' })}`,
      dataIndex: 'rootFlag',
      render: (text, record) => {
        if(text === 1){
          return <Checkbox checked={true}/>
        }else {
          return <Checkbox checked={false}/>
        }
      }
    },
    {
      title: `${formatMessage({ id: 'validation.phoneNumber' })}`,
      dataIndex: 'phone',

    },
    {
      title: `${formatMessage({ id: 'validation.psnName' })}`,
      dataIndex: 'psnName',

    },
    {
      title: `${formatMessage({ id: 'validation.operation' })}`,
      dataIndex: 'caozuo',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.EditVisible(e,true,record)}>{formatMessage({ id: 'validation.update' })}</a>
          <Divider type="vertical" />
          <a href='#javascript:;' onClick={(e)=> this.showModal(e,record)}> {formatMessage({ id: 'validation.delegaterole' })}</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'sysuser/find',
      payload: {
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //查询按钮
  findList = (e) => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { searchcode } = values;
      this.setState({ value: searchcode });
      dispatch({
        type: 'sysuser/find',
        payload: {
          ...page,
          reqData: {
            value: searchcode,
          },
        },
      });
    });
  };

  handleFormReset = () => {
    const { dispatch, form } = this.props;
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
      type: 'sysuser/find',
      payload: {
        reqData: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    /*
      pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48
    */
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    });

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'sysuser/find',
        payload: param,
      });
      return
    }
    dispatch({
      type:'sysuser/find',
      payload: obj,
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
                <Tooltip title={IntegratedQuery.user}>
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

  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { page,value } = this.state;
    const { id } = record;
    const conditions = [{
      code:'cu',
      exp:'=',
      value:id+''
    }];
    dispatch({
      type:'sysuser/fetchCMX',
      payload: {
        conditions
      },
      callback:(res)=>{
        if(res.resData && res.resData.length){
          return message.error("存在合同不能删除")
        }else{
          dispatch({
            type:'sysuser/fetchpApproval',
            payload: {
              conditions
            },
            callback:(res)=>{
              if(res.resData && res.resData.length){
                message.error("存在立项不能删除")
              }else{
                dispatch({
                  type:'sysuser/fetchBM',
                  payload: {
                    conditions
                  },
                  callback:(res)=>{
                    if(res.resData && res.resData.length){
                      message.error("存在发票不能删除")
                    }else{
                      dispatch({
                        type:'sysuser/fetchRR',
                        payload: {
                          conditions
                        },
                        callback:(res)=>{
                          if(res.resData && res.resData.length){
                            message.error("存在报销单不能删除")
                          }else{
                            dispatch({
                              type: 'sysuser/remove',
                              payload: {
                                reqData:{
                                  id: record.id,
                                }
                              },
                              callback:(res)=>{
                                if(res.errCode === '0'){
                                  message.success("删除成功", 1, () => {
                                    dispatch({
                                      type: 'sysuser/find',
                                      payload: {
                                        ...page,
                                        reqData:{
                                          value
                                        }
                                      }
                                    })
                                  })
                                }else{
                                  message.error("删除失败")
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })

  };

  handleOk =async (e) => {
    const { mockData,targetKeys,pageIndex } = this.state;
    const {dispatch} = this.props;
    let array = []; // id合集
    for(let i=0;i<targetKeys.length;i++){
      array.push(mockData[targetKeys[i]].id)
    }
    const userinfo = storage.get("userinfo");
    const corp_id = userinfo.corp.id;
    const obj = {
      req:{
        id:this.state.userId,
        userDefineInt1:corp_id,
        userDefineStrGroup:array
      },
      pageIndex
    };
    dispatch({
      type:'sysuser/dist',
      payload: obj,
      callback:()=>{
        message.success('委派成功',1.5,()=>{
          this.setState({
            targetKeys:[],
            visible:false
          })
        });
      }
    })
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      targetKeys:[]
    });
  };

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  EditVisible = (e,flag,record) => {
    e.preventDefault();
    this.setState({
      editVisible: !!flag,
      fields: record
    });
  };

  render() {
    const {
      sysuser: { data, list },
      queryLoading,
      addLoading,
    } = this.props;

    const { modalVisible,editVisible, fields } = this.state;

    const dataAdd = {
      visible:modalVisible,
      loading:addLoading
    };
    const onAdd = {
      onOk:(res,clear)=>{
        const { dispatch } = this.props;
        dispatch({
          type:'sysuser/add',
          payload:{
            reqData:{
              ...res,
            }
          },
          callback:(res)=>{
            if(res.resData && res.resData.length){
              message.success("添加成功",1,()=>{
                clear();
                this.setState({
                  modalVisible:false
                })
                dispatch({
                  type:'sysuser/find',
                  payload: {
                    ...this.state.page
                  }
                })
              })
            }else{
              clear(1);
              message.error("添加失败")
            }
          }
        });
      },
      handleCancel:(clear)=>{
        clear();
        this.setState({
          modalVisible:false,
          fields:{}
        })
      }
    };

    const dataUpdate = {
      visible:editVisible,
      record:fields,
      loading:addLoading
    };
    const onUpdate = {
      onOk:(res,clear)=>{
        const { dispatch } = this.props;
        dispatch({
          type:'sysuser/add',
          payload:{
            reqData:{
              ...res,
            }
          },
          callback:(res)=>{
            if(res.resData && res.resData.length){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  editVisible:false,
                  fields:{}
                })
                dispatch({
                  type:'sysuser/find',
                  payload: {
                    ...this.state.page
                  }
                })
              })
            }else{
              clear(1);
              message.error("编辑失败")
            }
          }
        });
      },
      handleCancel:(clear)=>{
        clear();
        this.setState({
          editVisible:false,
          fields:{}
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div>
            <NormalTable
              loading={queryLoading}
              data={data}
              classNameSaveColumns = {"userAdminName1"}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              title={() => <Button icon="plus"  size='default' type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
              }
            />
          </div>
        </Card>

        <UserAdd on={onAdd} data={dataAdd}/>

        <UserUpdate on={onUpdate} data={dataUpdate}/>

        <Modal
        title={formatMessage({ id: 'validation.assigningroles' })}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <Transfer
            titles={[formatMessage({ id: 'validation.pendingrole' }), formatMessage({ id: 'validation.selectedrole' })]}
            dataSource={this.state.mockData}
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.title}
          />
        </div>
      </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default UserAdmins;
