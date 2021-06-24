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

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;
const { Step } = Steps;

@connect(({ issues, loading }) => ({
  issues,
  loading: loading.models.issues,
  submitLoading: loading.effects['issues/submitCheck'],
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
    router.push('/qualitymanage/qualitissues/qualitisverify');
  };

  componentDidMount() {
    const { location: { query } } = this.props;
    this.onRecord(query);
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
      type: 'issues/fetchDetail',
      payload: {
        conditions: [{
          code: 'ID',
          exp: '=',
          value: record.billId,
        }],
      },
      callback: (res) => {
        console.log('详情结果', res);
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
      type: 'issues/fetchAdvice',
      payload: {
        reqData: {
          processinstanceid: record.processInstanceId,
        },
      },
      callback: (res) => {
        console.log('意见', res);
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
          messageType: 0,
          billId: record.billId,
          processId: record.processInstanceId,
          jump: 1,
          content: values.content,
          qualityLevel: values.qualityLevel + '',
          title: '已审批',
        },
      };
      console.log('---提交审核的数据', obj);
      dispatch({
        type: 'issues/submitCheck',
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

  renderPictureStatus (){
    const detailDates = {
      record:this.state.record,
    };
    return <Card title="流程图" style={{ marginTop: 24 }} bordered={false}>
      <DetailLook data={detailDates} />
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
        <Description term="物料名称">
          {this.state.initDate ? this.state.initDate.materialName : ''}
        </Description>
        <Description term="批次">{this.state.initDate ? this.state.initDate.prodserial : ''}</Description>
        <Description term="型号">{this.state.initDate ? this.state.initDate.model : ''}</Description>

        <Description term="工艺名称">{this.state.initDate ? this.state.initDate.processplanName : ''}</Description>
        <Description term="工艺步骤">{this.state.initDate ? this.state.initDate.processplanCode : ''}</Description>
        <Description term="产品编号">{this.state.initDate ? this.state.initDate.cardnum : ''}</Description>

        <Description term="问题原因">{this.state.initDate ? this.state.initDate.causes : ''}</Description>
        <Description term="状态">{this.state.initDate ? this.state.initDate.status : ''}</Description>

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
                <Form.Item label="确认质量等级">
                  {getFieldDecorator('qualityLevel', {
                    rules: [
                      {
                        required: true,
                        message: '请确认确认质量等级',
                      },
                    ],
                  })(<Select style={{ width: '80%' }} placeholder={'请选择质量等级'}>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col lg={16} md={16} sm={16} offset={2}>
                <Form.Item label="处理方式">
                  {getFieldDecorator('content', {
                    rules: [
                      {
                        required: true,
                        message: '请选择处理方式',
                      },
                    ],
                  })(<Select style={{ width: '80%' }} placeholder={'请选择处理方式'}>
                    <Option value={'让步接受'}>让步接受</Option>
                    <Option value={'返工'}>返工</Option>
                    <Option value={'返修'}>返修</Option>
                    <Option value={'报废'}>报废</Option>
                    <Option value={'退货'}>退货</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 40, marginLeft: 90 }}>
              <span>
                <Button type="primary" loading={submitLoading} onClick={() => this.advice(1)}>确认</Button>
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
