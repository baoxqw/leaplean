import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Form, Input, Button, Card } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import storage from '@/utils/storage'
import styles from '../../System/UserAdmin.less';

const FormItem = Form.Item;
@connect(({ POM, loading }) => ({
  POM,
  loading: loading.models.POM,
}))
@Form.create()
class PerforManagement extends PureComponent {
  columns = [
    {
      title: '项目',
      dataIndex: 'projectname'
    },
    {
      title:'实施人员',
      dataIndex:'implementer'
    },
    {
      title: '完成内容',
      dataIndex: 'content'
    },
    {
      title: '时间',
      dataIndex: 'date'
    },
    {
      title: '总天数',
      dataIndex: 'days'
    },
    {
      title: '交通天数',
      dataIndex: 'trafficdays'
    },
    {
      title: '工作天数',
      dataIndex: 'workdays'
    },
    {
      title: '费用花销',
      dataIndex: 'costofexpenses'
    },
    {
      title: '项目预算',
      dataIndex: 'projectbudget'
    },
    {
      title: '项目结余',
      dataIndex: 'projectbalance'
    },
    /*{
      title: formatMessage({ id: 'validation.operation' }),
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => this.handleViewDetail(record)}>{ formatMessage({ id: 'validation.view' })}</a>
          </span>
        )
      },
    },*/
  ];

  state = {
    pageIndex:0,
    conditions:[]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'POM/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:10,
      conditions:this.state.conditions
    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    /*dispatch({
      type: 'PostManagement/fetch',
      payload: obj,
    });*/
  };

  handleViewDetail = record => {
    this.props.history.push(`/postmanagement/postmanagement/detail/${record.project_id}`, {
      query: record
    });
        // router.push(`/postmanagement/postmanagement/detail/${record.project_id}`);
  };

  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const user = storage.get("userinfo");
      const id = user.corp.id;
      const conditions = [];
      const obj = {
        code:'project_name',
        exp:'like',
        value:values.project_name
      };
      conditions.push(obj);
      dispatch({
        type:'PostManagement/fetch',
        payload: {
          pageSize:10,
          pageIndex:0,
          conditions,
        },
        callback:()=>{
          this.setState({
            conditions,
          });
        }
      })
    })
  };

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    });
    //清空后获取列表
    dispatch({
      type:'PostManagement/fetch',
      payload:{
        pageIndex:this.state.pageIndex,
        pageSize:10,
      }
    });
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'form.title.projectname' })}>
              {getFieldDecorator('project_name')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='实施人员'>
              {getFieldDecorator('project_per')(<Input placeholder='实施人员' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      POM:{ fetchData },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div>
            <NormalTable
              rowKey="id"
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PerforManagement;
