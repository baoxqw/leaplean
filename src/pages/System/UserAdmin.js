import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Checkbox,
  Modal,
  message,
  Transfer,
  Popconfirm,
  Spin
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import storage from '@/utils/storage'
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import UserAdd from '@/pages/System/UserAdd';
import UserUpdate from '@/pages/System/UserUpdate';

const FormItem = Form.Item;

function arrList(array) {
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
  loading: loading.models.sysuser
}))
@Form.create()
class UserAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    assignRoleModalVisible: false,
    selectedRows: [],
    formValues: {},
    dataList:[],
    visible: false,
    fields: {},
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    create_id:null,
    pageIndex:0,
    userId:null,
    conditions:[],
    page:{
      pageIndex:0,
      pageSize:10
    }
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
      dataIndex: 'phone'
    },
    {
      title: `${formatMessage({ id: 'validation.psnName' })}`,
      dataIndex: 'psnName'
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

  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { page } = this.state;
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
                                id: record.id,
                                ...page
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

  //查询按钮
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const {code,name} = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          await conditions.push(nameObj)
        }
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        this.setState({
          conditions
        });
        dispatch({
          type:'sysuser/find',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        });
        dispatch({
          type:'sysuser/find',
          payload: {
            pageIndex:0,
            pageSize:10,
          }
        })
      }
    })
  };

  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      page:{
        pageIndex:0,
        pageSize:10
      }
    });
    //清空后获取
    dispatch({
      type:'sysuser/find',
      payload: {
        pageIndex:0,
        pageSize:10,
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.usercode' })}>
              {getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.username' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" >
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {formatMessage({ id: 'validation.cancle' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


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

  render() {
    const {
      sysuser: { data, list },
      loading,
    } = this.props;

    const { selectedRows, modalVisible,editVisible, fields } = this.state;

    const dataAdd = {
      visible:modalVisible
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
      record:fields
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
                  editVisible:false
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

        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div style={{margin:'12px 0'}}>
              <Button icon="plus"  size='default' type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
            </div>
            <NormalTable
              loading={loading}
              data={data}
              selectedRows={selectedRows}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
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
