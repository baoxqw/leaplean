import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message,
  Transfer, Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';

const FormItem = Form.Item;

@connect(({ corp, loading}) => ({
  corp,
  loading: loading.models.corp,
}))
@Form.create()
class CorpAdmins extends PureComponent {
  state = {};
  columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      sorter: true,
    },
    {
      title: '地区',
      dataIndex: 'region',
      sorter: true,
    },
    {
      title: '成立时间',
      dataIndex: 'createdate',
      sorter: true,
    },
    {
      title: '主营业务',
      dataIndex: 'mainbusiness',
    },
    {
      title: 'CEO',
      dataIndex: 'ceo',
    },

    {
      title: '操作',
      dataIndex: 'caozuo',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="">编辑</a>
        </Fragment>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch
    dispatch({
      type: 'corp/fetch',
    });
  }

//删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'corp/remove',
      payload: record.key
    })
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'corp/fetch',
      payload: params,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="公司名称">
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
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
      corp: { data },
      loading,
    } = this.props;

    const { stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };

    const handleCorpAdd = () => {
      router.push('/basicdata/corpadmin/add');
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={handleCorpAdd}>
                新建
              </Button>
            </div>
            <NormalTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CorpAdmins;
