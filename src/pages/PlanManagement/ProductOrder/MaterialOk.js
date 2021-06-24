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

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
import NormalTable from '@/components/NormalTable';
import moment from '../../Platform/Basicdata/Calendar/AddChildCale';
@connect(({ porder, loading }) => ({
  porder,
  loading: loading.models.porder,
}))
@Form.create()
class MaterialOk extends PureComponent {
  state = {
    value: 1,
    rowId:null,
    page:{
      pageSize:10,
      pageIndex:0
    },
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
    }
  }
  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      let obj = {
        ...values,
        prodquan:Number(values.prodquan),
        procersscards:Number(values.procersscards),
        mode:Number(this.state.value)
      }
      onOk(obj,this.clear)
    })
  }

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
  }
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  //分页
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    });
    dispatch({
      type:'porder/findSmall',
      payload:{
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
        conditions:[{
          code:'PRODUCT_ORDER_ID',
          exp:'=',
          value:this.state.rowId,
        }]
      },
    });

  };
  render() {
    const {
      form: { getFieldDecorator },
      porder:{ smalldata },
      //loading,
      on,
      data
    } = this.props;
    const { record,visible,setLoading } = data;
    const { onOk,onCancel } = on;
    const columns = [
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '毛需求量',
        dataIndex: 'grossDemandNum',
      },
      {
        title:'投产数量',
        dataIndex: 'netDemandNum',
      },
      {
        title: '物料关系比',
        dataIndex: 'oneNum',
      },
      {
        title: '层级',
        dataIndex: 'level',
      },
      {
        title: '实际库存量',
        dataIndex: 'amount',
      },
      {
        title: '计划可用量',
        dataIndex: 'planNum',
      },
      {
        title:'图号',
        dataIndex: 'grphid',
      },
      {
        title: '工作令',
        dataIndex: 'workName',
      },
      {
        title:'型号',
        dataIndex: 'model',
      },

      {
        title:'配置数量',
        dataIndex: 'config',
      },
      {
        title:'需要数量',
        dataIndex: 'needed',
      },
      {
        title:'已配数量',
        dataIndex: 'configured',
      },
      {
        title:'转批数量',
        dataIndex: 'transfer',
      },
      {
        title:'满足套数',
        dataIndex: 'satisfaction',
      },
      {
        title:'状态',
        dataIndex: 'status'
      },
      {
        title:'工期',
        dataIndex: 'duration',
      },
      {
        title:'开始日期',
        dataIndex: 'planStartDate',
      },
      {
        title:'完成日期',
        dataIndex: 'planEndDate',
      },
      {
        title:'物资发料单号',
        dataIndex: 'suppliesCode',
      },
      {
        title:'备注',
        dataIndex: 'memo',
      },
      {
        title:"",
        width:100,
        dataIndex: 'caozuo',
      }
    ];
    return (
      <Modal
        title="查看物资配套情况"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        //onOk={()=>this.handleOk(onOk)}
        footer={false}
      >
        <NormalTable
          loading={setLoading}
          dataSource={record}
          columns={columns}
         // onChange={this.handleStandardTableChange}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default MaterialOk;
