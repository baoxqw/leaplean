import React, { Fragment, PureComponent } from 'react';
import {
  Form,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  Modal
} from 'antd';

@Form.create()
class index extends PureComponent {
  state={
    visible:false,
  };

  onIconClick =()=>{
    this.setState({
      visible:true,
    });
  };

  handleOk = (onOk)=>{
    const { form,data:{columns} } = this.props;
    form.validateFields((err,values)=>{
      if(err){
        return
      }

      columns.map(item =>{
        for(let key in values){
          if(item.dataIndex === key){
            item.disabled = values[key]
          }
        }
      })

      if(typeof onOk === 'function'){
        onOk(columns);
      }
      this.onHandleReset();
    })
  };

  handleCancel = ()=>{
    this.onHandleReset();
  }

  onHandleReset = (handleReset)=>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible:false,
    });
    if(typeof handleReset === 'function'){
      handleReset();
    }
  }

  render() {
    const {
      form:{getFieldDecorator},
      on,
      data,
      value
    } = this.props;
    const { onOk } = on;
    let {
      title,
      icon = "plus",
      type = "primary",
      styleButton = {},
      columns = [],
      required = []
    } = data;

    const result = [];
    let arrList = [];
    if(columns.length){
      columns = columns.filter(item =>{
        return 'disabled' in item
      })

      for(let i=0;i<columns.length;i+=3){
        result.push(columns.slice(i,i+3));
      }

      arrList = result.map(item =>{
        return <Row gutter={16}>
          {
            item.map((it,i)=>{
              const c =  <Form.Item label={it.title}>
                {getFieldDecorator(`${it.dataIndex}`,{
                  valuePropName: 'checked',
                  initialValue: it.disabled
                })(<Checkbox disabled={required.indexOf(it.dataIndex) !== -1}/>)}
              </Form.Item>

              if(i === 0){
                return <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  {c}
                </Col>
              }
              if(i === 1){
                return <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  {c}
                </Col>
              }
              if(i === 2){
                return <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  {c}
                </Col>
              }
            })
          }
        </Row>
      })
    }

    return (
      <span>
        <Button icon={icon} type={type} style={styleButton} onClick={()=>this.onIconClick()}>{title}</Button>
         <Modal
           title={title}
           width='72%'
           centered
           destroyOnClose
           visible={this.state.visible}
           onOk={()=>this.handleOk(onOk)}
           onCancel={()=>this.handleCancel()}
         >
            <Card bordered style={{height:`${window.innerHeight>960?760:window.innerHeight/1.5}px`}}>
              {arrList}
            </Card>
          </Modal>
      </span>
    );
  }
}

export default index;
