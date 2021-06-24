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
  Checkbox,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ CR, loading }) => ({
  CR,
  loading: loading.models.CR,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelf extends PureComponent {
  state = {
    isdefault: false,
    warnshow: false,
    prefixStatus: false,
    middleStatus: false,
    suffixStatus: false,
    prefixDigitsStatus: false,
    middleDigitsStatus: false,
    suffixDigitsStatus: false,
  
    record:{},
    buttonStatus: false,
    suffixSerialStatus:false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      this.setState({
        record: nextProps.data.record,
      });
      let record = nextProps.data.record;

      //前缀
      if (record.prefix === 1) {
        this.setState({
          prefixStatus: true,
        });
      } if (record.prefix === 4) {
        this.setState({
          prefixDigitsStatus: true,
        });
      }
      //中间
      if (record.middle === 1) {
        this.setState({
          middleStatus: true,
        });
      } 
      if (record.middle === 4) {
        this.setState({
          middleDigitsStatus: true,
        });
      }
      //后缀
      if (record.suffix === 1) {
        this.setState({
          suffixStatus: true,
        });
      } 
      if (record.suffix === 4) {
        this.setState({
          suffixDigitsStatus: true,
        });
      }
      if(record.suffix === 5){
   
        this.setState({
          suffixSerialStatus: true,
        });
      }
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const { record, buttonStatus } = this.state;
    if (buttonStatus) {
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        reqData: {
          ...values,
          id: record.id,
          prefix: values.prefix ? Number(values.prefix) : null,
          middle: values.middle ? Number(values.middle) : null,
          suffix: values.suffix ? Number(values.suffix) : null,
          suffixSerial: values.suffixSerial ? Number(values.suffixSerial) : null,
          editable: values.editable ? 1 : 0,
          def: values.DEF ? 1 : 0,
        },
      };

      this.setState({
        buttonStatus: true,
      });
      onOk(obj, this.clear);
    });
  };

  handleCancel = (onCancel) => {
    onCancel(this.clear);
  };

  clear = (status) => {
    if (status) {
      this.setState({
        buttonStatus: false,
      });
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      isdefault: false,
      warnshow: false,
      prefixStatus: false,
      middleStatus: false,
      suffixStatus: false,
      prefixDigitsStatus: false,
      middleDigitsStatus: false,
      suffixDigitsStatus: false,
      suffixSerialStatus: false,
      record: {},

      buttonStatus: false,
    });
  };

  prefixChange = (value) => {
    const { form } = this.props;
    if (value === 1) {
      form.setFieldsValue({
        prefixDigits: '',
      });
      this.setState({
        prefixStatus: true,
        prefixDigitsStatus: false,
      });
    } else if (value === 4) {
      form.setFieldsValue({
        prefixContent: '',
        prefixDigits: '',
      });
      this.setState({
        prefixDigitsStatus: true,
        prefixStatus: false,
      });
    } else {
      form.setFieldsValue({
        prefixContent: '',
        prefixDigits: '',
      });
      this.setState({
        prefixStatus: false,
        prefixDigitsStatus: false,
      });
    }
  };

  middleChange = (value) => {
    const { form } = this.props;
    if (value === 1) {
      form.setFieldsValue({
        middleDigits: '',
      });
      this.setState({
        middleStatus: true,
        middleDigitsStatus: false,
      });
    } else if (value === 4) {
      form.setFieldsValue({
        middleContent: '',
        middleDigits: '',
      });
      this.setState({
        middleDigitsStatus: true,
        middleStatus: false,
      });
    } else {
      form.setFieldsValue({
        middleContent: '',
        middleDigits: '',
      });
      this.setState({
        middleStatus: false,
        middleDigitsStatus: false,
      });
    }


  };

  suffixChange = (value) => {
    const { form } = this.props;

    if (value === 1) {
        form.setFieldsValue({
            suffixDigits: '',
            suffixSerial: '',
        });
        this.setState({
            suffixStatus: true,
            suffixDigitsStatus: false,
            suffixSerialStatus: false,
        });
    } else if (value === 4) {
        form.setFieldsValue({
            suffixContent: '',
            suffixDigits: '',
            suffixSerial: ''
        });
        this.setState({
            suffixDigitsStatus: true,
            suffixStatus: false,
            suffixSerialStatus: false,
        });
    } else if (value === 5) {
        form.setFieldsValue({
            suffixContent: '',
            suffixDigits: '',

        });
        this.setState({
            suffixDigitsStatus: false,
            suffixStatus: false,
            suffixSerialStatus: true,
        });
    } else {
        form.setFieldsValue({
            suffixContent: '',
            suffixDigits: '',
            suffixSerial: '',
        });
        this.setState({
            suffixStatus: false,
            suffixDigitsStatus: false,
        });
    }


};

  onChange = (e) => {
    this.setState({
      initData: {
        ...this.state.initData,
        defaultFlag: e.target.checked,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data,
    } = this.props;
    const {
       prefixStatus, middleStatus, suffixStatus, middleDigitsStatus,
      suffixDigitsStatus, prefixDigitsStatus,suffixSerialStatus,record,
    } = this.state;
    const { visible, } = data;
    const { onOk, onCancel } = on;
    return (
      <Modal
        title="编辑"
        destroyOnClose
        centered
        visible={visible}
        width={'70%'}
        onCancel={() => this.handleCancel(onCancel)}
        onOk={() => this.handleOk(onOk)}
      >
        <Card bordered={false}>
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='规则名称'>
                  {getFieldDecorator('name', {
                    initialValue: record.name ? record.name : '',
                  })(<Input placeholder='请输入规则名称' disabled/>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='可否编辑'>
                  {getFieldDecorator('editable', {
                    valuePropName: 'checked',
                    initialValue: record.editable ? record.editable : 0,
                  })(<Checkbox/>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='是否默认版本'>
                  {getFieldDecorator('DEF', {
                    initialValue: record.def ? record.def : 0,
                    valuePropName: 'checked',
                  })(<Checkbox/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='前缀'>
                  {getFieldDecorator('prefix', {
                    initialValue: record.prefix ? record.prefix : '',
                  })(<Select onChange={this.prefixChange} placeholder={'请选择前缀'}>
                    <Option value={0}>无</Option>
                    <Option value={1}>自定义</Option>
                    <Option value={2}>时间戳 yyyyMMdd</Option>
                    <Option value={3}>时间戳 yyyyMMddHHmmss</Option>
                    <Option value={4}>随机码 </Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='前缀内容'>
                  {getFieldDecorator('prefixContent', {
                    rules: [
                      {
                        required: prefixStatus,
                        message: '请输入前缀内容',
                      },
                    ],
                    initialValue: record.prefixContent ? record.prefixContent : '',
                  })(<Input placeholder='请输入前缀内容' disabled={!prefixStatus}/>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='随机码位数'>
                  {getFieldDecorator('prefixDigits', {
                    rules: [
                      {
                        required: prefixDigitsStatus,
                        message: '请输入随机码位数',
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/\D/g, '');
                    },
                    initialValue: record.prefixDigits ? record.prefixDigits : '',
                  })(<Input placeholder='请输入随机码位数' disabled={!prefixDigitsStatus}/>)}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='中间'>
                  {getFieldDecorator('middle', {
                    initialValue: record.middle ? record.middle : '',
                  })(<Select onChange={this.middleChange}
                             placeholder={'请选择中间'}>
                    <Option value={0}>无</Option>
                    <Option value={1}>自定义</Option>
                    <Option value={2}>时间戳 yyyyMMdd</Option>
                    <Option value={3}>时间戳 yyyyMMddHHmmss</Option>
                    <Option value={4}>随机码 </Option>

                  </Select>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='中间内容'>
                  {getFieldDecorator('middleContent', {
                    rules: [
                      {
                        required: middleStatus,
                        message: '请输入中间内容',
                      },
                    ],
                    initialValue: record.middleContent ? record.middleContent : '',
                  })(<Input placeholder='请输入中间内容' disabled={!middleStatus}/>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='随机码位数'>
                  {getFieldDecorator('middleDigits', {
                    rules: [
                      {
                        required: middleDigitsStatus,
                        message: '请输入随机码位数',
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/\D/g, '');
                    },
                    initialValue: record.middleDigits ? record.middleDigits : '',
                  })(<Input placeholder='请输入随机码位数' disabled={!middleDigitsStatus}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='后缀'>
                  {getFieldDecorator('suffix', {
                    initialValue: record.suffix ? record.suffix : '',
                  })(<Select 
                    onChange={this.suffixChange}
                             placeholder={'请选择后缀'}>

                    <Option value={0}>无</Option>
                    <Option value={1}>自定义</Option>
                    <Option value={4}>随机码 </Option>
                    <Option value={5}>流水号</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='后缀内容'>
                  {getFieldDecorator('suffixContent', {
                    rules: [
                      {
                        required: suffixStatus,
                        message: '请输入后缀内容',
                      },
                    ],
                    initialValue: record.suffixContent ? record.suffixContent : '',
                  })(<Input placeholder='请输入后缀内容' disabled={!suffixStatus}/>)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                <FormItem label='随机码位数'>
                  {getFieldDecorator('suffixDigits', {
                    rules: [
                      {
                        required: suffixDigitsStatus,
                        message: '请输入随机码位数',
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/\D/g, '');
                    },
                    initialValue: record.suffixDigits ? record.suffixDigits : '',
                  })(<Input placeholder='请输入随机码位数' disabled={!suffixDigitsStatus}/>)}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={16}>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='流水号位数'>
                                    {getFieldDecorator('suffixSerial', {
                                        rules: [
                                            {
                                                required: suffixSerialStatus,
                                                message: '请输入流水号位数',
                                                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                            },
                                        ],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '');
                                        },
                                        initialValue: record.suffixSerial ? record.suffixSerial : '',
                                    })(<Input placeholder='请输入流水号位数' disabled={!suffixSerialStatus} />)}
                                </FormItem>
                            </Col>
                        </Row>
          </Form>
          <Modal
            title="提示"
            centered
            visible={this.state.warnshow}
            onOk={this.defaultOk}
            onCancel={this.defaultCancle}
          >
            <b>
              当前编码规则已存在默认版本，继续保存将使原来的
              默认版本变为普通版本，是否继续？
            </b>
          </Modal>
        </Card>
      </Modal>
    );
  }
}

export default AddSelf;
