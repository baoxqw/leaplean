import React, { PureComponent, Fragment } from 'react';
import { ImgPreview } from '@/pages/tool/ToTree';
import { connect } from 'dva';
import Bind from 'lodash-decorators/bind';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import { GetDateDiff } from '@/pages/tool/Time';
import AddIssues from './AddSelf'
import {
  Select,
  Row,
  Tooltip,
  List,
  Modal,
  Col,
  Tabs,
  Radio,
  message,
  Form,
  Input,
  Steps,
  Divider ,
  Button,
  Card,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import ProcessModel from './ProcessModel';
import storage from '@/utils/storage'
import styles from './style.less';
import moment from 'moment'
const { Description } = DescriptionList;
const { TabPane } = Tabs;
const { Step } = Steps;

@connect(({ process,loading }) => ({
  process,
  loading:loading.models.process
}))
@Form.create()
class ProductProcessCheckList extends PureComponent {
  state = {
    artfile:1,//工艺文件单选按钮
    designfile:1,//设计文件单选按钮
    artdeflect:1,//工艺偏离单选按钮
    designdeflect:1,//设计偏离单选按钮
    current:1,
    artdeflectcurrent:1,
    lookVisible:false,
    allVisible:false,
    previewVisible:true,
    record:{},
    check:false,
    modelVisible:false,
    cancelProduct:false,
    startProductTime:null,
    cancelProductTime:null,
    productOk:false,
    product3:false,
    product4:false,
    product5:false,
    product6:false,
    product7:false,
    currentPage:0,
    stepDirection: 'horizontal',
    listArray:[],
    fileList:[],
    show:false,
    initData:{},
    showInfo:'',
    issueVisible:false,
    issuesDEtailData:{},
    sureOk:false,
    isIssues:false,
  };

  componentDidMount(){
    const { dispatch } = this.props
    let initData = this.props.location.state.record;
    this.setState({
      initData
    })
    let fileId = null
    dispatch({
      type:'process/checklist',
      payload:{
        reqData:{
          techprocesscardId:initData.id
        }
      },
      callback:(res)=>{
        if(res && res.resData && res.resData.length){
          let status = false;
          res.resData.map((item,index)=>{
            if(item.stepStatus === 1){
              fileId = item.technologyId
              status = true
              this.setState({
                currentPage:index,
              })

            }
          })
          if(!status){
            this.setState({
              currentPage:res.resData.length
            })
          }
          this.setState({
            listArray:res.resData
          })
          res.resData.map((item)=>{
            //质量问题处理按钮是否禁用
            if((item.portionStatus===1 && item.authStatus === 1
              && item.stepStatus === 1 &&
              item.operatStatus !== 2 &&
              item.checkStatus === 0)){
              dispatch({
                type:'process/findIssuesDetail',
                payload:{
                  reqData:{
                    id:item.id
                  }
                },
                callback:(res)=>{
                  if(res.resData){
                    this.setState({
                      issuesDEtailData:res.resData[0]
                    })
                  }
                }
              })
              this.setState({
                sureOk:true,
                isIssues:true
              })
            }
          })
          dispatch({
            type:'process/fetchFileList',
            payload:{
              reqData:{
                bill_id:fileId,
                type:'technologyrout'
              }
            },
            callback:(res)=>{
              this.setState({
                fileList:res
              })
            }
          });
        }else{
          this.setState({
            listArray:[]
          })
        }
      }
    })


  }

  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  handleUpdateProject = item => {
    const  { show } = this.state
    const user = storage.get("userinfo");
    const id = user.psnId;
    this.setState({
      show:true,
      record:item
    })
    if(item.processstatus <=2){
      this.setState({
        product3:false,
        product4:true,
        product5:true,
        product6:true,
        product7:true,
      })
    }
    if(item.processstatus >=3){
      this.setState({
        product3:true,
        product4:false,
        product5:false,
        product6:false,
        product7:false,
      })
      if(id === item.teamLeaderId){
        this.setState({
          product5:true,
        })
      }
    }
  };

  backClick =()=>{
    router.push('/productexecu/productprocess/list')
  }

  tabChange = (key) =>{
    if(key === 1){
      this.setState({artfile:1})
    }else if(key === 2){
      this.setState({designfile:1})
    }
  }

  //工艺文件
  artFileonChange = e => {
    this.setState({
      artfile: e.target.value,
      current:1
    });
  };

  artdeflectFileonChange= e => {
    this.setState({
      artdeflect: e.target.value,
      artdeflectcurrent:1
    });
  };

  lookDetail = ()=>{
    const aa = this.state.lookVisible;
    this.setState({lookVisible:!aa})
  }

  lookIssue = ()=>{
    const { dispatch } = this.props
    const { listArray } = this.state
  /*  listArray.map((item)=>{
      if((item.portionStatus===1 && item.authStatus === 1
        && item.stepStatus === 1 &&
        item.operatStatus !== 2 &&
        item.checkStatus === 0)){
        dispatch({
          type:'process/findIssuesDetail',
          payload:{
            reqData:{
              id:item.id
            }
          },
          callback:(res)=>{
            if(res.resData){
              this.setState({
                issuesDEtailData:res.resData[0]
              })
            }
          }
        })
        this.setState({
          sureOk:true
        })
      }
    })*/
    this.setState({
      issueVisible:true
    })

  }

  keypress = () =>{
    this.setState({allVisible:false})

  }

  allShow = ()=>{
    this.setState({allVisible:true})
  }

  goClick =()=>{
    router.push('/productexecu/productprocess/list')
  }

  methods =(data)=>{
    const { dispatch } = this.props
    const { record } = this.state;
    switch (data) {
      case 3:
        this.setState({
          product3:true
        })
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.id,
              techprocesscardId:record.techprocesscardId,
              processstatus:data,
              actstarttime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('成功',1.5,()=>{
                this.setState({
                  product3:true,
                  product4:false,
                  product6:false,
                  product7:false,
                })
                if(record.status === '初始状态'){
                  dispatch({
                    type:'process/changemethods',
                    payload:{
                      reqData:{
                        id:record.productorderId,
                        actstarttime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                      }
                    },
                    callback:(res)=>{

                    }
                  })
                }
              })
            }else{
              this.setState({
                product3:false
              })
              message.error('失败')
            }
          }
        })

        break;
      case 4:
        this.check = false;
        let b = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        let c = moment(record.startProductTime).format('YYYY-MM-DD HH:mm:ss')
        let d = GetDateDiff(b, c, "minute");
        this.setState({
          modelVisible:true,
          cancelProductTime:d,
        })
        break;
      case 5:
        this.setState({
          product5:true
        })
        break;
      case 6:
        this.setState({
          product6:true
        })
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.id,
              processstatus:data,
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('成功',1.5,()=>{
                router.push('/productexecu/productprocess/list');
              })
            }else{
              message.error('失败')
            }
          }
        })
        break;
      case 7:
        this.setState({
          product7:true
        })
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.id,
              processstatus:data,
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('成功',1.5,()=>{
                router.push('/productexecu/productprocess/list');
              })
            }else{
              message.error('失败')
            }
          }
        })
        break;
    }
  }

  desc = (item) => {
    const { authStatus ,operatStatus,stepStatus,checkStatus,portionStatus,processstatus} = item;
    let str = ""
    switch(processstatus){
      case 0:
        str =  '未下达';
        break;
      case 1:
        str =  '已下达班组';
        break;
      case 2:
        str =  '已派工';
        break;
      case 3:
        str =  '开始生产'
        break;
      case 4:
        str =  '结束生产';
        break;
      case 5:
        str =  '取消生产';
        break;
      case 6:
        str =  '暂停生产';
        break;
      case 7:
        str =  '取消暂停';
        break;
    }
    return (
      <div style={{marginTop:'10px'}}>
        {
          !(portionStatus===1 && authStatus === 1 && stepStatus === 1 && operatStatus !== 2 && checkStatus === 0)?
            <div style={{color:'rgba(0, 0, 0, 0.45)'}}>
              <div>
                {portionStatus===0?"未分配":""}
              </div>
              <div>
                {authStatus===0?"无权限":""}
              </div>
              <div>
                {operatStatus===2?`${item.orpeatName}已${str}`:""}
              </div>
              <div>
                {checkStatus===1?"请通过检验后操作":""}
              </div>
          </div>:<Button onClick={() => this.handleUpdateProject(item)}>
            操作</Button>
        }
      </div>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const {
      product3,product4,product5,product6,product7,
      artfile,artdeflect,show,modelVisible,record,
      cancelProductTime,stepDirection,listArray,initData,
      fileList,issuesDEtailData,sureOk,isIssues
    }  = this.state;
    const description = (
      <DescriptionList size="small" col="2">
        <Description term={"产品编码"}>{initData.materialBaseCode?initData.materialBaseCode:''}</Description>
        <Description term={"产品名称"}>{initData.materialBaseName?initData.materialBaseName:''}</Description>
        <Description term={"加工数量"}>{initData.productnum?initData.productnum:''}</Description>
        <Description term={"完成数量"}>{initData.qualifiednum?initData.qualifiednum:''}</Description>
        <Description term={"截止时间"}>{initData.actendtime?initData.actendtime:''}</Description>
        <Description term={"备注"}>{initData.materialBaseName?initData.materialBaseName:''}</Description>
        <p style={{color:'#c92d28',fontWeight:'900'}}>
          操作说明： 搪锡及成形要求按K.06-004工艺文件执行，操作过程需佩戴防静电手环，发现
          有多余的器件必须放入乙醇中清洗，清洗后，请在生产过程管理界面完成调参输入
        </p>

      </DescriptionList>
    );

    const extraContent = (
      <div style={{textAlign:'right'}}>
         <Button type={this.state.lookVisible?'':'primary'} onClick={this.lookDetail} style={{}}>查看详情</Button>
         <Button
           type={'primary'}
           onClick={this.lookIssue}
           disabled={!isIssues}
           style={{marginLeft:'10px'}}
         >质量问题处理</Button>
      </div>
    )

    const imgArray = fileList

    const videoArray = [
        {
        key:0,
        url:'http://vjs.zencdn.net/v/oceans.mp4'
      },
      {
        key:1,
        url:"https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      }
    ]

    const cadArray = [
      {
        key:0,
        name:'第一幅CAD制作'
      },
      {
        key:1,
        name:'第二幅CAD制作'
      },
      {
        key:2,
        name:'第三幅CAD制作'
      },
    ]

    const theaod = (data)=>{
      if(data === 1){
        return videoArray
      }else if(data === 2){
        return imgArray
      }else {
        return cadArray
      }
    }

    const artdeflecttheaod = (data)=>{
      if(data === 1){
        return videoArray
      }else if(data === 2){
        return imgArray
      }else {
        return cadArray
      }
    }

    //完成生产
    const onProcess = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'process/addmodel',
          payload:{
            reqData:{
              ...obj,
              id:record.id,
              techprocesscardId:record.techprocesscardId,
              checkFlag:record.checkFlag,
              processstatus:4,
              actendtime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              manhour:cancelProductTime
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('成功',1.5,()=>{
                this.setState({
                  product3:false,
                  product4:true,
                  product6:true,
                  product7:true,
                  modelVisible:false,
                  show:false,
                  check:false
                })
                clear()
                //流程到达第几步
               /* dispatch({
                  type:'process/checklist',
                  payload:{
                    reqData:{
                      techprocesscardId:record.techprocesscardId
                    }
                  },
                  callback:(res)=>{
                    if(res && res.resData && res.resData.length){
                      let status = false;
                      res.resData.map((item,index)=>{
                        if(item.stepStatus === 1){
                          status = true
                          this.setState({
                            currentPage:index
                          })
                        }
                      })
                      if(!status){
                        this.setState({
                          currentPage:res.resData.length
                        })
                      }
                      this.setState({
                        listArray:res.resData,
                      })
                    }else{
                      this.setState({
                        listArray:[]
                      })
                    }
                  }
                })*/
                dispatch({
                  type:'process/checklist',
                  payload:{
                    reqData:{
                      techprocesscardId:record.techprocesscardId
                    }
                  },
                  callback:(res)=>{
                    if(res && res.resData && res.resData.length){
                      let status = false;
                      res.resData.map((item,index)=>{
                        if(item.stepStatus === 1){
                          status = true
                          this.setState({
                            currentPage:index,
                          })

                        }
                      })
                      if(!status){
                        this.setState({
                          currentPage:res.resData.length
                        })
                      }
                      this.setState({
                        listArray:res.resData
                      })
                      res.resData.map((item)=>{
                        //质量问题处理按钮是否禁用
                        if((item.portionStatus===1 && item.authStatus === 1
                          && item.stepStatus === 1 &&
                          item.operatStatus !== 2 &&
                          item.checkStatus === 0)){
                          dispatch({
                            type:'process/findIssuesDetail',
                            payload:{
                              reqData:{
                                id:item.id
                              }
                            },
                            callback:(res)=>{
                              if(res.resData){
                                this.setState({
                                  issuesDEtailData:res.resData[0]
                                })
                              }
                            }
                          })
                          this.setState({
                            sureOk:true,
                            isIssues:true
                          })
                        }else{
                          this.setState({
                            sureOk:false,
                            isIssues:false
                          })
                        }
                      })
                      dispatch({
                        type:'process/fetchFileList',
                        payload:{
                          reqData:{
                            bill_id:fileId,
                            type:'technologyrout'
                          }
                        },
                        callback:(res)=>{
                          this.setState({
                            fileList:res
                          })
                        }
                      });
                    }else{
                      this.setState({
                        listArray:[]
                      })
                    }
                  }
                })
              })
            }else{
              clear(1)
              this.setState({
                modelVisible:false,
                check:false
              })
              message.error('失败')
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          modelVisible:false,
          check:false
        })
      }
    }

    const processData = {
      visible:modelVisible
    }
    //质量问题处理
    const onIssues = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'process/addissuesword',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({
                  issueVisible:false,
                  sureOk:false,
                  issuesDEtailData:{}
                })
                clear()

              })
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          issueVisible:false
        })
      }
    }
    const issuesData = {
      record:issuesDEtailData,
      visible: this.state.issueVisible,
      sureOk:this.state.sureOk
    }
    return (
      <PageHeaderWrapper
        title={`当前任务: ${initData.processplanName}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        //action={action}
        content={description}
        extraContent={extraContent}
        //tabList={operationTabList}
        //onTabChange={this.onOperationTabChange}
      >
        <Card title='流程进度' style={{ marginBottom: 24 }} bordered={false}>


          <Steps direction={stepDirection} size="default" current={this.state.currentPage}>
            {
              listArray.map((item)=>{
                return <Step title={`工序:${item.processplanName}`} description={this.desc(item)} />
              })
            }
          </Steps>

        </Card>
        {
          show? <Card bordered={false} >
            <div style={{display:'flex',justifyContent:'center'}}>
              <Button type='primary' style={{margin:'10px'}} onClick={()=>this.methods(3)} disabled={product3}>开始生产</Button>
              <Button type='dashed' style={{margin:'10px'}} onClick={()=>this.methods(4)} disabled={product4}>完成生产</Button>
              <Button type='danger' style={{margin:'10px'}} onClick={()=>this.methods(5)} disabled={product5}>取消生产</Button>
              <Button  style={{margin:'10px'}} onClick={()=>this.methods(6)} disabled={product6}>暂停生产</Button>
              <Button style={{margin:'10px'}} onClick={()=>this.methods(7)} disabled={product7}>取消暂停</Button>
            </div>
          </Card>:''
        }

        {
          this.state.lookVisible?<Card bordered={false}  style={{marginTop:'30px'}}>
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab="工艺文件" key="1" >
                <Radio.Group onChange={this.artFileonChange} value={this.state.artfile}>
                  <Radio value={1}>视频</Radio>
                  <Radio value={2}>图片</Radio>
                  <Radio value={3}>CAD</Radio>
                </Radio.Group>
                <List
                  // grid={{ gutter: 8, column: 1 }}
                  size='small'
                  style={{marginTop:'20px'}}
                  dataSource={theaod(artfile)}
                  pagination={{
                    onChange: page => {
                      this.setState({
                        current:page
                      })
                    },
                    pageSize:1,
                    current:this.state.current ,
                    total:theaod(artfile).length
                  }}
                  renderItem={item => {
                    if(artfile === 1){
                      return <List.Item>
                        <Card>
                          <video style={{maxWidth:'500px'}} src={item.url} controls></video>
                        </Card>
                      </List.Item>
                    }else if(artfile === 2){
                      return <List.Item>
                        <Card>
                          <div >
                            <img style={{maxWidth:'500px'}}  src={item.url} className={styles.pimg} onClick={this.allShow}/>
                            {/*<div onClick={this.allShow} className={styles.pbottom} >*/}
                            {/*<Icon type="appstore"/>*/}
                            {/*</div>*/}
                          </div>
                          {
                            this.state.allVisible?<div className={styles.previewWrapper} onClick={this.keypress}>
                              <div >
                                <img className={styles.imgContainer}  src={item.url}/>
                              </div>
                            </div>:''
                          }

                        </Card>
                      </List.Item>
                    }else if(artfile === 3){
                      return <Card>
                        <p>{item.name}</p>
                      </Card>
                    }

                  }}
                />
              </TabPane>
              <TabPane tab="设计文件" key="2">
                设计文件
              </TabPane>
              <TabPane tab="工艺偏离" key="3">
                <Radio.Group onChange={this.artdeflectFileonChange} value={this.state.artdeflect}>
                  <Radio value={1}>视频</Radio>
                  <Radio value={2}>图片</Radio>
                  <Radio value={3}>CAD</Radio>
                </Radio.Group>
                <List
                  // grid={{ gutter: 8, column: 1 }}
                  size='small'
                  style={{marginTop:'20px'}}
                  dataSource={artdeflecttheaod(artdeflect)}
                  pagination={{
                    onChange: page => {
                      this.setState({
                        artdeflectcurrent:page
                      })
                    },
                    pageSize:1,
                    current:this.state.artdeflectcurrent ,
                    total:artdeflecttheaod(artdeflect).length
                  }}
                  renderItem={item => {
                    if(artdeflect === 1){
                      return <List.Item>
                        <Card>
                          <video src={item.url} controls></video>
                        </Card>
                      </List.Item>
                    }else if(artdeflect === 2){
                      return <List.Item>
                        <Card>
                          <img style={{width:'100%',height:'auto'}} src={item.url}/>
                        </Card>
                      </List.Item>
                    }else if(artdeflect === 3){
                      return <Card>
                        <p>{item.name}</p>
                      </Card>
                    }

                  }}
                />
              </TabPane>
              <TabPane tab="设计偏离" key="4">
                设计偏离
              </TabPane>
            </Tabs>
          </Card>:''
        }
        <ProcessModel on={onProcess} data = {processData}/>
        <AddIssues on={onIssues} data = {issuesData}/>

        <FooterToolbar >
          <Button
            onClick={this.goClick}
          >
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ProductProcessCheckList;

