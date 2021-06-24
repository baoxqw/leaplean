import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Popconfirm,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
import './tableBg.less'
// import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;

@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class Loan extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    record:{},
    rowId:null,
    superId:null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'Cre/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {productCode,creditApplyNo} = values;
      if(productCode || creditApplyNo) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (productCode) {
          codeObj = {
            code: 'productCode',
            exp: 'like',
            value: productCode
          };
          conditions.push(codeObj)
        }
        if (creditApplyNo) {
          nameObj = {
            code: 'creditApplyNo',
            exp: 'like',
            value: creditApplyNo
          };
          conditions.push(nameObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'Cre/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'Cre/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='产品编码'>
              {getFieldDecorator('productCode')(<Input placeholder='请输入产品编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='授信申请单号'>
              {getFieldDecorator('creditApplyNo')(<Input placeholder='请输入授信申请单号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'Cre/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'Cre/fetch',
      payload: obj,
    });
  };

  handleLook = (e,record)=>{
    e.preventDefault()
    router.push('/scencemanagement/loan/detail',{record})
  }


  render() {
    const {
      form:{getFieldDecorator},
      Cre:{fetchData}
    } = this.props;
    const columns = [
      {
        title: '贷款申请编号',
        dataIndex: 'loanApplyNo',
        key: 'loanApplyNo',
      },
      {
        title: '贷款合同编号',
        dataIndex: 'loanNo',
        key: 'loanNo',
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: '贷款产品编号',
        dataIndex: 'loanProductCode',
        key: 'loanProductCode',
      },
      {
        title: '交易货品名称',
        dataIndex: 'saleProductName',
        key: 'saleProductName',
      },
      {
        title: '收货时间',
        dataIndex: 'productReceiveTime',
        key: 'productReceiveTime',
      },
      {
        title: '订单生成时间',
        dataIndex: 'orderCreateTime',
        key: 'orderCreateTime',
      },
      {
        title: '结算单金额(单位:元)',
        dataIndex: 'statementAmount',
        key: 'statementAmount',
      },
      {
        title: '订单付款日期',
        dataIndex: 'orderPaymentTime',
        key: 'orderPaymentTime',
      },
      {
        title: '物流单号',
        dataIndex: 'logisticsNumber',
        key: 'logisticsNumber',
      },
      {
        title: '结算单付款日期',
        dataIndex: 'statementPaymentTime',
        key: 'statementPaymentTime',
      },
      {
        title: '申请放款时间',
        dataIndex: 'loanApplyTime',
        key: 'loanApplyTime',
      },
      {
        title: '申请放款金额(单位:元)',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
      },
      {
        title: '执行年化费率',
        dataIndex: 'rate',
        key: 'rate',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'caozuo',
        render: (text, record) =>
          <Fragment>
            <a href="#javascript:;" onClick={(e) => this.handleLook(e,record)}>查看</a>
          </Fragment>
      },
    ];
    const dataSource = [
      {
        id:1,
        key:1,
        loanApplyNo:'090809',
        loanNo:'98797hiuh',
        customerId:'王总',
      }
    ]
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <NormalTable
              columns={columns}
              dataSource={dataSource}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    this.setState({
                      rowId: record.id,
                      superId:record.id,
                      record:record,
                    })
                  },
                  rowKey:record.id
                }
              }}
              rowClassName={this.setRowClassName}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Loan;
