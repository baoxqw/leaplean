import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon,
  Row,
  Tree,
  Modal,
  message
} from 'antd';
import { toTree,getParentKey } from "@/pages/tool/ToTree";
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;


@Form.create()

class index extends PureComponent {
  state = {
    visible:false,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,

    expandedKeysL: [],
    searchValueL: '',
    autoExpandParentL: true,

    info:{},
  };

  onSelectL = (selectedKeys, info,onSelectTreeLeft) => {
    if(typeof onSelectTreeLeft === 'function'){
      onSelectTreeLeft(selectedKeys, info);
    }
  };

  onSelectR = (selectedKeys, info,onSelectTreeRight)=>{
    this.setState({
      info
    })
    if(typeof onSelectTreeRight === 'function'){
      onSelectTreeRight(selectedKeys, info);
    }
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

  onIconClick=(onIconClick)=>{
    this.setState({
      visible:true,
    });
    if(typeof onIconClick === 'function'){
      onIconClick();
    }
  };

  handleOk = (onOk)=>{
    const { data:{TreeRightKey},onChange } = this.props;
    const { info } = this.state;
    if(!TreeRightKey.length){
      return message.error("请选择数据")
    }
    if(typeof onOk === 'function'){
      onOk(TreeRightKey,info,this.clear,onChange);
    }
  };

  handleCancel = (onCancel)=>{
    onCancel(this.clear)
  }

  clear = (status = 0)=> {
    if(status){
      this.setState({
        visible:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible:false,

      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      expandedKeysL: [],
      searchValueL: '',
      autoExpandParentL: true,

      info:{},
    })
  }

  onButtonEmptyClick = (onButtonEmpty)=>{
    const{ onChange } = this.props;
    if(typeof onButtonEmpty === 'function'){
      onButtonEmpty(onChange);
    }
  }

  onChangeSearchR = e => {
    const value = e.target.value;
    const { data:{TreeRightData} } = this.props;
    if(!value){
      this.setState({expandedKeys:[]})
      return
    }
    const expandedKeys = TreeRightData
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, TreeRightData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeys:strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onChangeSearchL = e => {
    const value = e.target.value;
    const { data:{TreeLeftData} } = this.props;
    if(!value){
      this.setState({expandedKeysL:[]})
      return
    }
    const expandedKeys = TreeLeftData
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, TreeLeftData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeysL:strExpandedKeys,
      searchValueL: value,
      autoExpandParentL: true,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onExpandL = expandedKeys => {
    this.setState({
      expandedKeysL:expandedKeys,
      autoExpandParentL: false,
    });
  };

  render() {
    const {
      on,
      form,
      form:{getFieldDecorator},
      loading,
      data,
      disabled=false,
      style,
      value
    } = this.props;
    const {
      onSelectTreeLeft,
      onSelectTreeRight,
      onIconClick,
      onOk,
      onCancel,
      onButtonEmpty
    } = on;
    let {
      TreeLeftData,
      TreeRightData,
      childrenList=[],
      placeholder,
      title,
      leftTitle,
      rightTitle,
      TreeRightKey,
      zIndex = 1050
    } = data;
    const { searchValue,expandedKeys,autoExpandParent,searchValueL,expandedKeysL,autoExpandParentL } = this.state;

    if(TreeLeftData.length){
      TreeLeftData.map(item=>{
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
    }

    const loopL = data =>data.map(item => {
        const index = item.name.indexOf(searchValueL);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValueL.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValueL}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });

    const loop = data =>data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });

    return (
      <div>
        <div style={{display:'flex',alignItems:'center'}}>
          <Select
            disabled={disabled}
            suffixIcon={<Icon type="unordered-list" onClick={()=>this.onIconClick(onIconClick)}/>}
            style={{width:'100%',...style}}
            value={value}
            open={false}
            placeholder={placeholder}
          >
            {children(childrenList)}
          </Select>
        </div>
        <div>
          <Modal
            zIndex={zIndex}
            title={title}
            destroyOnClose
            visible={this.state.visible}
            centered
            width='72%'
            onOk={()=>this.handleOk(onOk)}
            onCancel={()=>this.handleCancel(onCancel)}
            footer={[<Button key={1} onClick={()=>this.onButtonEmptyClick(onButtonEmpty)} style={{float:'left',display:`${TreeRightKey.length?"inline":"none"}`}}>清除选中项</Button>,
              <Button key={2} onClick={()=>this.handleCancel(onCancel)}>取消</Button>,
              <Button type="primary" key={3} onClick={()=>this.handleOk(onOk)}>确定</Button>]}
          >
            <div style={{display:'flex',height:`${window.innerHeight>960?760:window.innerHeight/1.5}px`}}>
              <Card title={leftTitle} style={{ width:'22%',overflow:'auto'}} bordered>
                <div >
                  <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearchL} />
                  <Tree
                    onExpand={this.onExpandL}
                    expandedKeys={expandedKeysL}
                    autoExpandParent={autoExpandParentL}
                    onSelect={(selectedKeys,info)=>this.onSelectL(selectedKeys, info,onSelectTreeLeft)}
                  >
                    {loopL(TreeLeftData)}
                  </Tree>
                </div>
              </Card>
              <Card title={rightTitle} style={{ width:'78%'}} bordered>
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearchR} />
                <Tree
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  selectedKeys={TreeRightKey}
                  onSelect={(selectedKeys,info)=>this.onSelectR(selectedKeys, info,onSelectTreeRight)}
                >
                  {loop(TreeRightData)}
                </Tree>
              </Card>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default index;
