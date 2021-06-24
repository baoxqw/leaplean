import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'

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
import LoanAgree from './LoanAgree';
import LoanReject from './LoanReject';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class CreditInfo extends PureComponent {
  state = {
    fileList:[],
    fileShow:false,
    finaceok:true,
    initDate:{},
    agreeVisible:false,
    rejectVisible:false,
  };

  backClick = ()=>{
    router.push('/credit');
  }

  componentDidMount(){
    
    const { record } = this.props.location.state;

    this.setState({
      initDate:record
    })
    //this.onRecord(record)
  }

  filemodal = ()=>{
    const { dispatch } = this.props;
    const { initDate } = this.state;
    dispatch({
      type:'AG/fetchList',
      payload:{
        reqData:{
          bill_id:initDate.id,
          type:'contract'
        }
      },
      callback:(res)=>{

        if(res.resData && res.resData.length){
          this.setState({
            attachmentList:res.resData
          })
        }
      }
    });
    this.setState({
      fileShow: true
    })
  }

  fileCancel = ()=>{
    this.setState({
      fileShow: false
    })
  }

  onCancel = ()=>{
    this.setState({
      contactModal:false
    })
  };

  agree = ()=>{
    this.setState({
      agreeVisible:true
    })
  }

  reject = ()=>{
    this.setState({
      rejectVisible:true
    })
  }

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
    const description = (
      <DescriptionList >
       {/* <Description term="产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="贷款申请编号"><b>{this.state.initDate?this.state.initDate.loanApplyNo:''}</b></Description>
        <Description term="贷款合同编号"><b>{this.state.initDate?this.state.initDate.loanNo:''}</b></Description>
        <Description term="阿里客户"><b>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

        <Description term="贷款产品编号"><b>{this.state.initDate?this.state.initDate.loanProductCode:''}</b></Description>
        <Description term="交易货品名称"><b>{this.state.initDate?this.state.initDate.saleProductName:''}</b></Description>
        <Description term="收货时间"><b>{this.state.initDate?this.state.initDate.productReceiveTime:''}</b></Description>

        <Description term="订单生成时间"><b>{this.state.initDate?this.state.initDate.orderCreateTime:''}</b></Description>
        <Description term="结算单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.statementAmount:''}</b></Description>
        <Description term="订单付款日期"><b>{this.state.initDate?this.state.initDate.orderPaymentTime:''}</b></Description>

        <Description term="物流单号">{this.state.initDate?this.state.initDate.logisticsNumber:''}</Description>
        <Description term="结算单付款日期"><b>{this.state.initDate?this.state.initDate.statementPaymentTime:''}</b></Description>
        <Description term="申请放款时间"><b>{this.state.initDate?this.state.initDate.loanApplyTime:''}</b></Description>

        <Description term="申请放款金额(单位:元)">{this.state.initDate?this.state.initDate.loanAmount:''}</Description>
        <Description term="法人配偶证件号码"><b>{this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}</b></Description>
        <Description term="执行年化费率"><b>{this.state.initDate?this.state.initDate.rate:''}</b></Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        {/*<Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>*/}
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        {/* <Button type="primary" onClick={this.filemContact}>查看合同详情</Button>*/}
      </Fragment>
    );

    const columns = [
      {
        title: '附件名称',
        dataIndex: 'name',
      },
      {
        title: '附件大小',
        dataIndex: 'size',
      },
      {
        title: '上传时间',
        dataIndex: 'uptime',
      },
      {
        title: '上传人',
        dataIndex: 'upuser',
      },
      {
        title:'附件备注',
        dataIndex:'memo',
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        render: (text, record) => (
          <a target="_blank" href={`${ process.env.API_ENV === 'test'?'https://49.234.209.104/nien-0.0.1-SNAPSHOT':'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'
            }${record.path}/${record.name}`} download>查看</a>        ),
      },

    ];

    const OnAddAgree = {
      onSave:(obj,clear)=>{
 
        // dispatch({
        //   type:'MManage/addstock',
        //   payload:obj,
        //   callback:(res)=>{
        //     if(res.errMsg === "成功"){
        //       message.success("新建成功",1,()=>{
        //         this.setState({addVisible:false})
        //         clear()
        //         dispatch({
        //           type:'MManage/fetchstock',
        //           payload:{
        //             ...page
        //           }
        //         })
        //       })
        //     }
        //   }
        // })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          agreeVisible:false
        })
      }
    }
    const OnAgreeData = {
      visible:this.state.agreeVisible
    }

    const OnAddReject = {
      onSave:(obj,clear)=>{
 
        // dispatch({
        //   type:'MManage/addstock',
        //   payload:obj,
        //   callback:(res)=>{
        //     if(res.errMsg === "成功"){
        //       message.success("新建成功",1,()=>{
        //         this.setState({addVisible:false})
        //         clear()
        //         dispatch({
        //           type:'MManage/fetchstock',
        //           payload:{
        //             ...page
        //           }
        //         })
        //       })
        //     }
        //   }
        // })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          rejectVisible:false
          //

        })
      }
    }
    const OnRejectData = {
      visible:this.state.rejectVisible
    }


    return (
      <PageHeaderWrapper
        title='详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        <Card title=''>
         <span>
                <Button type="primary" loading={ loading } onClick={()=>this.agree()}>同意</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  style={{backgroundColor:'red',color:'#fff'}} loading={ loading } onClick={()=>this.reject()}>拒绝</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  onClick={this.backClick}>取消</Button>
              </span>
        </Card>
        <Modal
          title="点击下载"
          visible={this.state.fileShow}
          onCancel={this.fileCancel}
          width={"70%"}
          footer={null}
        >
          <NormalTable
            columns={columns}
            data={{list:this.state.attachmentList}}
            loading={loading}
            pagination={false}
          />
        </Modal>
        <LoanAgree on={OnAddAgree} data={OnAgreeData} />
        <LoanReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;
