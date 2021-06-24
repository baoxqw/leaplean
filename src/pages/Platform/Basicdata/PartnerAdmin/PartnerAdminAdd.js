import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Form, Col, Row, DatePicker, Input, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import storage from '@/utils/storage'
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
const { Option } = Select;
const FormItem = Form.Item;

const { TextArea } = Input;

const fieldLabels = {
  name:formatMessage({ id: 'validation.name.partner' }),//合作方名称
  type: formatMessage({ id: 'validation.name.type' }),//合作方类型
  createdate: formatMessage({ id: 'validation.Set.ate' }),//成立日期
  username:formatMessage({ id: 'validation.contactpeople' }),//联系人
  code: formatMessage({ id: 'validation.Partner.code' }),//合作方代码
  legalperson:formatMessage({ id: 'validation.Legal.representative' }),//法人代表
  registeredcapital: formatMessage({ id: 'validation.registered.capital' }),//注册资本
  phone: formatMessage({ id: 'form.tel' }),//电话
  fax: formatMessage({ id: 'validation.fax ' }),//传真
  identity: formatMessage({ id: 'validation.id.Organization' }),//身份证/机构代码证号
  address: formatMessage({ id: 'validation.address' }),//地址
  responsibility: formatMessage({ id: 'validation.head' }),//负责人
  nature: formatMessage({ id: 'validation.institutional' }),//机构性质
  introduction: formatMessage({ id: 'validation.Institutional.profile' }),//机构简介
};

@connect(({ partnerAdd, loading }) => ({
  partnerAdd,
  loading: loading.models.partnerAdd,
}))
@Form.create()
class PartnerAdminAdd extends PureComponent {
  state = {};

  validate = () =>{

    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    const { form,dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      const obj = {
        ...fieldsValue,
        type:Number(fieldsValue.type),
        registeredcapital:Number(fieldsValue.registeredcapital),
        nature:Number(fieldsValue.nature),
        createdate: fieldsValue['createdate'].format('YYYY-MM-DD'),
        corp_id
      };
      const object = {
        reqData:{
          ...obj
        }
      }
      dispatch({
        type:'partnerAdd/add',
        payload: object,
        callback:()=>{
          message.success('新增成功');
          router.push('/basicdata/partnerAdmin');
        }
      })
    });

  };
  backClick = ()=>{
    this.props.history.go(-1)
  }
  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Form layout="vertical" >
          <Card title={formatMessage({id:'validation.Partner.management'})} bordered={false}>
              <Row gutter={24}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: fieldLabels.name }],
                    })(<Input placeholder={fieldLabels.name} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.code}>
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message:fieldLabels.code}],
                    })(<Input placeholder={fieldLabels.code} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.createdate}>
                    {getFieldDecorator('createdate', {
                      rules: [{ required: true }],
                    })(<DatePicker style={{ width: '100%' }} placeholder={fieldLabels.createdate} format="YYYY-MM-DD"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.username}>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: fieldLabels.username }],
                    })(<Input placeholder={fieldLabels.username} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: fieldLabels.type }],
                    })(
                      <Select placeholder="请选择合作方类型">
                        <Option value={1}>律师事务所</Option>
                        <Option value={2}>会计师事务所</Option>
                        <Option value={3}>咨询服务机构</Option>
                        <Option value={4}>工商注册服务机构</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.legalperson}>
                    {getFieldDecorator('legalperson', {
                      rules: [{ required: true, message: fieldLabels.legalperson }],
                    })(<Input placeholder={fieldLabels.legalperson}/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.registeredcapital}>
                    {getFieldDecorator('registeredcapital', {
                      rules: [{ required: true, message: fieldLabels.registeredcapital }],
                    })(<Input placeholder={fieldLabels.registeredcapital} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.phone}>
                    {getFieldDecorator('phone', {
                      rules: [{ required: true, message: fieldLabels.phone }],
                    })(<Input placeholder={fieldLabels.phone} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.fax}>
                    {getFieldDecorator('fax', {
                      rules: [{ required: true, message: fieldLabels.fax}],
                    })(<Input placeholder={fieldLabels.fax} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8} md={24} sm={24}>
                  <Form.Item label={fieldLabels.identity}>
                    {getFieldDecorator('identity', {
                      rules: [{ required: true, message: fieldLabels.identity }],
                    })(<Input placeholder={fieldLabels.identity} />)}
                  </Form.Item>
                </Col>
                <Col lg={16} md={24} sm={24}>
                  <Form.Item label={fieldLabels.address}>
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: fieldLabels.address }],
                    })(<Input placeholder={fieldLabels.address} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.responsibility}>
                    {getFieldDecorator('responsibility', {
                      rules: [{ required: true, message: fieldLabels.responsibility }],
                    })(<Input placeholder={fieldLabels.responsibility} />)}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.nature}>
                    {getFieldDecorator('nature', {
                      rules: [{ required: true, message: fieldLabels.nature }],
                    })(<Input placeholder={fieldLabels.nature} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={16} md={16} sm={24}>
                  <Form.Item label={fieldLabels.introduction}>
                    {getFieldDecorator('introduction', {
                      rules: [{ required: true, message: fieldLabels.introduction }],
                    })( <TextArea rows={3} placeholder={fieldLabels.introduction} />)}

                  </Form.Item>
                </Col>
              </Row>

          </Card>
          <FooterToolbar>
            {/*取消*/}
            <Button onClick={this.backClick}>{formatMessage({ id: 'validation.cancle' })}</Button>
            {/*提交*/}
            <Button type="primary" onClick={this.validate}>{formatMessage({ id: 'form.submit' })}</Button>
          </FooterToolbar>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default PartnerAdminAdd;
