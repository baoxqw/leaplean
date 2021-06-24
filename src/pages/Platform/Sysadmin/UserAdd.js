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
      }, //模态框确定时触发
      onButtonEmpty:(onChange)=>{
        onChange([])
        this.setState({
          SelectManagerValue:[],
          selectedManagerRowKeys:[],
        })
      }
    };
    const dataManager = {
      SelectValue:this.state.SelectManagerValue, //下拉框选中的集合
      selectedRowKeys:this.state.selectedManagerRowKeys, //右表选中的数据
      placeholder:'请选择关联人',
      columns:[
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
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
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title:'关联人选择',
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
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.usercode' })}>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入用户编码！' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.username' })}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名称' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.phoneNumber' })}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号',pattern: /^[1]([3-9])[0-9]{9}$/ }],
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
