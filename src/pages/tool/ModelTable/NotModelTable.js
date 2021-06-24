import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Divider,
  Icon,
  Tooltip,
  AutoComplete,
  Row,
  Col,
  message,
  Tree,
  Table,
  Tabs,
  Modal
} from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;
@Form.create()
class NotModelTable extends PureComponent {
  state={
    visible:false,
    selectedRowKeys:[],
    selectedRows:[],
    expandForm:false
  };

  onSelect = (selectedKeys, info) => {
    //onSelectTree(selectedKeys, info)
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys,selectedRows });
  };

  handleTableChange = (pagination,handleTableChange)=>{
    const obj = {
      pageIndex: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    if(typeof handleTableChange === 'function'){
      handleTableChange(obj);
    }
  }

  onIconClick=(onIconClick)=>{
    const {data:{selectedRowKeys}} = this.props;
    this.setState({
      visible:true,
      selectedRowKeys
    });
    if(typeof onIconClick === 'function'){
      onIconClick()
    }
  };

  handleOk = (onOk)=>{
    const { selectedRowKeys,selectedRows } = this.state;
    if(!selectedRows.length){
      this.setState({
        visible:false,
      });
      return
    }
    const { form } = this.props;
    if(typeof onOk === 'function'){
      onOk(selectedRowKeys,selectedRows);
    }
    form.resetFields();
    this.setState({
      visible:false,
    });
  };

  handleCancel = (onCancel)=>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible:false,
      selectedRowKeys:[],
      selectedRows:[],

      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      buttonStatus:false,

      info:{}
    })
    if(typeof onCancel === 'function'){
      onCancel()
    }
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
    const { form } = this.props;
    form.resetFields();
    if(typeof handleReset === 'function'){
      handleReset();
    }
  }

  onButtonEmptyClick = (onButtonEmpty)=>{
    this.setState({
      selectedRowKeys:[],
      selectedRows:[]
    })
    if(typeof onButtonEmpty === 'function'){
      onButtonEmpty();
    }
  }

  render() {
    const {
      on,
      form:{getFieldDecorator},
      loading,
      data,
      value
    } = this.props;
    const { handleTableChange,onIconClick,onOk,onCancel,handleSearch,handleReset,onButtonEmpty } = on;
    let {
      TableData,
      childrenList=[],
      placeholder,
      columns,
      title,
      fetchList=[],
      disabled=false,
      SelectValue,
      classNameSaveColumns,
      zIndex = 1050
    } = data;

    const { selectedRowKeys,expandForm } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type:'radio'
    };
    if(TableData && TableData.list){
      TableData.list.map(item=>{
        item.key = item.id;
        return item
      })
    }

    const children = (data)=>{
      if(!data || !data.length){
        return;
      }
      return data.map((item)=>{
        return <Option key={item.id}>{item.name}</Option>
      })
    };

    return (
      <div>
        <Select
          suffixIcon={<Icon type="unordered-list" onClick={()=>this.onIconClick(onIconClick)}/>}
          style={{ width: '100%' }}
          value={SelectValue}
          open={false}
          placeholder={placeholder}
          disabled={disabled}
        >
          {children(childrenList)}
        </Select>
        <div>
          <Modal
            zIndex={zIndex}
            title={title}
            width='72%'
            centered
            destroyOnClose
            visible={this.state.visible}
            onOk={()=>this.handleOk(onOk)}
            onCancel={()=>this.handleCancel(onCancel)}
            footer={[
              <Button
                onClick={()=>this.onButtonEmptyClick(onButtonEmpty)}
                key={1}
                style={{float:'left',display:`${this.state.selectedRowKeys?this.state.selectedRowKeys[0]?"inline":"none":"none"}`}}>
                清空</Button>,
              <Button
                key={2}
                onClick={()=>this.handleCancel(onCancel)}>取消
              </Button>,<Button type="primary" key={3} onClick={()=>this.handleOk(onOk)}>确定</Button>]}
          >
            <Card bordered style={{height:`${window.innerHeight>960?760:window.innerHeight/1.5}px`}}>
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
                data={TableData}
                scroll={{y:window.screen.height>=900?window.innerHeight/2.5:window.innerHeight/3}}
                columns={columns}
                rowSelection={rowSelection}
                classNameSaveColumns={classNameSaveColumns}
                onChange={(pagination)=>this.handleTableChange(pagination,handleTableChange)}
              />
            </Card>
          </Modal>
        </div>
      </div>

    );
  }
}

export default NotModelTable;
