import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Transfer ,
  Modal,
  message,
  Popconfirm,
  Tabs,
  Button
} from 'antd';

const { TabPane } = Tabs;

@connect(({ user, loading }) => ({
  user,
  //loading: loading.models.RR,
}))
@Form.create()
class index extends PureComponent {
  state = {
    mockData:[],
    targetKeys:[],

    status:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
      const { dispatch } = this.props;
      dispatch({
        type:'user/queryPsnodc',
        payload:{
          reqData:{}
        },
        callback:(res)=>{
          if(res.resData && res.resData.length){
            res.resData.map(item =>{
              item.key = item.id;
            });
            this.setState({
              mockData:res.resData,
            })
          }
        }
      })
    }
  }


  handleCancel = (onCancel)=>{
    if(this.state.status){
      return
    }
    this.setState({
      status:true
    });
    if(typeof onCancel === 'function'){
      onCancel(this.qinChu)
    }
  };

  onSubmit = (onOk)=>{
    const { targetKeys,mockData } = this.state;
    if(this.state.status){
      return
    }
    this.setState({
      status:true
    });

    let arr = [];
    if(targetKeys.length){
      mockData.map(item =>{
        targetKeys.map(it =>{
          if(item.key === it){
            arr.push(item)
          }
        })
      });
    }


    if(typeof onOk === 'function'){
      onOk(arr,this.qinChu)
    }
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  qinChu = (type)=> {
    if(type){
      this.setState({
        status:false
      })
      return
    }
    this.setState({
      mockData: [],
      targetKeys: [],
      status:false
    })
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({ targetKeys });
  };

  callback = (key)=>{
    const { dispatch } = this.props;
    if(key === '1'){
      dispatch({
        type:'user/queryUser',
        payload:{
          reqData:{}
        },
        callback:(res)=>{
          if(res.resData && res.resData.length){
            res.resData = res.resData.map(item =>{
              item.key = item.id;
              item.disabled = 0;
              return item
            });
            this.setState({
              mockData:res.resData,
            })
          }
        }
      })
    }
    if(key === '2'){
      this.setState({
        mockData:[],
        targetKeys:[],
      })
    }
  }

  onShadow = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.qinChu)
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const { visible,title,agree = "确定",cancel = "取消",is = 2 } = data;
    const { onOk,onCancel,onShadow = onCancel } = on;

    let button = <Button onClick={()=>this.shadow(onShadow)}>{cancel}</Button>

    if(is === 2){
      button = <Popconfirm title="确定吗?"  onConfirm={()=>this.handleCancel(onCancel)}>
        <Button >{cancel}</Button>
      </Popconfirm>
    }

    return (
      <Modal
        title={title}
        visible={visible}
        destroyOnClose
        centered
        bodyStyle={{paddingTop:0}}
        onCancel={()=>this.onShadow(onCancel)}
        footer={[
          button
         ,
          <Popconfirm title="确定吗?"  onConfirm={()=>this.onSubmit(onOk)}>
            <Button type="primary" >{agree}</Button>
          </Popconfirm>
        ]}
      >
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="按用户选" key="1">
            <Transfer
              titles={["未分配","已分配"]}
              dataSource={this.state.mockData}
              filterOption={this.filterOption}
              targetKeys={this.state.targetKeys}
              onChange={this.handleChange}
              render={item => item.name}
              showSelectAll={false}
            />
          </TabPane>
          <TabPane tab="按设备选" key="2">

          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default index;

