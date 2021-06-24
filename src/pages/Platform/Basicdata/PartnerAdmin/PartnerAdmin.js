/*合作伙伴管理*/
import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input, Divider, Popconfirm, Select } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import router from 'umi/router';
import { connect } from 'dva';
import storage from '@/utils/storage';
import { formatMessage, FormattedMessage } from 'umi/locale';
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ partner, loading }) => ({
  partner,
  loading: loading.models.partner,
}))
@Form.create()
class PartnerAdmin extends PureComponent {
  state = {
    pageIndex:0,
    conditions:[]
  };

  columns = [
    {
      // title: '合作方名称',
      title: formatMessage({ id: 'validation.name.partner' }),
      dataIndex: 'name',
    },
    {
      // title: '类型',
      title: formatMessage({ id: 'validation.type' }),
      dataIndex: 'type',
      render:(text, record)=>{
        if(record.type === 1){
          return '律师事务所'
        }
        if(record.type === 2){
          return '会计师事务所'
        }
        if(record.type === 3){
          return '咨询服务机构'
        }
        if(record.type === 4){
          return '工商注册服务机构'
        }
      }
    },
    {
      // title: '联系人',
      title: formatMessage({ id: 'validation.contactpeople' }),
      dataIndex: 'username',
    },
    {
      // title: '邮箱',
      title: formatMessage({ id: 'form.email.placeholder' }),
      dataIndex: 'email',
    },
    {
      // title: '电话',
      title: formatMessage({ id: 'form.tel' }),
      dataIndex: 'phone',
    },

    {
      // title: '操作',
      title: formatMessage({ id: 'validation.operation' }),
      render: (text, record) => (
        <span>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript;" onClick={(e)=> this.update(e,record)}>{formatMessage({ id: 'validation.update' })}</a>
        </span>
      ),
    },
  ];
  //编辑
  update = (e,record)=>{
    e.preventDefault()
    this.props.history.push("/basicdata/partneradmin/update", {
      query: record
    });
  };

  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { pageIndex } = this.state;
    const userinfo = storage.get("userinfo");
    const id = userinfo.id;
    dispatch({
      type: 'partner/remove',
      payload: {
        obj:{
          reqData:{
            id: record.id,
          }
        },
        pageIndex,
        id,
      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const user = storage.get("userinfo");
    const id = user.corp.id;
    const obj = {
      id,
      pageIndex:0,
      pageSize:10
    };
    dispatch({
      type: 'partner/fetch',
      payload: obj
    });
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const user = storage.get("userinfo");
    const id = user.corp.id;
    const obj = {
      id,
      pageIndex: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    if(conditions.length){
      const obj = {
        id,
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type: 'partner/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type: 'partner/fetch',
      payload: obj,
    });
  };

  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const {code,name} = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'type',
            exp:'like',
            value:code
          };
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          await conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          conditions,
        };
        dispatch({
          type:'partner/fetch',
          payload: obj
        })
      }
    })
  };

  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      pageIndex:0
    })
    //清空后获取
    dispatch({
      type:'partner/fetch',
      payload: {
        id:1,
        pageIndex:this.state.pageIndex,
        pageSize:10
      }
    })

  };

  renderForm() {
    const { form } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col lg={9} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'validation.name.partner' })}>
                {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'validation.name.partner' })} />)}
              </FormItem>
          </Col>
          <Col lg={9} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'validation.name.type' })}>
                {getFieldDecorator('code')(
                  <Select placeholder={formatMessage({ id: 'validation.name.type' })}>
                    <Option value={1}>律师事务所</Option>
                    <Option value={2}>会计师事务所</Option>
                    <Option value={3}>咨询服务机构</Option>
                    <Option value={4}>工商注册服务机构</Option>
                  </Select>)}
              </FormItem>
          </Col>
          <Col lg={6} md={24} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" >
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
               {formatMessage({ id: 'validation.cancle' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const handlePartherAdd = () => {
      router.push('/basicdata/partneradmin/add');
    };
    const {
      partner: { data },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator} style={{ marginTop: 20 }}>
              <Button icon="plus" type="primary" onClick={handlePartherAdd}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
            </div>
            <NormalTable
            columns={this.columns}
            data={data}
            loading={loading}
            onChange={this.handleStandardTableChange}
          />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PartnerAdmin;
