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
import SelectTableRedis from '@/pages/tool/SelectTableRedis';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ workline,loading }) => ({
  workline,
  loading:loading.models.workline,
  WorkLoading: loading.effects['workline/fetchWorkConditions'],
  MaterialLoading:loading.effects['workline/fetchMataCon'],
}))
@Form.create()
class WorklineUpdate extends PureComponent {
  state = {
    initData:{},

    SelectWorkValue:[],
    selectedWorkRowKeys:[],

    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;

      const workcenterId = initData.workcenterId;
      const workcenterName = initData.workcenterName;

      this.setState({
        initData:nextProps.data.record,
        selectedWorkRowKeys:[workcenterId],
        SelectWorkValue:workcenterName,
      })
    }
  }

  handleOk = (onSave)=>{
    const { form } = this.props;
    const { initData,selectedWorkRowKeys,BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        code:values.code,
        name:values.name,
        workcenterId:selectedWorkRowKeys.length?selectedWorkRowKeys[0]:null,
        status:values.status,
        memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
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

      SelectWorkValue:[],
      selectedWorkRowKeys:[],

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      WorkLoading,
      MaterialLoading,
      on
    } = this.props;

    const { visible,loading } = data;
    const { onSave,onCancel } = on;

    const { initData } = this.state;

    const onWorkData = {
      SelectValue:this.state.SelectWorkValue,
      selectedRowKeys:this.state.selectedWorkRowKeys,
      columns : [
        {
          title: '??????????????????',
          dataIndex: 'code',
        },
        {
          title: '??????????????????',
          dataIndex: 'name',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'??????????????????',code:'code',placeholder:'???????????????????????????'},
        {label:'??????????????????',code:'name',placeholder:'???????????????????????????'},
      ],
      title:'????????????',
      placeholder:'???????????????????????????',
      tableType:'workline/fetchWorkConditions',
      tableLoading:WorkLoading,
    };
    const onWordOn = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue:nameList,
          selectedWorkRowKeys:selectedRowKeys,
        })
      },
      onButtonEmpty:()=>{
        this.setState({
          SelectWorkValue:[],
          selectedWorkRowKeys:[],
        })
      }, //???????????????
    };

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>??????</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('code',{
                rules: [{
                  required: true,
                  message:'????????????????????????'
                }],
                initialValue: initData.code
              })(<Input placeholder="????????????????????????" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('name',{
                rules: [
                  {
                    required: true,
                    message:'????????????????????????'
                  }
                ],
                initialValue: initData.name
              })(
                <Input placeholder="????????????????????????" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('workcenterName',{
                rules: [{
                  required: true,
                  message:'???????????????????????????'
                }],
                initialValue:this.state.SelectWorkValue
              })(<TableModelTable
                data={onWorkData}
                on={onWordOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('status', {
                initialValue: initData.status
              })(<Input placeholder={'???????????????'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24} >
            <Form.Item label="??????">
              {getFieldDecorator('memo', {
                initialValue: initData.memo
              })(<TextArea rows={3} placeholder={'???????????????'} />)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default WorklineUpdate;

