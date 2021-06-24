import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Form, Col, Row, DatePicker, Input, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import storage from '@/utils/storage'
import { connect } from 'dva';
import moment from 'moment';
// import moment from '../LpAdmin/LpAdminUpdate';
// import styles from '../LpAdmin/style.less';
import router from 'umi/router';

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
  fax: formatMessage({ id: 'validation.fax' }),//传真
  identity: formatMessage({ id: 'validation.id.Organization' }),//身份证/机构代码证号
  address: formatMessage({ id: 'validation.address' }),//地址
  responsibility: formatMessage({ id: 'validation.head' }),//负责人
  nature: formatMessage({ id: 'validation.institutional' }),//机构性质
  introduction: formatMessage({ id: 'validation.Institutional.profile' }),//机构简介
};
const CreateUpdateForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) { //当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
    props.fields = changedFields
  },
  mapPropsToFields(props) {

    return {
      name:Form.createFormField({
        value: props.query.name?props.query.name:null,
      }),
      code:Form.createFormField({
         value:  props.query.code?props.query.code:null,
       }),
      createdate:Form.createFormField({
        value:  moment('2018-08-12'),
      }),
      username:Form.createFormField({
        value:  props.query.username?props.query.username:null,
      }),
      contactinfo:Form.createFormField({
        value:  props.query.contactinfo?props.query.contactinfo:null,
      }),
       type:Form.createFormField({
        value:  props.query.type? props.query.type :null,
      }),
      legalperson:Form.createFormField({
         value:  props.query.legalperson? props.query.legalperson:null,
       }),
       registeredcapital:Form.createFormField({
         value:  props.query.registeredcapital?props.query.registeredcapital:null,
       }),
      identity:Form.createFormField({
        value: props.query.identity?props.query.identity:null,
      }),
      address:Form.createFormField({
       value:  props.query.address? props.query.address:null,
     }),
      responsibility:Form.createFormField({
        value:  props.query.responsibility?props.query.responsibility:null,
      }),
      nature:Form.createFormField({
        value:  props.query.nature?props.query.nature:null,
      }),
      introduction:Form.createFormField({
        value:  props.query.introduction?props.query.introduction:null,
      }),
    }
  },
  onValuesChange(props, changedValues, allValues){
    const {ongetSource} = props
    ongetSource(allValues)
  }

})(props => {
  const { form } = props;
  return (
    <Card title={formatMessage({id:'validation.Partner.management'})} bordered={false}>
      <Row gutter={24}>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.name}>
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入基金名称' }],
            })(<Input placeholder="请输入合作方名称" />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.code}>
            {form.getFieldDecorator('code', {
              rules: [{ required: true, message: '合作方代码' }],
            })(<Input placeholder="合作方代码" />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.createdate}>
            {form.getFieldDecorator('createdate', {
              rules: [{ required: true }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择时间" format="YYYY-MM-DD"/>)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.username}>
            {form.getFieldDecorator('username', {
              rules: [{ required: true, message: fieldLabels.username }],
            })(<Input placeholder={fieldLabels.username} />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.type}>
            {form.getFieldDecorator('type', {
              rules: [{ required: true, message: fieldLabels.type }],
            })(
              <Select placeholder={fieldLabels.type}>
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
            {form.getFieldDecorator('legalperson', {
              rules: [{ required: true, message: fieldLabels.legalperson }],
            })(<Input placeholder={fieldLabels.legalperson} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.registeredcapital}>
            {form.getFieldDecorator('registeredcapital', {
              rules: [{ required: true, message: fieldLabels.registeredcapital }],
            })(<Input placeholder={fieldLabels.registeredcapital} />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.phone}>
            {form.getFieldDecorator('phone', {
              rules: [{ required: true, message: fieldLabels.phone }],
            })(<Input placeholder={fieldLabels.phone} />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.fax}>
            {form.getFieldDecorator('fax', {
              rules: [{ required: true, message: fieldLabels.fax }],
            })(<Input placeholder={fieldLabels.fax} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={8} md={24} sm={24}>
          <Form.Item label={fieldLabels.identity}>
            {form.getFieldDecorator('identity', {
              rules: [{ required: true, message: fieldLabels.identity }],
            })(<Input placeholder={fieldLabels.identity} />)}
          </Form.Item>
        </Col>
        <Col lg={16} md={24} sm={24}>
          <Form.Item label={fieldLabels.address}>
            {form.getFieldDecorator('address', {
              rules: [{ required: true, message: fieldLabels.address }],
            })(<Input placeholder={fieldLabels.address} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.responsibility}>
            {form.getFieldDecorator('responsibility', {
              rules: [{ required: true, message: fieldLabels.responsibility }],
            })(<Input placeholder={fieldLabels.responsibility} />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <Form.Item label={fieldLabels.nature}>
            {form.getFieldDecorator('nature', {
              rules: [{ required: true, message: fieldLabels.nature }],
            })(<Input placeholder={fieldLabels.nature} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={16} md={16} sm={24}>
          <Form.Item label={fieldLabels.introduction}>
            {form.getFieldDecorator('introduction', {
              rules: [{ required: true, message: fieldLabels.introduction }],
            })( <TextArea rows={3} placeholder={fieldLabels.introduction} />)}

          </Form.Item>
        </Col>
      </Row>

    </Card>
  );
});
@connect(({ partnerAdd, loading }) => ({
  partnerAdd,
  loading: loading.models.partnerAdd,
}))
@Form.create()
class PartnerAdminUpdate extends PureComponent {
  state = {
    dataSource:{}
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.state){
      const dataSource = this.props.location.state.query;
      this.setState({dataSource:dataSource})
      this.setState({id:dataSource.id})
    }

  }
  aa = []
  getSource = (res) => {
    this.aa = res
  };
  validate = () =>{
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    const user_id = user.id;
    const { form,dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }
      const obj = {
        ...this.aa,
        registeredcapital:Number(this.aa.registeredcapital),
        nature:Number(this.aa.nature),
        createdate: this.aa['createdate'].format('YYYY-MM-DD'),
        id:this.state.id,
        corp_id
      };

      dispatch({
        type:'partnerAdd/add',
        payload: {
          reqData:{
            ...obj
          }
        },
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
          <CreateUpdateForm query={this.state.dataSource} ongetSource ={this.getSource}/>
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

export default PartnerAdminUpdate;
