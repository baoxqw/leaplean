import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Modal,
  Col,
  Form,
  Input,
  TreeSelect, Button,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';

import SelectModelTable from '@/pages/tool/SelectModelTable';

const { TreeNode } = TreeSelect;
const { TextArea } = Input;

@connect(({ team, loading }) => ({
  team,
  loading: loading.models.team,
  TeamLoading: loading.effects['team/fetchTable'],
}))
@Form.create()
class TeamAdd extends PureComponent {
  state = {
    deptId:[],
    deptTreeValue:[],

    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    BStatus:false
  };

  handleOk = (onSave)=>{
    const { form } = this.props;
    const { selectedOperationRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        code:values.code,
        name:values.name,
        teamLeaderId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
        deptId:this.state.deptId,
        status:values.status,
        memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      deptId:[],
      deptTreeValue:[],

      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      BStatus:false
    })
  }


  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'team/fetchDept',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res && res.resData){
          const a = toTree(res.resData);
          this.setState({
            deptTreeValue:a
          })
        }else{
          this.setState({
            deptTreeValue:[]
          })
        }
      }
    });
  }

  onChangDepartment=(value,)=>{
    this.setState({
      deptId:value
    })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      data,
      TeamLoading,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onSave,onCancel } = on;

    const ons = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue:nameList,
          selectedOperationRowKeys:selectedRowKeys,
        })
      },
      onButtonEmpty:(onChange)=>{
        onChange([])
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      },
    };
    const datas = {
      SelectValue:this.state.SelectOperationValue, //??????????????????
      selectedRowKeys:this.state.selectedOperationRowKeys, //?????????????????????
      placeholder:'??????????????????',
      columns : [
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'????????????',
      tableType:'team/fetchTable',
      treeType:'team/newdata',
      treeCode:'DEPT_ID',
      tableLoading:TeamLoading
    }

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>??????</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('code',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }],
              })(<Input placeholder="?????????????????????" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('name',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }]
              })(
                <Input placeholder="?????????????????????" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('deptName',{
                rules: [{
                  required: true,
                  message:'????????????'
                }]
              })(<TreeSelect
                treeDefaultExpandAll
                style={{ width: '100%' }}
                onFocus={this.onFocusDepartment}
                onChange={this.onChangDepartment}
                placeholder="???????????????"
              >
                {this.renderTreeNodes(this.state.deptTreeValue)}
              </TreeSelect >)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="?????????">
              {getFieldDecorator('teamLeaderName',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }],
              })(<SelectModelTable
                on={ons}
                data={datas}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('status', {
              })(<Input placeholder={"???????????????"}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder={'???????????????'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default TeamAdd;

