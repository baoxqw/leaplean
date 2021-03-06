import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Checkbox, Button,
} from 'antd';

const { TextArea } = Input;

@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class CopySelfAdd extends PureComponent {
  state = {
    materialBaseName:'',
    materialBaseId:null,

    ucumId:null,
    ucumname:'',

    version:'',

    routlist:[],

    cardList:[],

    initData:{
      defaultFlag:false
    },

    visible:false,

    userDefineInt1:0,

    values:{},
    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
      const initData = nextProps.data.record;

      const materialBaseId = initData.materialid;
      const { dispatch } = this.props;
      dispatch({
        type:'bom/finddefault',
        payload:{
          reqData:{
            id:materialBaseId
          }
        },
        callback:(res)=>{

          this.setState({
            userDefineInt1:res.userDefineInt1,
          })
        }
      });
      this.setState({
        initData
      });
    }
  }

  handleOk = (onSave)=>{
    const { form } = this.props;
    const { BStatus,initData,userDefineInt1} = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err,fieldsValue)=>{
      if(err){
        return
      }
      const obj = {
       reqData:{
        ...fieldsValue,
        id:initData.id,
        ucumId:initData.ucumId,
        materialBaseId:initData.materialid,
        defaultFlag:this.state.initData.defaultFlag?1:0,
       }
      };
      this.setState({
        BStatus:true
      })
      if(userDefineInt1 && initData.defaultFlag) {
        this.setState({
          visible: true,
          values:obj
        });
        return
      }
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
      materialBaseName:'',
      materialBaseId:null,

      ucumId:null,
      ucumname:'',

      version:'',

      routlist:[],

      cardList:[],

      initData:{
        defaultFlag:false
      },

      TreeOperationData:[],
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      visible:false,
      userDefineInt1:0,

      values:{},
      BStatus:false
    })
  }

  onChange = (e)=>{
    this.setState({
      initData:{
        ...this.state.initData,
        defaultFlag:e.target.checked
      }
    })
  };

  queDing = (onSave)=>{
    const { values } = this.state;
    if(typeof onSave === 'function'){
      onSave(values,this.clear,1);
    }
  }

  quXiao = ()=>{
    this.setState({
      visible: false,
      initData:{
        ...this.state.initData,
        defaultFlag:false
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onSave,onCancel } = on;

    const { initData,version } = this.state;


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
              <Form.Item label="????????????">
                  {getFieldDecorator('materialcode', {
                    initialValue:initData.materialcode?initData.materialcode:'',
                  })(<Input placeholder="?????????????????????" disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                  {getFieldDecorator('materialBaseName', {
                    initialValue:initData.materianame?initData.materianame:'',
                  })(<Input placeholder="?????????????????????" disabled/>)}
                </Form.Item>

              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

                <Form.Item label="?????????">
                  {getFieldDecorator('version',{
                     initialValue:initData.version,
                     rules: [
                      {
                        required: true,
                        message: '?????????',
                      },
                    ],
                  })(<Input placeholder="??????????????????" />)}
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('ucumId',{
                    initialValue:initData.ucumname?initData.ucumname:'??????',
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="?????????">
                  {getFieldDecorator('hsl',{
                     initialValue:initData.hsl?initData.hsl:'',
                  })(
                    <Input placeholder="??????????????????" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????????????????">
                  <Checkbox onChange={this.onChange} checked={initData.defaultFlag}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('sl',{
                     initialValue:initData.sl?initData.sl:'',
                   /* rules: [{
                       required: true
                     }]*/
                  })(<Input placeholder="???????????????" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="?????????">
                  {getFieldDecorator('fsl', {
                     initialValue:initData.fsl?initData.fsl:'',
                  })(<Input placeholder="??????????????????" />)}
                </Form.Item>

              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>


              </Col>

            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('memo', {
                     initialValue:initData.memo?initData.memo:'',
                  })(<TextArea rows={3} placeholder='???????????????'/>)}
                </Form.Item>
              </Col>
            </Row>


        <Modal
          title={"??????"}
          visible={this.state.visible}
          onOk={()=>this.queDing(onSave)}
          onCancel={this.quXiao}
        >
          <p>????????????????????????????????????BOM??????????????????????????????
            ????????????????????????????????????????????????</p>
        </Modal>
      </Modal>
    );
  }
}

export default CopySelfAdd;

