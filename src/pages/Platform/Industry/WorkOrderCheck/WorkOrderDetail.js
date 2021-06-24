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

@connect(({ WOC, loading }) => ({
  WOC,
  loading: loading.models.WOC,
  submitLoading: loading.effects['WOC/submitCheck'],
}))
@Form.create()
class WorkOrderDetail extends PureComponent {
  state = {
    current: 0,
    person: '',
    personid: null,
    leave: '',
    initDate: {},
    record: {},
    processInstanceId: null,
    pictureStatus: false,
    receiverId: null,
    btnSure: false,
    approvalList:[],
    taskId:null
  };

  about = (e) => {
    this.setState({
      opinion: e.target.value,
    });
  };

  backClick = () => {
    router.push('/platform/industry/workorder/check');
  };

  componentDidMount() {
    const { location: { query } } = this.props;
    this.onRecord(query);
    this.getRoleList();
  }

  getRoleList = () => {
    const user = storage.get('userinfo');
    const roleList = user.roleList;
    if (!roleList || !roleList.length) {
      return message.error('未存在角色');
    }
    roleList.forEach(item => {
      if (item.roleName === '事业部计划员') {
        this.setState({
          receiverId: 82,
          btnSure: false,
        });
      }
      if (item.roleName === '事业部领导') {
        this.setState({
          receiverId: 84,
          btnSure: false,
        });
      }
      if (item.roleName === '分管副总') {
        this.setState({
          receiverId: 85,
          btnSure: false,
        });
      }
      if (item.roleName === '经营部管理') {
        this.setState({
          btnSure: true,
          receiverId: 76,
        });
      }
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.location.query !== nextProps.location.query) {
      const record = nextProps.location.query;
      this.onRecord(record);
    }
  };

  onRecord = (record) => {
    console.log('-record-', record);
    const { dispatch } = this.props;

    this.setState({
      processInstanceId: record.processInstanceId,
      record,
      pictureStatus: false,
      lookstatus: false,
    });
    //详情
    dispatch({
      type: 'WOC/fetchDetail',
      payload: {
        conditions: [{
          code: 'ID',
          exp: '=',
          value: record.billId,
        }],
      },
      callback: (res) => {
        console.log('---res', res);
        if (res.resData) {
          this.setState({
            initDate: res.resData[0],
          });
        }
      },
    });
    //查询审批意见
    dispatch({
      type: 'WOC/fetchAdvice',
      payload: {
        reqData: {
          processinstanceid: record.processInstanceId,
        },
      },
      callback: (res) => {
        console.log('审批意见', res);
        if (res.resData) {
          res.resData.map((item) => {
            if (item.type === 'TJ') {
              item.type = '提交';
            } else if (item.type === 'AGREE') {
              item.type = '同意';
            } else if (item.type === 'REJECT') {
              item.type = '拒绝';
            } else if (item.type === 'ACCEPTED') {
              item.type = '让步接受';
            } else if (item.type === 'REWORK') {
              item.type = '返工';
            } else if (item.type === 'REPAIR') {
              item.type = '返修';
            } else if (item.type === 'SCRAPPED') {
              item.type = '报废';
            } else if (item.type === 'RETURN') {
              item.type = '退货';
            } else if (item.type === 'CONFIRM') {
              item.type = '确认报废';
            } else if (item.type === 'TAKE_EFFECT') {
              item.type = '生效';
            } else if (item.type === 'ABORT') {
              item.type = '中止';
            } else if (item.type === 'EXTENSION') {
              item.type = '延期';
            } else if (item.type === 'SHUT_DOWN') {
              item.type = '关闭';
            } else if (item.type === 'AFFIRM') {
              item.type = '确认';
            }
          });
          this.setState({ approvalList: res.resData });
        }
      },
    });
    dispatch({
      type: 'WOC/queryTaskId',
      payload: {
        reqData: {
          processId: record.processInstanceId,
          billId:record.billId
        },
      },
      callback: (res) => {
        console.log('task', res);
        if(res.userObj && res.userObj.taskId){
          console.log("进来");
          this.setState({
            taskId:res.userObj.taskId
          })
        }else{
          this.setState({
            taskId:null
          })
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
    const {  record, btnSure, receiverId } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (btnSure) {
        let content;
        switch (data) {
          case 2:
            content = '生效';
            break;
          case 3:
            content = '中止';
            break;
          case 4:
            content = '延期';
            break;
          case 5:
            content = '关闭';
            break;
        }
        const obj2 = {
          reqData: {
            receiverId,
            messageType: 3,
            billId: record.billId ? Number(record.billId) : null,
            processId: record.processInstanceId,
            jump: 1,
            content,
            opinion: values.opinion,
            title: '已审批',
          },
        };
        dispatch({
          type: 'WOC/submitCheck',
          payload: obj2,
          callback: (res) => {
            console.log('提交结果', res);
            if (res.errCode === '0') {
              message.success('提交成功', 1.5, () => {
                this.onRecord(record);
              });
            } else {
              message.error('提交失败');
            }
          },
        });
      } else {
        const obj1 = {
          reqData: {
            receiverId: this.state.receiverId,
            messageType: 3,
            billId: record.billId ? Number(record.billId) : null,
            processId: record.processInstanceId,
            jump: 0,
            content: '确认',
            opinion: values.opinion,
            title: '已审批',
          },
        };
        dispatch({
          type: 'WOC/submitCheck',
          payload: obj1,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('提交成功', 1.5, () => {
                this.onRecord(record);
              });
            } else {
              message.error('提交失败');
            }
          },
        });
      }
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

  renderPictureStatus() {
    const detailDates = {
      record: this.state.record,
    };
    return <Card title="流程图" style={{ marginTop: 24 }}>
      <DetailLook data={detailDates} />
    </Card>;
  }

  renderLookStatus() {
    const { approvalList } = this.state;
    return <Card title="审批意见" style={{ marginTop: 24 }}>
      <div style={{ paddingLeft: '20px' }}>
        {
          approvalList.length ? approvalList.map((item, key) => {
            return <div style={{ marginBottom: '10px' }} key={key}>
              <b style={{ display: 'inline-block', marginRight: '10px' }}>{item.userName}({item.type})</b>
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
    const { initDate,taskId } = this.state;
    const description = (
      <DescriptionList>
        <Description term="工作令编码">
          {this.state.initDate ? this.state.initDate.code : ''}
        </Description>
        <Description term="工作令名称">{this.state.initDate ? this.state.initDate.name : ''}</Description>
        <Description term="型号类部件号">{this.state.initDate ? this.state.initDate.modelNumber : ''}</Description>

        <Description term="型号">{this.state.initDate ? this.state.initDate.pname : ''}</Description>
        <Description term="经费来源">{this.state.initDate ? this.state.initDate.sourceOfFunding : ''}</Description>
        <Description term="开始时间">{this.state.initDate ? this.state.initDate.startDate : ''}</Description>

        <Description term="终止时间">{this.state.initDate ? this.state.initDate.endDate : ''}</Description>
        <Description term="停止标志">{this.state.initDate ? this.state.initDate.stopSign : ''}</Description>
        <Description term="申请人">{this.state.initDate ? this.state.initDate.applicantName : ''}</Description>

        <Description term="申请部门">{this.state.initDate ? this.state.initDate.deptName : ''}</Description>
        <Description term="延期使用日期">{this.state.initDate ? this.state.initDate.extension : ''}</Description>
        <Description term="单据状态">{this.state.initDate ? this.state.initDate.status : ''}</Description>

        <Description term="工作令描述">{this.state.initDate ? this.state.initDate.description : ''}</Description>
        <Description term="研制状态">{this.state.initDate ? this.state.initDate.developmentName : ''}</Description>
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
        onTabChange={this.onOperationTabChange}
      >
        <div>
          {
            initDate.status === '申请中' && taskId ? <Card>
              <Row gutter={24}>
                <Col lg={16} md={16} sm={16} offset={2}>
                  <Form.Item label="意见">
                    {getFieldDecorator('opinion', {
                      rules: [
                        {
                          required: true,
                          message: '请输入意见',
                        },
                      ],
                    })(<TextArea rows={4} placeholder={'请请输入意见'} />)}
                  </Form.Item>
                </Col>
              </Row>
              {
                !this.state.btnSure ? <Row gutter={24} style={{ marginTop: 30 }}>
                  <Col lg={16} md={16} sm={16} offset={2}>
                    <Button type="primary" loading={submitLoading} onClick={() => this.advice(1)}>确认</Button>
                  </Col>
                </Row> : <Row gutter={24} style={{ marginTop: 30 }}>
                  <Col lg={16} md={16} sm={16} offset={2}>
                    <Button type="primary" loading={submitLoading} style={{ marginRight: '20px' }} onClick={() => this.advice(2)}>生效</Button>
                    <Button type="primary" loading={submitLoading} style={{ marginRight: '20px' }} onClick={() => this.advice(3)}>中止</Button>
                    <Button type="primary" loading={submitLoading} style={{ marginRight: '20px' }} onClick={() => this.advice(4)}>延期</Button>
                    <Button type="primary" loading={submitLoading} style={{ marginRight: '20px' }} onClick={() => this.advice(5)}>关闭</Button>
                  </Col>
                </Row>
              }
            </Card> : ''
          }
          {this.state.lookstatus ? this.renderLookStatus() : null}
          {this.state.pictureStatus ? this.renderPictureStatus() : null}
        </div>

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

export default WorkOrderDetail;
