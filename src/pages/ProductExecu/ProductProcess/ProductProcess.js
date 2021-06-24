import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import storage from '@/utils/storage'
import { GetDateDiff } from '@/pages/tool/Time';
import {
  Row,
  Col,
  List,
  Form,
  Input,
  Progress,
  Tooltip,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Tabs,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NormalTable from '@/components/NormalTable';
import moment from 'moment';

const FormItem = Form.Item;
const { TabPane } = Tabs;
@connect(({ process,loading }) => ({
  process,
  loading:loading.models.process,
  fetchTableLoading:loading.effects['process/findlist'],
}))
@Form.create()
class ProductProcess extends PureComponent {
  state = {
   page:{
     pageIndex:0,
     pageSize:5,
   },
    workData:0,
  }

  componentDidMount(){
    const { dispatch } = this.props
    const { page } = this.props
    const user = storage.get("userinfo");
    const psnId = user.psnId;
    dispatch({
      type:'process/findlist',
      payload:{
        ...page,
      }
    })
    //待办任务
    dispatch({
      type:'process/findworking',
      payload:{
        reqData:{
          psnId:psnId,
        }
      },
      callback:(res)=>{
        if(res && res.resData && res.resData.length){
          this.setState({
            workData:res.resData.length
          })
        }else{
          this.setState({
            workData:0
          })
        }
      }
    })
  }

  handleCorpAdd = () => {
    router.push('/productexecu/productprocess/add');
  };

  updataRoute = (e,record) => {
    e.preventDefault();
    router.push('/productexecu/productprocess/tasks',{record:record});
  };

  onClickTasks = (data)=>{
    router.push('/productexecu/productprocess/checklist',{record:data});
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page:obj
    })
    dispatch({
      type:'process/findlist',
      payload:{
        ...obj,
      }
    })
  };

  render() {
    const {
      loading,
      process:{ datalist },
      fetchTableLoading,
      dispatch,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: datalist.total,
      onChange:page=>{
        dispatch({
          type:'process/findlist',
          payload:{
            pageIndex:page-1,
            pageSize:5,
          }
        })
      }
    };

    const ListContent = (item)=>{
      const {data} = item
      return <div style={{display:'flex',width:'100%',justifyContent:'space-around ',color:'rgba(0,0,0)' }}>
        <div>
          <p style={{display:'flex',alignItems:'center'}}>
             <span style={{display:'inline-block'}}>工艺工序：</span>
            <Tooltip title={data.processplanCode} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.processplanCode}
              </b>
            </Tooltip>
          </p>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>工序状态：</span>
            <Tooltip title={data.processstatusend} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.processstatusend}
              </b>
            </Tooltip>
          </p>
        </div>
        <div>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>当前工序：</span>
            <Tooltip title={data.processplanName} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.processplanName}
              </b>
            </Tooltip>
          </p>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>完成状态：</span>
            <Tooltip title={data.status} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.status}
              </b>
            </Tooltip>
          </p>
        </div>
        <div>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>物料编码：</span>
            <Tooltip title={data.materialBaseCode} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.materialBaseCode}
              </b>
            </Tooltip>
          </p>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>物料名称：</span>
            <Tooltip title={data.materialBaseName} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',alignItems:'baseline', width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.materialBaseName}
              </b>
            </Tooltip>
          </p>
        </div>
        <div>
          <p >
            加工数量：<b>{data.productnum}</b>
          </p>
          <p>
            完成数量：{data.qualifiednum}
          </p>
        </div>
        <div>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>产品序号：</span>
            <Tooltip title={data.prodserial} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'50px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.prodserial}
              </b>
            </Tooltip>
          </p>

        </div>
       {/* <div style={{verticalAlign: 'middle'}}>
          <Progress
            strokeColor={{
              '0%': '#e95023',
              '100%': '#d03e1a',
            }}
            //percent={(data.qualifiednum/data.productnum || 0)*100}
            percent={50}
            size="small"
            style={{marginTop:'15px'}}/>
        </div>*/}
        <div>
          <p style={{display:'flex',alignItems:'center'}}>
            <span style={{display:'inline-block'}}>截止时间：</span>
            <Tooltip title={data.actendtime} style={{display:'inline-block'}}>
              <b style={{display:'inline-block',width:'50px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
                {data.actendtime}
              </b>
            </Tooltip>
          </p>
          <p>
            距离截止日期还有<b>{data.surday}</b>天
          </p>

        </div>

        <div style={{boxSizing:'border-box',paddingTop:'5px'}}>
          <Button type="primary"  onClick={()=>this.onClickTasks(data)}>进入</Button>
        </div>
      </div>
    }

    const columns = [
      {
        title: '工艺工序',
        dataIndex: 'processplanCode',
      },
      {
        title: '工序状态',
        dataIndex: 'processstatus',
        render:(text,record)=>{
          switch(text){
            case 0:
              return '未下达';
              break;
            case 1:
              return '已下达班组';
              break;
            case 2:
              return '已派工';
              break;
            case 3:
              return '开始生产'
              break;
            case 4:
              return '结束生产';
              break;
            case 5:
              return '取消生产';
              break;
            case 6:
              return '暂停生产';
              break;
            case 7:
              return '取消暂停';
              break;
          }
        }
      },
      {
        title: '当前工序',
        dataIndex: 'processplanName',
      },
      {
        title: '完成状态',
        dataIndex: 'status'
      },
      {
        title: '物料编号',
        dataIndex: 'materialBaseCode',
      },
      {
        title: '物料名称',
        dataIndex: 'materialBaseName',
      },
      {
        title: '加工数量',
        dataIndex: 'productnum',
      },
      {
        title: '完成数量',
        dataIndex: 'qualifiednum',
      },
      {
        title: '进度',
        dataIndex: 'umId',
        render:(text, record)=>{
          return <Progress percent={(record.qualifiednum/record.productnum || 0)*100} showInfo={false}/>
        }
      },
      {
        title: '开始时间',
        dataIndex: 'actstarttime',
      },
      {
        title: '截止时间',
        dataIndex: 'actendtime',
      },
      {
        title: '距离时间',
        dataIndex: 'time',
        render:(text, record)=>{
          if(record.actendtime && record.actstarttime){
            let  b= moment(record.actendtime,'YYYY-MM-DD HH:mm:ss');
            let  a= moment(record.actstarttime,'YYYY-MM-DD HH:mm:ss');
            let c = b.diff(a,'days');
            let m = b.diff(a,'minute');
            let s = b.diff(a,'second');
            return `${c}天${m}分${s}秒`
          }else{
            return ''
          }
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed:'right',
        render: (text, record) => {
          switch (record.typeStatus) {
            case 0:
              return "进入";
            case 1:
              return <Fragment>
                <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>进入</a>
              </Fragment>
            case 2:
              return "进入"
          }
        }
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{display:'flex'}}>
            <div style={{textAlign:'center',width:'33%',borderRight:'1px solid #e8e8e8'}}>
              <p style={{color:'rgba(0,0,0,.45)'}}>我的待办</p>
              <h2>{this.state.workData}个任务</h2>
            </div>
            <div style={{textAlign:'center',width:'33%',borderRight:'1px solid #e8e8e8'}}>
              <p style={{color:'rgba(0,0,0,.45)'}}>本周任务平均处理时间</p>
              <h2>32分钟</h2>
            </div>
            <div style={{textAlign:'center',width:'33%'}}>
              <p style={{color:'rgba(0,0,0,.45)'}}>本周完成任务数</p>
              <h2>24个任务</h2>
            </div>
          </div>
        </Card>
        <Card bordered={false} style={{marginTop:'15px'}}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="生产任务" key="1">
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={datalist.list}
                renderItem={item => (
                  <List.Item
                  >
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
             {/* <NormalTable
                data={datalist}
                loading={fetchTableLoading}
                scroll={{ y: 260}}
                columns={columns}
                onChange={this.handleStandardTableChange}
              />*/}
            </TabPane>
            <TabPane tab="检验任务" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="维修人物" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>,

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductProcess;
