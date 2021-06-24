import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage';
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
  Transfer, Badge, Dropdown, Steps,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import NormalTable from '@/components/NormalTable';
import DetailLook from './DetailLook';


const { Description } = DescriptionList;
const { TextArea } = Input;
const { Step } = Steps;

@connect(({ MAC, loading }) => ({
  MAC,
  loading: loading.models.MAC,
  submitLoading:loading.effects['MAC/submitCheck']
}))
@Form.create()
class QualitIssuesCheck extends PureComponent {
  state = {
    current: 0,
    process: '',
    person: '',
    personid: null,
    leave: '',
    initDate: {},
    record: {},
    processInstanceId: null,
    pictureStatus:false
  };

  about = (e) => {
    this.setState({
      opinion: e.target.value,
    });
  };

  backClick = () => {
    router.push('/mattermanage/materialapproval/check');
  };

  componentDidMount() {
    const { location: { query } } = this.props;
    this.onRecord(query);
    console.log('查询', query);
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.location.query !== nextProps.location.query) {
      const  record  = nextProps.location.query;
      this.onRecord(record);
    }
  };

  onRecord = (record) => {
    console.log('-record-', record);
    const { dispatch } = this.props;
    this.setState({
      processInstanceId: record.processInstanceId,
      record,
      pictureStatus:false
    });
    //详情
    dispatch({
      type: 'MAC/fetchDetail',
      payload: {
        conditions: [{
          code: 'ID',
          exp: '=',
          value: record.billId,
        }],
      },
      callback: (res) => {
        if (res.resData) {
          this.setState({
            initDate: res.resData[0],
          });
          /*if(res.resData[0].status && res.resData[0].status === '审批进行中'){
            dispatch({
              type:'issues/fetchProcessId',
              payload:{
                id:record.processInstanceId
              },
              callback:(res)=>{
                console.log("fetchProcessId",res)
                if(res.userDefineStr1){
                  this.setState({
                    initDate:{
                      ...this.state.initDate,
                      taskId:res.userDefineStr1
                    }
                  })
                }
              }
            });
          }*/
        }
      },
    });
    //查询审批意见
    dispatch({
      type: 'MAC/fetchAdvice',
      payload: {
        reqData: {
          processinstanceid: record.processInstanceId,
        },
      },
      callback: (res) => {
        if (res.resData) {
          res.resData.map((item) => {
            if (item.type == 'TJ') {
              item.type = '拒绝';
            } else if (item.type == 'AGREE') {
              item.type = '同意';
            }
          });
          this.setState({ ss: res.resData });
        }
      },
    });
  };

  lookAdvice = () => {
    this.setState({
      lookstatus: !this.state.lookstatus,
    });
  };

  advice = (data) => {
    const { dispatch, form } = this.props;
    const { initDate,personid, record } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        reqData: {
          receiverId: 72,
          messageType: 2,
          billId: record.billId?Number(record.billId):null,
          processId: record.processInstanceId,
          jump: 1,
          opinion:values.opinion,
          content: data?'同意':'拒绝',
          title: '已审批',
        },
      };
      console.log('---提交审核的数据', obj);
      dispatch({
        type: 'MAC/submitCheck',
        payload: obj,
        callback: (res) => {
          console.log('提交结果', res);
          if (res.errCode === '0') {
            message.success('提交成功', 1.5, () => {
              this.onRecord(record);
            });
          }else{
            message.error("提交失败")
          }
        },
      });

    });
  };

  onStatus = () => {
    this.setState({
      status: !this.state.status,
    });
  };

  onPicture = () => {
    this.setState({
      pictureStatus: !this.state.pictureStatus,
    });
  };

  renderStatus() {
    return <Card title="流程进度" style={{ marginTop: 24 }} bordered={false}>
      <Steps current={this.state.current}>
        <Step title={this.state.person} />
        {
          this.state.process ? this.state.process.map((item, index) => {
            return <Step key={index} title={item.name} />;
          }) : ''
        }
        <Step title="完成" />
      </Steps>
    </Card>;
  }

  renderPictureStatus (){
    const detailDates = {
      record:this.state.record,
    };
    return <Card title="流程图" style={{ marginTop: 24 }} bordered={false}>
      <DetailLook data={detailDates} />
    </Card>;
  }

  renderLookStatus() {
    const ss = this.state.ss;
    return <Card title="审批意见" style={{ marginTop: 24 }} bordered={false}>
      <div style={{ paddingLeft: '20px' }}>
        {
          ss.length ? ss.map((item, key) => {
            return <div style={{ marginBottom: '10px' }} key={key}>
              <b style={{ display: 'inline-block', marginRight: '10px' }}>{item.userName}({item.typeName})</b>
              {item.time}
              <p style={{ height: '30px', lineHeight: '30px' }}>{item.message}</p>
            </div>;

          }) : '暂无审批意见！'
        }


      </div>
    </Card>;
  }

  onCancel = () => {
    this.setState({
      contactModal: false,
    });
  };

  render() {
    const {
      loading,
      submitLoading,
      form: { getFieldDecorator },
    } = this.props;
    const description = (
      <DescriptionList>
        <Description term="单据编号">
          {this.state.initDate ? this.state.initDate.code : ''}
        </Description>
        <Description term="单据状态">{this.state.initDate ? this.state.initDate.status : ''}</Description>
        <Description term="发料状态">{this.state.initDate ? this.state.initDate.shippingStatus : ''}</Description>

        <Description term="物资计划员">{this.state.initDate ? this.state.initDate.planName : ''}</Description>
        <Description term="申领日期">{this.state.initDate ? this.state.initDate.claimDate : ''}</Description>
        <Description term="备注">{this.state.initDate ? this.state.initDate.memo : ''}</Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        <Button type="primary" onClick={() => this.lookAdvice()}>查看审批意见</Button>
      {/*<Button type="primary" onClick={() => this.onStatus()}>查看当前状态</Button>*/}
        <Button type="primary" onClick={() => this.onPicture()}>查看流程图</Button>
      </Fragment>
    );

    return (
      <PageHeaderWrapper
        title='审核详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        {
          this.state.initDate.status === '审批进行中' ? <Card title=''>
            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col lg={16} md={16} sm={16} offset={2}>
                <Form.Item label="意见">
                  {getFieldDecorator('opinion', {
                    rules: [
                      {
                        required: true,
                        message: '请输入意见',
                      },
                    ],
                  })(<TextArea rows ={4} placeholder={'请请输入意见'} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 40,marginLeft:'90px' }}>
              <span>
                <Button type="primary" loading={submitLoading} onClick={() => this.advice(1)}>同意</Button>
                <Button type="primary" style={{marginLeft:"20px"}}  onClick={() => this.advice(0)}>拒绝</Button>
              </span>

              <span style={{ marginLeft: 14 }}>
                <Button type="primary" onClick={this.giveback}>退回发起人</Button>
              </span>
              <span style={{ marginLeft: 14 }}>
                <Button onClick={this.backClick}>取消</Button>
              </span>
            </Row>
          </Card> : ''
        }
        {this.state.lookstatus ? this.renderLookStatus() : null}
        {this.state.status ? this.renderStatus() : null}
        {this.state.pictureStatus ? this.renderPictureStatus() : null}
        <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default QualitIssuesCheck;
