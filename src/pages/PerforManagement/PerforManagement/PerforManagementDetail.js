import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';

import DetailCorpInfo from './Detail/DetailCorpInfo';
// import DetailInvestmentInfo from './Detail/DetailInvestmentInfo';
import DetailFinancialInfo from './Detail/DetailFinancialInfo';
import DetailSeasonInfo from './Detail/DetailSeasonInfo';
import DetailShareholderInfo from './Detail/DetailShareholderInfo';
import DetailAuditreportInfo from './Detail/DetailAuditreportInfo';
import DetailQuitInfo from './Detail/DetailQuitInfo';
import DetailProcessInfo from './Detail/DetailProcessInfo';

const { Description } = DescriptionList;

const action = (
  <Fragment>

</Fragment>
);

const extra = (data)=>{
  if(data){
    if(data.isipo == 0){
      data.isipo = formatMessage({ id: 'validation.unlisted' })
    }else if(data.isipo == 1){
      data.isipo = formatMessage({ id: 'validation.publiclisted' })
    }
    return(
      <Row>
        <Col xs={24} sm={12}>
          <div>{formatMessage({ id: 'validation.state' })} : <sapn style={{fontWeight:'900',fontSize:'18px',color:'rgba(0, 0, 0, 0.65)'}}>{data.isipo}</sapn></div>
        </Col>
      </Row>
    )
  }


};

const operationTabList = [
  { key: 'corpInfo', tab: formatMessage({ id: 'validation.projectinformation' }) },
  // { key: 'investmentInfo', tab: '投资信息' },
  { key: 'financialInfo', tab: formatMessage({ id: 'validation.financialinformation' }) },
  { key: 'seasonInfo', tab: formatMessage({ id: 'validation.quarterlyreport' }) },
  { key: 'shareholderInfo', tab: formatMessage({ id: 'validation.shareholderinformation' }) },
  { key: 'auditreportInfo', tab: formatMessage({ id: 'validation.auditreport' }) },
  { key: 'quitInfo', tab: formatMessage({ id: 'validation.exitstatus' }) },
  { key: 'processInfo', tab: formatMessage({ id: 'validation.processview' }) },
];


@connect(({ postmanagement, loading }) => ({
  postmanagement,
  loading: loading.effects['postmanagement/fetchDetail'],
}))
class PerforManagementDetail extends Component {

  state = {
    operationkey: 'corpInfo',
    initData: {},
    postdetail_id:null
  };

  componentDidMount() {
    const { dispatch } = this.props;
    var u = window.location.href;
    var index = u .lastIndexOf("\/");
    var str  = u .substring(index + 1, u.length);
    const obj = {
      reqData:{
        id:str
      }
    };
    this.setState({
      postdetail_id:this.props.location.state.query.id
    })

    //概要信息：
    dispatch({
      type: 'postmanagement/fetchDetail',
      payload: obj,
      callback: (res)=>{
        this.setState({initData:res})
      },
    });
    //项目信息
    dispatch({
      type: 'postmanagement/fetchcorpDetail',
      payload: obj,
      callback:(res)=>{
        this.setState({projectsource:res[0]})
      },
    });
    this.setState({
      id:str
    })
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  upDataValue = ()=>{
    const { dispatch } = this.props;
    var u = window.location.href;
    var index = u .lastIndexOf("\/");
    var str  = u .substring(index + 1, u.length);
    const obj = {
      reqData:{
        id:str
      }
    };
    this.setState({
      postdetail_id:this.props.location.state.query.id
    })
    //概要信息：
    dispatch({
      type: 'postmanagement/fetchDetail',
      payload: obj,
      callback: (res)=>{
        this.setState({initData:res})

      },
    });
  }
  render() {
    const { operationkey } = this.state;
    const {
      postmanagement: { currentDetail },
      data
    } = this.props;
    const contentList = {
      corpInfo: (<DetailCorpInfo />),
      // investmentInfo: (<DetailInvestmentInfo />),
      financialInfo: (<DetailFinancialInfo />),
      seasonInfo: (<DetailSeasonInfo />),
      shareholderInfo: (<DetailShareholderInfo />),
      auditreportInfo: (<DetailAuditreportInfo />),
      quitInfo: (<DetailQuitInfo id={this.state.id} postdetail_id={this.state.postdetail_id} updata={this.upDataValue} amount={currentDetail?currentDetail.amountleft:''}/>),
      processInfo: (<DetailProcessInfo />),
    };

    const description = (
      <DescriptionList size="small" col="2">
        <Description term={formatMessage({ id: 'validation.investment.manager' })}>{currentDetail?currentDetail.pm_name:''}</Description>
        <Description term={formatMessage({ id: 'validation.createtime' })}>{currentDetail?currentDetail.createdate:''}</Description>
        <Description term={formatMessage({ id: 'validation.memo' })}>{currentDetail?currentDetail.memo:''}</Description>
        <Description term="tag">{currentDetail?currentDetail.tag:''}</Description>
        <Description term={formatMessage({ id: 'validation.projectassign.projectname' })}>{currentDetail?currentDetail.project_name:''}</Description>
        <Description term={formatMessage({ id: 'validation.projectcurrencyrealtimestock' })}>{currentDetail?currentDetail.amountleft:''}</Description>
        <Description term={formatMessage({ id: 'validation.Investment.amount' })}>{currentDetail?currentDetail.capitalinvestednative:''}</Description>
        <Description term={formatMessage({ id: 'validation.investmentquantity' })}>{currentDetail?currentDetail.amountinvested:''}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderWrapper
        title={`${formatMessage({ id: 'validation.project' })}：${currentDetail?currentDetail.project_name:''}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra(this.state.initData)}
        tabList={operationTabList}
        onTabChange={this.onOperationTabChange}
      >
        <Card bordered={false} >
          {contentList[operationkey]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PerforManagementDetail;
