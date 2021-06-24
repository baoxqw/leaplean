/** 投资信息 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import NormalTable from '@/components/NormalTable';

@connect(({ PostManagement, loading }) => ({
  PostManagement,
  loading: loading.effects['PostManagement/fetchDetailInvestmentInfo'],
}))
class DetailInvestmentInfo extends Component {

  columns = [
    {
      title: '投资时间',
      dataIndex: 'investDate',
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
    },
    {
      title: '投资类型',
      dataIndex: 'investType',
    },
    {
      title: '投资工具',
      dataIndex: 'investTool',
    },
    {
      title: '股数',
      dataIndex: 'shareHolder',
    },
    {
      title: '合同',
      children: [
        {
          title: '数值',
          dataIndex: 'ctrAmount',
        },
        {
          title: '币种',
          dataIndex: 'ctrCurrency',
        },
      ],
    },
    {
      title: '基金',
      children: [
        {
          title: '数值',
          dataIndex: 'fundAmount',
        },
        {
          title: '币种',
          dataIndex: 'fundCurrency',
        },
      ],
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    let u = window.location.href;
    let index = u .lastIndexOf("\/");
    let b  = u .substring(index + 1, u.length);

    dispatch({
      type: 'PostManagement/fetchDetailInvestmentInfo',
      payload: { id: 1 },
    });
  }
  render() {
    const {
      PostManagement: { investmentInfo },
      loading,
    } = this.props;
    return (
      <Card title="投资信息" bordered={false}>
        <NormalTable
          loading={loading}
          data={investmentInfo}
          columns={this.columns}
        />
      </Card>
    );
  }
}

export default DetailInvestmentInfo;
