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
       {/* <Description term="????????????">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.loanApplyNo:''}</b></Description>
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.loanNo:''}</b></Description>
        <Description term="????????????"><b>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.loanProductCode:''}</b></Description>
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.saleProductName:''}</b></Description>
        <Description term="????????????"><b>{this.state.initDate?this.state.initDate.productReceiveTime:''}</b></Description>

        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.orderCreateTime:''}</b></Description>
        <Description term="???????????????(??????:???)"><b>{this.state.initDate?this.state.initDate.statementAmount:''}</b></Description>
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.orderPaymentTime:''}</b></Description>

        <Description term="????????????">{this.state.initDate?this.state.initDate.logisticsNumber:''}</Description>
        <Description term="?????????????????????"><b>{this.state.initDate?this.state.initDate.statementPaymentTime:''}</b></Description>
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.loanApplyTime:''}</b></Description>

        <Description term="??????????????????(??????:???)">{this.state.initDate?this.state.initDate.loanAmount:''}</Description>
        <Description term="????????????????????????"><b>{this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}</b></Description>
        <Description term="??????????????????"><b>{this.state.initDate?this.state.initDate.rate:''}</b></Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        {/*<Button type="primary" onClick={()=>this.lookAdvice()}>??????????????????</Button>
        <Button type="primary" onClick={()=>this.onStatus()}>??????????????????</Button>*/}
        <Button type="primary" onClick={this.filemodal}>????????????</Button>
        {/* <Button type="primary" onClick={this.filemContact}>??????????????????</Button>*/}
      </Fragment>
    );

    const columns = [
      {
        title: '????????????',
        dataIndex: 'name',
      },
      {
        title: '????????????',
        dataIndex: 'size',
      },
      {
        title: '????????????',
        dataIndex: 'uptime',
      },
      {
        title: '?????????',
        dataIndex: 'upuser',
      },
      {
        title:'????????????',
        dataIndex:'memo',
      },
      {
        title: '??????',
        dataIndex: 'caozuo',
        render: (text, record) => (
          <a target="_blank" href={`${ process.env.API_ENV === 'test'?'https://49.234.209.104/nien-0.0.1-SNAPSHOT':'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'
            }${record.path}/${record.name}`} download>??????</a>        ),
      },

    ];

    const OnAddAgree = {
      onSave:(obj,clear)=>{
 
        // dispatch({
        //   type:'MManage/addstock',
        //   payload:obj,
        //   callback:(res)=>{
        //     if(res.errMsg === "??????"){
        //       message.success("????????????",1,()=>{
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
        //     if(res.errMsg === "??????"){
        //       message.success("????????????",1,()=>{
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
        title='??????'
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
                <Button type="primary" loading={ loading } onClick={()=>this.agree()}>??????</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  style={{backgroundColor:'red',color:'#fff'}} loading={ loading } onClick={()=>this.reject()}>??????</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  onClick={this.backClick}>??????</Button>
              </span>
        </Card>
        <Modal
          title="????????????"
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
