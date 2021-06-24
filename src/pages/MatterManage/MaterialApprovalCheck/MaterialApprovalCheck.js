import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Card,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import router from 'umi/router';

const FormItem = Form.Item;
@connect(({ MAC, loading }) => ({
  MAC,
  loading: loading.models.MAC,
}))
@Form.create()
class QualitIssuesVerifyList extends PureComponent {
  state = {
    page:{
      pageSize:1000000,
      pageIndex:0
    },
    superId:null,
    rowId:null,
    conditions:[],
    childData:[],
    superData:{},
    updateSource:{},
    updateChildSource:{},

    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],
    selectUser:false,
    record:{},
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MAC/fetchVerify',
      payload:{
        reqData:{
          auditType:'QA_INIT'
        },
        ...page
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page,selectedMaterialRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const {  startTime } = values;
      if( startTime){
        let conditions = [];
        let nameObj = {};

        if(startTime){
          nameObj = {
            code:'START_TIME',
            exp:'=',
            value:startTime.format('YYYY-MM-DD')
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'MAC/fetchVerify',
          payload:{
            reqData:{
              auditType:'QA_INIT'
            },
            ...obj
          }
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MAC/fetchVerify',
          payload:{
            reqData:{
              auditType:'QA_INIT'
            },
            ...page
          }
        })
      }
    })

  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'MAC/fetchVerify',
      payload:{
        reqData:{
          auditType:'QA_INIT'
        },
        ...page
      }
    });
  };

  //审核
  checkRoute = (e,record)=>{
    e.preventDefault();
    router.push({
      pathname:'/mattermanage/materialapproval/check/detail',
      query:{
        ...record
      }
    })
  }

  updataChildRoute = (record)=>{
    this.setState({
      updateChildSource:record,
      updateChildVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions,superId} = this.state;
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
        type:'MAC/fetchVerify',
        payload:{
          reqData:{
            auditType:'QA_INIT'
          },
          pageIndex: pagination.current-1,
          pageSize: pagination.pageSize,
        }
      })
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'MAC/fetchVerify',
      payload:{
        reqData:{
          auditType:'QA_INIT'
        },
        ...obj
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      MaterialLoading
    } = this.props;
    const on = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue: nameList,
          selectedMaterialRowKeys: selectedRowKeys,
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        const { form } = this.props;
        //清空输入框
        form.resetFields();
        onChange([])
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
          material_id: null,
          cardList: [],
          childData: [],
          addShow: true,
          superId: null,
          cardListChild: [],
          cardListAdd: [],
        })
      },
    };
    const datas = {
      SelectValue:this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys:this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder:'请选择物料',
      columns: [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {

          title: '物料类型',
          dataIndex: 'materialType',
          key: 'materialType',
        },
        {

          title: '委外类型',
          dataIndex: 'outsourcingType',
          key: 'outsourcingType',
        },
        {
          title: '物料形态',
          dataIndex: 'materialForm',
          key: 'materialForm',
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title:'物料选择',
      tableType: 'issues/fetchMata',
      treeType: 'issues/matype',
      treeCode:'invclId',
      tableLoading:MaterialLoading,
    }

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='提交时间'>
              {getFieldDecorator('startTime')(
                <DatePicker />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

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
      form: { getFieldDecorator },
      loadingSuper,
      loading,
      MAC:{dataVerify},
    } = this.props;

    const columns = [
      {
        title: '提交人',
        dataIndex: 'fromUserName',
      },
      {
        title: '提交时间',
        dataIndex: 'startTime',
        render:((text,record)=>{
          return text.substring(0,10)
        })
      },
      {
        title: '审批人',
        dataIndex: 'taskName',
      },
      {
        title: '状态',
        dataIndex: 'auditStatus',
        render:((text,record)=>{
          switch(text){
            case 'WAIT_AUDIT':return '待审批'
          }
        })
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <a href="#javascript:;"  onClick={(e)=>this.checkRoute(e,record)}>审核</a>
        }
      }
    ];

   console.log('----dataVerify',dataVerify)

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div  style={{marginTop:'12px'}}>
            <NormalTable
              loading={loading}
              data={dataVerify}
              columns={columns}
              classNameSaveColumns={"QualitIssuesVerifyCC"}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default QualitIssuesVerifyList;
