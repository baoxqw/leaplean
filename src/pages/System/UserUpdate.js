import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Cascader,
  Select,
  Input,
  DatePicker,
  TreeSelect ,
  Card,
  Modal,
  message,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree/index';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const FormItem = Form.Item;

@connect(({ sysuser, loading }) => ({
  sysuser,
  loading: loading.models.sysuser,
}))
@Form.create()
class UserUpdate extends PureComponent {
  state = {
    page:{},
    TreeManagerData:[],
    TableManagerData:{},
    SelectManagerValue:[],
    selectedManagerRowKeys:[],
    ManagerConditions:[],
    manager_id:null,

    record:{},

    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const record = nextProps.data.record;

      const psnId = record.psnId;
      const psnName = record.psnName;

      this.setState({
        record,
        selectedManagerRowKeys:psnId?[psnId]:[],
        SelectManagerValue:psnName?psnName:[],
      })
    }
  }

  okHandle = (onOk)=>{
    const { form } = this.props;
    const { BStatus,record,selectedManagerRowKeys } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err, fieldsValue) => {
      if(err){return}
      let obj = {
        ...fieldsValue,
        psnId:selectedManagerRowKeys.length?selectedManagerRowKeys[0]:null,
        id:record.id
      }
      this.setState({
        BStatus:true
      })
      if(typeof onOk === 'function'){
        onOk(obj,this.clear)
      }
    });
  }

  handleCancel = (handleCancel)=>{
    if(typeof handleCancel === 'function'){
      handleCancel(this.clear)
    }
  }

  clear = (status)=>{
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      page:{},
      TreeManagerData:[],
      TableManagerData:{},
      SelectManagerValue:[],
      selectedManagerRowKeys:[],
      ManagerConditions:[],
      manager_id:null,
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      loading,
      on
    } = this.props;

    const { visible } = data;
    const { onOk,handleCancel } = on;

    const { record } = this.state;

    const onManager = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'sysuser/fetchTree',
          payload: {
            reqData:{

            }
          },
          callback:(res)=>{
            if(res){
              const a = toTree(res);
              this.setState({
                TreeManagerData:a
              })
            }
          }
        });
        dispatch({
          type:'sysuser/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
            })
          }
        });
      },
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'sysuser/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
                manager_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'sysuser/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
                manager_id:null
              })
            }
          })
        }
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ManagerConditions,manager_id } = this.state;
        const param = {
          id:manager_id,
          ...obj
        };
        if(ManagerConditions.length){
          dispatch({
            type:'sysuser/fetchPerson',
            payload:{
              conditions:ManagerConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'sysuser/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
            })
          }
        })
      }, //??????
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectManagerValue:nameList,
          selectedManagerRowKeys:selectedRowKeys
        })
      }, //????????????????????????
      onCancel:()=>{

      },  //???????????????
      handleSearch:(values)=>{
        //???????????????????????? ??????????????????  ?????????????????????
        const { code, name } = values;
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
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            ManagerConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'sysuser/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
              })
            }
          })
        }else{
          this.setState({
            ManagerConditions:[]
          })
          if(this.state.manager_id){
            dispatch({
              type:'sysuser/fetchPerson',
              payload:{
                id:this.state.manager_id,
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableManagerData:res,
                })
              }
            })
          }else{
            dispatch({
              type:'sysuser/fetchPerson',
              payload:{
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableManagerData:res,
                })
              }
            })
          }
        }
      }, //???????????????
      handleReset:()=>{
        const { manager_id } = this.state;
        this.setState({
          ManagerConditions:[]
        })
        dispatch({
          type:'sysuser/fetchPerson',
          payload:{
            id:manager_id,
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
            })
          }
        })
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectManagerValue:[],
          selectedManagerRowKeys:[],
        })
      }
    };
    const dataManager = {
      TreeData:this.state.TreeManagerData, //????????????
      TableData:this.state.TableManagerData, //????????????
      SelectValue:this.state.SelectManagerValue, //????????????????????????
      selectedRowKeys:this.state.selectedManagerRowKeys, //?????????????????????
      placeholder:'??????????????????',
      columns:[
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
        {label:'??????',code:'name',placeholder:'???????????????'},
      ],
      title:'???????????????'
    };

    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'validation.createuser' })}
        visible={visible}
        onOk={()=>this.okHandle(onOk)}
        onCancel={() => this.handleCancel(handleCancel)}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.usercode' })}>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '????????????????????????' }],
            initialValue:record.code?record.code:''
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.username' })}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '?????????????????????' }],
            initialValue:record.name?record.name:''
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.phoneNumber' })}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '??????????????????',pattern: /^[1]([3-9])[0-9]{9}$/ }],
            initialValue:record.phone?record.phone:''
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} type={'Number'}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.psnName' })}>
          {getFieldDecorator('psnName',{
            initialValue:this.state.SelectManagerValue
          })(<TreeTable
            on={onManager}
            data={dataManager}
          />)}
        </FormItem>
      </Modal>
    );
  }
}

export default UserUpdate;
