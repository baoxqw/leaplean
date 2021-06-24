import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Transfer,
  Modal,
  Popconfirm,
  Button,
} from 'antd';

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.RR,
}))
@Form.create()
class SelectUser extends PureComponent {
  state = {
    mockData:[],
    targetKeys:[],
  };


  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
      const { data:{conditions,type,payload} } = nextProps;
        const { dispatch } = this.props;
        dispatch({
          type,
          payload,
          callback:(res)=>{
            console.log("res",res)
            if(res.resData && res.resData.length){
              res.resData.map(item =>{
                item.key = item.id;
                item.disabled = 0;
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
    if(typeof onCancel === 'function'){
      onCancel()
    }
    this.qinChu()
  };

  onSubmit = (onOk)=>{
    const { targetKeys,mockData } = this.state;
    const arr = [];
    mockData.map(item =>{
      targetKeys.map(it =>{
        if(item.key === it){
          arr.push({
            id:item.id,
            name:item.name
          })
        }
      })
    });
    if(typeof onOk === 'function'){
      onOk(arr,this.qinChu)
    }
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = (targetKeys) => {
    const { mockData } = this.state;
    let arr = [];
    if(targetKeys.length){
      arr = arr = this.retArr(targetKeys)
    }else{
      arr = mockData.map(item =>{
        item.disabled = 0
        return item
      });
    }
    this.setState({ targetKeys,mockData:arr });
  };

  qinChu = ()=> {
    this.setState({
      mockData: [],
      targetKeys: [],
    })
  }

  retArr = (dataKeys)=>{
    const { mockData } = this.state;
    return mockData.map(item =>{
      if(item.key === dataKeys[0]){
        item.disabled = 0
      }else{
        item.disabled = 1
      }
      return item
    });
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const { mockData,targetKeys } = this.state;
    let arr = [];

    if(sourceSelectedKeys.length){
      arr = this.retArr(sourceSelectedKeys)
    }

    if(targetSelectedKeys.length){
      arr = this.retArr(targetSelectedKeys)
    }
    if(targetKeys.length){
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = this.retArr(targetKeys)
      }
    }else{
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = mockData.map(item =>{
          item.disabled = 0;
          return item
        });
      }
    }

    this.setState({
      mockData: arr
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;

    const { visible,title,agree = "同意",cancel = "取消",is = 2 } = data;
    const { onOk,onCancel,onShadow = onCancel } = on;

    let button = <Button onClick={()=>this.shadow(onShadow)}>{cancel}</Button>
    if(is === 2){
      button = <Popconfirm title="确定不加签吗?"  onConfirm={()=>this.handleCancel(onCancel)}>
        <Button >{cancel}</Button>
      </Popconfirm>
    }
    return (
      <Modal
        title={title}
        visible={visible}
        destroyOnClose
        centered
        //onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[
          button
          ,
          <Popconfirm title="确定加签吗?"  onConfirm={()=>this.onSubmit(onOk)}>
            <Button type="primary" >{agree}</Button>
          </Popconfirm>
        ]}
      >
        <div style={{display:'flex',justifyContent:'center'}}>
          <Transfer
            titles={["未分配","已分配"]}
            dataSource={this.state.mockData}
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            render={item => item.name}
            showSelectAll={false}
          />
        </div>
      </Modal>
    );
  }
}

export default SelectUser;

