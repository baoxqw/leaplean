import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Radio,
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ workplan, loading }) => ({
  workplan,
  loading: loading.models.workplan,
}))
@Form.create()
class AssignTeamModle extends PureComponent {
  state = {
    BStatus:false,
    value: 0,
    selectedRowKeys:[],
    selectedRows:[],
    expandForm:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
      const { dispatch } = this.props;
      dispatch({
        type:'workplan/fetchassign',
        payload:{
          pageIndex:0,
          pageSize:10
        }
      })
    }
  }

  handleOk = (onOk) =>{
    const { BStatus } = this.state;
    if(BStatus){
      return
    }
    if(this.state.selectedRows.length){
      onOk(this.state.selectedRows,this.clear)
    }else{
      message.error('请选择一条数据')
    }
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys,selectedRows });
  };

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
      value: 0,
      selectedRowKeys:[],
      selectedRows:[],
      expandForm:false
    })
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      workplan:{ dataassign },
      loading,
      on,
      data
    } = this.props;
    const { selectedRowKeys,expandForm } = this.state;
    const { visible } = data;

    const { onOk,onCancel } = on;
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
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type:'radio'
    };
    return (
      <Modal
        title="班组"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <NormalTable
          rowSelection={rowSelection}
          data={dataassign}
          loading={loading}
          columns={columns}
          scroll={{ y: 260}}
        />
      </Modal>
    );
  }
}

export default AssignTeamModle;
