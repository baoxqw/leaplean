import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment'
import router from 'umi/router';

import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Select,
  Divider,
  Tree,
  TimePicker,
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import storage from '@/utils/storage'
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;
@connect(({ calendar, loading }) => ({
  calendar,
  loading: loading.models.calendar,
}))
@Form.create()
class NewRule extends PureComponent {
  state = {
    startValue: null,
    valueList:[
      {
      key:0,
      id:1,
      name:'001工作日历规则'
      },
      {
        key:1,
        id:2,
        name:'002工作日历规则'
      },
    ],
  }


  componentDidMount(){

  }

  onChange = value => {

  };
  backClick =()=>{
    router.push('/platform/basicdata/calendar/list')
  }
  validate = ()=>{
    const { dispatch,form} = this.props;
    form.validateFields((err, fieldsValue) => {
      const obj = {
        reqData:{
          ...fieldsValue,
          sunday:fieldsValue['sunday']?'1':'0',
          saturday:fieldsValue['saturday']?'1':'0',
          monday:fieldsValue['monday']?'1':'0',
          tuesday:fieldsValue['tuesday']?'1':'0',
          wednesday:fieldsValue['wednesday']?'1':'0',
          thursday:fieldsValue['thursday']?'1':'0',
          friday:fieldsValue['friday']?'1':'0',
          ondutytime:fieldsValue.ondutytime?fieldsValue.ondutytime.format('h:mm:ss'):'',
          offdutytime:fieldsValue.offdutytime?fieldsValue.offdutytime.format('h:mm:ss'):'',
        }
      }
      dispatch({
        type:'calendar/ruleadd',
        payload:obj,
        callback:(res)=>{
          if(res.errCode == '0'){
            message.success('新建成功',1,()=>{
              router.push('/platform/basicdata/calendar/list');
            })
          }else{
            message.error('新建失败',1,()=>{
              router.push('/platform/basicdata/calendar/list');
            })
          }

        }

      })
    })
  }
  onSelect = (selectedKeys, info) => {

    const { dispatch} = this.props;
    if(info.selectedNodes[0]){
      this.setState({
        id:info.selectedNodes[0].props.dataRef.id,
        title:info.selectedNodes[0].props.title,

        addState:true
      })
      const obj = {
        pageIndex:0,
        pageSize:10,
        id:info.selectedNodes[0].props.dataRef.id
      }
      dispatch({
        type:'businessadmin/fetch',
        payload:obj
      })
    }else{
      const objtt = {
        pageIndex:0,
        pageSize:10,
      }
      dispatch({
        type:'businessadmin/fetch',
        payload:objtt
      })
      this.setState({
        id:null,
        addState:false
      })

    }

  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });
  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loading
    } = this.props;
    const { startValue } = this.state
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div style={{borderBottom:'1px solid #f5f5f5',marginTop:'12px'}}></div>
            <div >
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>
          </Card>
          <Card title="新增工作日历规则" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="工作日历规则编码">
                  {getFieldDecorator('code',{
                    rules: [{required: true,message:'工作日历规则编码'}],
                  })(<Input placeholder="请输入工作日历规则编码" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="工作日历规则名称">
                  {getFieldDecorator('name',{
                    rules: [{required: true}],
                  })(<Input placeholder="工作日历规则名称" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="上班时间">
                  {getFieldDecorator('ondutytime',{
                    rules: [{required: true}],
                  })(
                    <TimePicker use24Hours format="h:mm:ss" onChange={this.onChange}  style={{width:'100%'}}/>,
                  )}
                </Form.Item>

              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="下班时间">
                  {getFieldDecorator('offdutytime', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<TimePicker use24Hours format="h:mm:ss" style={{width:'100%'}}/>,)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                  })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">公休日设置</Divider>
            <Row gutter={16} style={{display:'flex',padding:'0 20px'}}>
              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('sunday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周日</Checkbox>)}
              </Form.Item>

              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('monday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周一</Checkbox>)}
              </Form.Item>

              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('tuesday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周二</Checkbox>)}
              </Form.Item>

              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('wednesday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周三</Checkbox>)}
              </Form.Item>
            </Row>
            <Row gutter={16} style={{display:'flex',padding:'0 20px'}}>
              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('thursday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周四</Checkbox>)}
              </Form.Item>

              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('friday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周五</Checkbox>)}
              </Form.Item>

              <Form.Item style={{width:'25%'}}>
                {getFieldDecorator('saturday',{
                  valuePropName: 'checked',
                  initialValue: false,
                })(<Checkbox >周六</Checkbox>)}
              </Form.Item>
            </Row>
            <FooterToolbar >
              {/* {this.getErrorInfo()} */}
              <Button
                onClick={this.backClick}
              >
                取消
              </Button>
              <Button type="primary" onClick={()=>this.validate()} loading={loading}>
                提交
              </Button>

            </FooterToolbar>
          </Card>
        </div>


      </PageHeaderWrapper>
    );
  }
}

export default NewRule;
;
