import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
  Button,
  Form,
  Input,
  Modal,
} from 'antd';

import SelectModelTable from '@/pages/tool/SelectModelTable';

const FormItem = Form.Item;

@connect(({ sysuser, loading }) => ({
  sysuser,
  userLoading: loading.effects['sysuser/fetchPerson'],
}))
@Form.create()
class UserAdd extends PureComponent {
  state = {
    SelectManagerValue:[],
    selectedManagerRowKeys:[],
    BStatus:false
  };

  handleOk = (onOk)=>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if(err){return}
      const { selectedManagerRowKeys } = this.state;
      let obj = {
        ...fieldsValue,
        psnId:selectedManagerRowKeys.length?selectedManagerRowKeys[0]:null,
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
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      SelectManagerValue:[],
      selectedManagerRowKeys:[],
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
      userLoading
    } = this.props;

    const { visible,loading } = data;
    const { onOk,handleCancel } = on;

    const onManager = {
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
      onButtonEmpty:(onChange)=>{
        onChange([])
        this.setState({
          SelectManagerValue:[],
          selectedManagerRowKeys:[],
        })
      }
    };
    const dataManager = {
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
          width:100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'???????????????',
      tableType:'sysuser/fetchPerson',
      treeType:'sysuser/fetchTree',
      treeCode:'DEPT_ID',
      tableLoading:userLoading
    };

    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'validation.createuser' })}
        visible={visible}
        onCancel={() => this.handleCancel(handleCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>??????</Button>]}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.usercode' })}>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '????????????????????????' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.username' })}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '?????????????????????' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.phoneNumber' })}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '??????????????????',pattern: /^[1]([3-9])[0-9]{9}$/ }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} type={'Number'}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.psnName' })}>
          {getFieldDecorator('psnName',{
          })(<SelectModelTable
            on={onManager}
            data={dataManager}
          />)}
        </FormItem>
      </Modal>
    );
  }
}

export default UserAdd;
