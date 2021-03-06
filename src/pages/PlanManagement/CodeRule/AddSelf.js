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
    InputNumber,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ CR, loading }) => ({
    CR,
    loading: loading.models.CR,
}))
@Form.create()
class AddSelf extends PureComponent {
    state = {
        isdefault: false,
        warnshow: false,
        initData: {
            defaultFlag: false,
        },
        prefixStatus: false,
        middleStatus: false,
        suffixStatus: false,
        prefixDigitsStatus: false,
        middleDigitsStatus: false,
        suffixDigitsStatus: false,
        buttonStatus: false,
        suffixSerialStatus: false,
    };

    handleOk = (onOk) => {
        const { form } = this.props;
        const { buttonStatus } = this.state;
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
                    prefix: values.prefix ? Number(values.prefix) : null,
                    middle: values.middle ? Number(values.middle) : null,
                    suffix: values.suffix ? Number(values.suffix) : null,
                    suffixSerial:values.suffixSerial ? Number(values.suffixSerial) : null,
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
            initData: {},

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
            initData, prefixStatus, middleStatus, suffixStatus, middleDigitsStatus,
            suffixDigitsStatus, prefixDigitsStatus, suffixSerialStatus,
        } = this.state;
        const { visible, title } = data;
        const { onOk, onCancel } = on;
        const limitDecimals = value => {
            return value.replace(/^(0+)|[^\d]+/g);
        };
        return (
            <Modal
                title="??????"
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
                                <FormItem label='????????????'>
                                    {getFieldDecorator('name', {
                                        initialValue: title,
                                    })(<Input placeholder='?????????????????????' disabled />)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='????????????'>
                                    {getFieldDecorator('editable', {
                                        valuePropName: 'checked',
                                    })(<Checkbox />)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='??????????????????'>
                                    {getFieldDecorator('DEF', {
                                        valuePropName: 'checked',
                                    })(<Checkbox />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='??????'>
                                    {getFieldDecorator('prefix', {})(<Select onChange={this.prefixChange} placeholder={'???????????????'}>
                                        <Option value={0}>???</Option>
                                        <Option value={1}>?????????</Option>
                                        <Option value={2}>????????? yyyyMMdd</Option>
                                        <Option value={3}>????????? yyyyMMddHHmmss</Option>
                                        <Option value={4}>????????? </Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='????????????'>
                                    {getFieldDecorator('prefixContent', {
                                        rules: [
                                            {
                                                required: prefixStatus,
                                                message: '?????????????????????',
                                            },
                                        ],
                                    })(<Input placeholder='?????????????????????' disabled={!prefixStatus} />)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='???????????????'>
                                    {getFieldDecorator('prefixDigits', {
                                        rules: [
                                            {
                                                required: prefixDigitsStatus,
                                                message: '????????????????????????',
                                                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                            },
                                        ],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '');
                                        },
                                    })(<Input
                                        placeholder='????????????????????????'
                                        style={{ width: '100%' }}

                                        disabled={!prefixDigitsStatus} />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='??????'>
                                    {getFieldDecorator('middle', {})(<Select onChange={this.middleChange} placeholder={'???????????????'}>
                                        <Option value={0}>???</Option>
                                        <Option value={1}>?????????</Option>
                                        <Option value={2}>????????? yyyyMMdd</Option>
                                        <Option value={3}>????????? yyyyMMddHHmmss</Option>
                                        <Option value={4}>????????? </Option>

                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='????????????'>
                                    {getFieldDecorator('middleContent', {
                                        rules: [
                                            {
                                                required: middleStatus,
                                                message: '?????????????????????',
                                            },
                                        ],
                                    })(<Input placeholder='?????????????????????' disabled={!middleStatus} />)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='???????????????'>
                                    {getFieldDecorator('middleDigits', {
                                        rules: [
                                            {
                                                required: middleDigitsStatus,
                                                message: '????????????????????????',
                                                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                            },
                                        ],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '');
                                        },
                                    })(<Input placeholder='????????????????????????' disabled={!middleDigitsStatus} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='??????'>
                                    {getFieldDecorator('suffix', {})(<Select onChange={this.suffixChange} placeholder={'???????????????'}>

                                        <Option value={0}>???</Option>
                                        <Option value={1}>?????????</Option>
                                        <Option value={4}>????????? </Option>
                                        <Option value={5}>?????????</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='????????????'>
                                    {getFieldDecorator('suffixContent', {
                                        rules: [
                                            {
                                                required: suffixStatus,
                                                message: '?????????????????????',
                                            },
                                        ],
                                    })(<Input placeholder='?????????????????????' disabled={!suffixStatus} />)}
                                </FormItem>
                            </Col>
                            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                                <FormItem label='???????????????'>
                                    {getFieldDecorator('suffixDigits', {
                                        rules: [
                                            {
                                                required: suffixDigitsStatus,
                                                message: '????????????????????????',
                                                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                            },
                                        ],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '');
                                        },
                                    })(<Input placeholder='????????????????????????' disabled={!suffixDigitsStatus} />)}
                                </FormItem>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                                <FormItem label='???????????????'>
                                    {getFieldDecorator('suffixSerial', {
                                        rules: [
                                            {
                                                required: suffixSerialStatus,
                                                message: '????????????????????????',
                                                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                            },
                                        ],
                                        getValueFromEvent: (event) => {
                                            return event.target.value.replace(/\D/g, '');
                                        },
                                    })(<Input placeholder='????????????????????????' disabled={!suffixSerialStatus} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Modal
                        title="??????"
                        centered
                        visible={this.state.warnshow}
                        onOk={this.defaultOk}
                        onCancel={this.defaultCancle}
                    >
                        <b>
                            ?????????????????????????????????????????????????????????????????????
                            ????????????????????????????????????????????????
            </b>
                    </Modal>
                </Card>
            </Modal>
        );
    }
}

export default AddSelf;
