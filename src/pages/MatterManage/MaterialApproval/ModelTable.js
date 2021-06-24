import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
} from 'antd';

import NormalTable from '@/components/NormalTable';

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchneed'],
}))
@Form.create()
class ModelTable extends PureComponent {
  state = {
    dataList:[]
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.id !== this.props.data.id){
      const { dispatch } = this.props;
      dispatch({
        type:'MManage/fetchneed',
        payload:{
          conditions:[{
            code:'APPLY_ID',
            exp:'=',
            value:nextProps.data.id
          }]
        },
        callback:(res)=>{
          this.setState({
            dataList:res
          })
        }
      })
    }
  }

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel()
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      fetchTableLoading,
      data,
      on
    } = this.props;

    const columns = [
      {
        title: '单据编号',
        dataIndex: 'code',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '生产订单编号',
        dataIndex: 'productCode',
      },
      {
        title: '数量',
        dataIndex: 'amount',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '申请人',
        dataIndex: 'psnName',
      },
      {
        title: '申请时间',
        dataIndex: 'applyTine',
      },
      {
        title: '是否申领',
        dataIndex: 'applyId',
        render:(text)=>{
          if(text){
            return '已申领'
          }
          return '未申领'
        }
      },
      {
        title: '',
        dataIndex: 'caozuo',
        width:1
      },
    ];

    const { visible } = data;

    const { onCancel } = on;

    return (
      <Modal
        title={"查看物料需求单组成"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        footer={null}
      >
        <div style={{marginBottom:12}}>
          <NormalTable
            loading={fetchTableLoading}
            data={this.state.dataList}
            columns={columns}
            scroll={{y:260}}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }
}

export default ModelTable;

