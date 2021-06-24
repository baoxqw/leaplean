import React, { PureComponent, Fragment } from 'react';
import { ImgPreview } from '@/pages/tool/ToTree';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import { GetDateDiff } from '@/pages/tool/Time';
import {
  Select,
  Row,
  List,
  Modal,
  Col,
  Tabs,
  Radio,
  message,
  Form,
  Input,
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

@connect(({ process,loading }) => ({
  process,
  loading:loading.models.process
}))
@Form.create()
class ProductProcessTasks extends PureComponent {
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
    userId:null
  };

  componentDidMount(){
    let record = this.props.location.state.query

    const user = storage.get("userinfo");
    const id = user.psnId;
    if(record.processstatus <=2){
        this.setState({
          product3:false,
          product4:true,
          product5:true,
          product6:true,
          product7:true,
        })
    }
    if(record.processstatus >=3){
      this.setState({
        product3:true,
        product4:false,
        product5:false,
        product6:false,
        product7:false,
      })
      if(id === record.teamLeaderId){
        this.setState({
          product5:true,
        })
      }
    }

    this.setState({
      record,
      userId:id,
      startProductTime:record.actstarttime
    })

  }

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

  keypress = () =>{
    this.setState({allVisible:false})

  }

  allShow = ()=>{
    this.setState({allVisible:true})
  }

  goClick =()=>{
    router.push('/productexecu/productprocess/checklist')
  }

  methods =(data)=>{
    const { dispatch } = this.props;
    const { record,check,startProductTime,userId } = this.state;
    if(check){
      return
    }
    this.setState({
      check:true
    })
    switch (data) {
      case 3:
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.processplanId,
              techprocesscardId:record.id,
              processstatus:data,
              actstarttime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              operatId:userId
            }
          },
          callback:(res)=>{
            this.setState({
              check:false
            })
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
              message.error('失败')
            }
          }
        })
        break;
      case 4:
        /* dispatch({
           type:'process/addmethods',
           payload:{
             reqData:{
               id:record.processplanId,
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
         })*/
        let b = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        let c = moment(startProductTime).format('YYYY-MM-DD HH:mm:ss')
        let d = GetDateDiff(b, c, "minute");
        this.setState({
          modelVisible:true,
          cancelProductTime:d,
          check:false
        })
        break;
      case 5:
        break;
      case 6:
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.processplanId,
              processstatus:data,
            }
          },
          callback:(res)=>{
            this.setState({
              check:false
            })
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
        dispatch({
          type:'process/addmethods',
          payload:{
            reqData:{
              id:record.processplanId,
              processstatus:data,
            }
          },
          callback:(res)=>{
            this.setState({
              check:false
            })
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
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const {artfile,artdeflect,product3,product4,product5,product6,product7,record,modelVisible,cancelProduct,cancelProductTime}  = this.state;

    const description = (
      <DescriptionList size="small" col="2">
        <Description term={"产品编码"}>{record.materialBaseCode?record.materialBaseCode:''}</Description>
        <Description term={"产品名称"}>{record.materialBaseName?record.materialBaseName:''}</Description>
        <Description term={"加工数量"}>{record.productnum?record.productnum:''}</Description>
        <Description term={"完成数量"}>{record.qualifiednum?record.qualifiednum:''}</Description>
        <Description term={"截止时间"}>{record.actendtime?record.actendtime:''}</Description>
        <Description term={"备注"}>{record.materialBaseName?record.materialBaseName:''}</Description>
        <p style={{color:'#c92d28',fontWeight:'900'}}>
          操作说明： 搪锡及成形要求按K.06-004工艺文件执行，操作过程需佩戴防静电手环，发现
          有多余的器件必须放入乙醇中清洗，清洗后，请在生产过程管理界面完成调参输入
        </p>

      </DescriptionList>
    );

    const extraContent = (
      <div>
        <Button type={this.state.lookVisible?'':'primary'} onClick={this.lookDetail}>查看详情</Button>
      </div>
    )

    const imgArray =[
      {
        key:0,
        url:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        src:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
      {
        key:1,
        url:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        src:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      },
    ]

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
              id:record.processplanId,
              processstatus:4,
              actendtime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              manhour:cancelProductTime,
              techprocesscardId:record.id,
              checkFlag:record.checkFlag,
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('成功',1.5,()=>{
                this.setState({
                  product3:true,
                  product4:true,
                  product6:false,
                  product7:false,
                })
                router.push('/productexecu/productprocess/list');
                clear()
                /*dispatch({
                  type:'process/endmethods',
                  payload:{
                    reqData:{
                      status:2,
                      id:record.processpersonId,
                    }
                  },
                  callback:(res)=>{
                    if(res.errMsg === "成功"){
                      router.push('/productexecu/productprocess/list');
                    }else{
                      message.error('失败')
                    }

                  }
                })*/
              })
            }else{
              clear(1)
              message.error('失败')
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          modelVisible:false
        })
      }
    }

    const processData = {
      visible:modelVisible
    }
    return (
      <PageHeaderWrapper
        title={`当前任务: ${record.processplanCode}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        //action={action}
        content={description}
        extraContent={extraContent}
        //tabList={operationTabList}
        //onTabChange={this.onOperationTabChange}
      >
        <Card bordered={false}>
          <div style={{display:'flex',justifyContent:'center'}}>
            <Button type='primary' style={{margin:'10px'}} onClick={()=>this.methods(3)} disabled={product3}>开始生产</Button>
            <Button type='dashed' style={{margin:'10px'}} onClick={()=>this.methods(4)} disabled={product4}>完成生产</Button>
            <Button type='danger' style={{margin:'10px'}} onClick={()=>this.methods(5)} disabled={product5}>取消生产</Button>
            <Button  style={{margin:'10px'}} onClick={()=>this.methods(6)} disabled={product6}>暂停生产</Button>
            <Button style={{margin:'10px'}} onClick={()=>this.methods(7)} disabled={product7}>取消暂停</Button>
          </div>
        </Card>
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
                          <video src={item.url} controls></video>
                        </Card>
                      </List.Item>
                    }else if(artfile === 2){
                      return <List.Item>
                        <Card>
                          <div>
                            <img style={{}}  src={item.url} className={styles.pimg} onClick={this.allShow}/>
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

export default ProductProcessTasks;

