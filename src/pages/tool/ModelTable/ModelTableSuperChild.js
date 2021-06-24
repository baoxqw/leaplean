import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Row,
  Tree,
  Modal
} from 'antd';
import './style.less';

const FormItem = Form.Item;

@Form.create()
class ModelTableSuperChild extends PureComponent {
  state={
    selectedRowKeys:[],
    selectedRows:[],
    expandForm:false,

    superId:null,
    record:{},
  };

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys,selectedRows });
  };

  handleOk = (onOk)=>{
    const { selectedRowKeys,selectedRows } = this.state;
    const { onChange } = this.props;
    if(typeof onOk === 'function'){
      onOk(selectedRowKeys,selectedRows,onChange,this.clear);
    }
  };

  handleCancel = (onCancel)=>{
    onCancel(this.clear)
  }

  onHandleSearch = (e,handleSearch)=>{
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      if(typeof handleSearch === 'function'){
        handleSearch(values);
      }
    })
  }

  onHandleReset = (handleReset)=>{
    if(typeof handleReset === 'function'){
      handleReset(this.clear);
    }
  }

  setRowClassName = (record) => {
    return record.id === this.state.superId ? 'clickRowStyl' : '';
  };

  clear = ()=>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      selectedRowKeys:[],
      selectedRows:[],
      expandForm:false,

      superId:null,
      record:{},
    })
  }

  render() {
    const {
      on,
      form:{getFieldDecorator},
      loading,
      data,
      value
    } = this.props;
    const { onOk,onCancel,handleSearch,onSelected,handleReset,onButtonEmpty } = on;
    let {
      TableSuperData,
      TableChildData,
      columns,
      columns2,
      title,
      fetchList=[],
      visible=false
    } = data;

    const { selectedRowKeys,selectedRows } = this.state;

    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
      //type:'radio'
    };

    if(TableSuperData){
      TableSuperData.map(item=>{
        if(!item.key){
          item.key = item.id;
        }
      })
    }
    if(TableChildData){
      TableChildData.map(item=>{
        if(!item.key){
          item.key = item.id;
        }
      })
    }

    return (
      <div>
        <Modal
          title={title}
          width='72%'
          centered
          destroyOnClose
          visible={visible}
          onOk={()=>this.handleOk(onOk)}
          onCancel={()=>this.handleCancel(onCancel)}
        >
          <Card bordered style={{height:document.body.clientHeight/1.5,overflow:"auto"}}>
            <Form onSubmit={(e)=>this.onHandleSearch(e,handleSearch)} layout="inline" style={{display:'flex',paddingLeft:"12px"}}>
              <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                {
                  fetchList.map((item,index)=>{
                    return (
                      <FormItem label={item.label} key={index}>
                        {getFieldDecorator(item.code)(item.type?item.type():<Input placeholder={item.placeholder} />)}
                      </FormItem>
                    )
                  })
                }
              </Row>
              <Row md={8} sm={24} style={{marginTop:'4px',marginLeft:'12px'}}>
                    <span>
                       <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={()=>this.onHandleReset(handleReset)}>
                        取消
                      </Button>
                    </span>
              </Row>
            </Form>
              <NormalTable
              style={{marginTop:'12px'}}
              loading={loading}
              data={{list:TableSuperData}}
              scroll={{y:140}}
              columns={columns}
              rowClassName={this.setRowClassName}
              onRow={(record)=>{
                return {
                  onClick:()=>{
                    this.setState({
                      superId:record.id,
                      record,
                    })
                    onSelected(record);
                  },
                  rowKey:record.id
                }
              }}
              pagination={false}
            />

            <Divider />

            <NormalTable
              loading={loading}
              data={{list:TableChildData}}
              scroll={{y:240}}
              columns={columns2}
              rowSelection={rowSelection}
              pagination={false}
            />
          </Card>
        </Modal>
      </div>
    );
  }
}

export default ModelTableSuperChild;
