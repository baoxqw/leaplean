import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal, Button,
} from 'antd';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable'

const { TextArea } = Input;

@connect(({ area,loading }) => ({
  area,
  loading:loading.models.area,
  WorkLoading: loading.effects['area/fetchWork'],
  OperationLoading: loading.effects['area/fetchTable'],
}))
@Form.create()
class AreaUpdate extends PureComponent {
  state = {
    initData:{},

    SelectWorkValue: [],
    selectedWorkRowKeys: [],

    SelectOperationValue: [],
    selectedOperationRowKeys: [],

    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;
      const productionlineId = initData.productionlineId;
      const productionlineName = initData.productionlineName;
      const psnId = initData.psnId;
      const psnName = initData.psnName;
      this.setState({
        initData:nextProps.data.record,
        selectedOperationRowKeys:[psnId],
        SelectOperationValue:psnName,
        selectedProductRowKeys:[productionlineId],
        SelectProductValue:productionlineName
      })
    }
  }

  handleOk = (onOk)=>{
    const { form } = this.props;
    const { initData,selectedProductRowKeys,selectedOperationRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        code:values.code,
        name:values.name,
        productionlineId:selectedProductRowKeys.length?selectedProductRowKeys[0]:null,
        psnId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
        memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      if(typeof onOk === 'function'){
        onOk(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      initData:{},

      SelectWorkValue: [],
      selectedWorkRowKeys: [],

      SelectOperationValue: [],
      selectedOperationRowKeys: [],

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      WorkLoading,
      OperationLoading,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onOk,onCancel } = on;

    const { initData } = this.state;

    const onWorkData = {
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      columns: [
        {
          title: '???????????????',
          dataIndex: 'code',
        },
        {
          title: '???????????????',
          dataIndex: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title: '?????????',
      placeholder: '??????????????????',
      tableType: 'area/fetchWork',
      tableLoading:WorkLoading,
    };
    const onWordOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue: nameList,
          selectedWorkRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectWorkValue: [],
          selectedWorkRowKeys: [],
        })
      },
    };

    const ons = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue: nameList,
          selectedOperationRowKeys: selectedRowKeys,
        })
      }, //????????????????????????
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectOperationValue: [],
          selectedOperationRowKeys: [],
        })
      },
    };
    const datas = {
      SelectValue: this.state.SelectOperationValue, //??????????????????
      selectedRowKeys: this.state.selectedOperationRowKeys, //?????????????????????
      placeholder: '???????????????',
      columns: [
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
          key: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title: '????????????',
      treeType: 'area/newdata',
      tableType: 'area/fetchTable',
      treeCode:'DEPT_ID',
      tableLoading:OperationLoading,
    }

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>??????</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('code',{
                rules: [{
                  required: true,
                  message:'?????????????????????'
                }],
                initialValue: initData.code?initData.code:''
              })(<Input placeholder="?????????????????????" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('name',{
                rules: [
                  {
                    required: true,
                    message:'?????????????????????'
                  }
                ],
                initialValue: initData.name?initData.name:''
              })(
                <Input placeholder="?????????????????????" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="?????????">
              {getFieldDecorator('psnName',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }],
                initialValue: this.state.SelectOperationValue
              })(<SelectModelTable
                on={ons}
                data={datas}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="?????????">
              {getFieldDecorator('productionlineName', {
                rules: [{
                  required: true,
                  message:'??????????????????'
                }],
                initialValue:this.state.SelectProductValue
              })(<TableModelTable
                data={onWorkData}
                on={onWordOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
       <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('memo', {
                initialValue: initData.memo?initData.memo:''
              })(<TextArea rows={3} placeholder={'???????????????'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AreaUpdate;

