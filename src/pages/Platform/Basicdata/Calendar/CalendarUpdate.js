import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Checkbox ,
  Button,
  Card,
  message,
  Tree,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ calendar,loading }) => ({
  calendar,
  loading:loading.models.calendar
}))
@Form.create()
class CalendarUpdate extends PureComponent {
  state = {
    initData:{},
    dataTree:[],
    holidayclId:null,
  };

  componentDidMount(){

  }

  backClick =()=>{
    router.push('/platform/factory/area/list')
  }

  validate = ()=>{
    const { form,dispatch } = this.props;
    const { holidayclId } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        code:values.code,
        name:values.name,
        holidayyear:values.holidayyear,
        yearstartdate:values.yearstartdate?values.yearstartdate.format('YYYY-MM-DD'):null,
        begindate:values.begindate?values.begindate.format('YYYY-MM-DD'):null,
        enddate:values.enddate?values.enddate.format('YYYY-MM-DD'):null,
        isdefaultcalendar:values.isdefaultcalendar?1:0,
        enablestate:values.enablestate,
        holidayclId,
        workcalendruleId:values.workcalendruleName?Number(values.workcalendruleName):null,
        ffirstweekday:values.ffirstweekday
      };
      dispatch({
        type:'calendar/calendarAdd',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            /*message.success("添加成功",1,()=>{
              router.push("/platform/basicdata/calendar/list")
            })*/
          }
        }
      })
    })
  }

  onChange = (e)=>{
    this.setState({
      initData:{
        ...this.state.initData,
        defaultFlag:e.target.checked
      }
    })
  };

  onFocusTree = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            dataTree:a
          })
        }
      }
    })
  };

  onSelectTree = (value,key)=>{
    this.setState({
      holidayclId:Number(value)
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      calendar:{},
      loading,
      dispatch
    } = this.props;

    const { dataTree } = this.state;
    const option = dataTree.map((item)=>{
      return <Option key={item.id} >
        {item.name}
      </Option>
    });
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="工作日历">
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="日历编号">
                {getFieldDecorator('code',{
                  rules: [{required: true,message:'请输入日历编号'}]
                })(<Input placeholder="请输入日历编号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="日历名称">
                {getFieldDecorator('name',{
                  rules: [
                    {
                      required: true,
                      message:'请输入日历名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入日历名称" />
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="假日年度">
                {getFieldDecorator('holidayyear',{
                  rules: [
                    {
                      required: true,
                      message:'请输入假日年度'
                    }
                  ]
                })(
                  <Input placeholder="请输入假日年度" />
                )}
              </Form.Item>
              {/*<Form.Item label="负责人">
                {getFieldDecorator('psnId',{
                  rules: [{required: true}],
                  initialValue: 1
                })(<TreeTable
                  on={on}
                  data={datas}
                />)}
              </Form.Item>*/}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作日历年度起始日">
                {getFieldDecorator('yearstartdate',{
                  rules: [
                    {
                      required: true,
                      message:'工作日历年度起始日'
                    }
                  ]
                })(
                  <DatePicker style={{width:'100%'}} placeholder={'请输入工作日历年度起始日'}/>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="起始日">
                {getFieldDecorator('begindate',{
                  rules: [
                    {
                      required: true,
                      message:'请输入起始日'
                    }
                  ]
                })(
                  <DatePicker style={{width:'100%'}} placeholder={'请输入起始日'}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="结束日">
                {getFieldDecorator('enddate',{
                  rules: [
                    {
                      required: true,
                      message:'请输入结束日'
                    }
                  ]
                })(
                  <DatePicker style={{width:'100%'}} placeholder={'请输入结束日'}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否默认版本">
                {getFieldDecorator('isdefaultcalendar',{
                  valuePropName: 'checked'
                })(
                  <Checkbox />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="启用状态">
                {getFieldDecorator('enablestate',{
                  rules: [
                    {
                      required: true,
                      message:'请选择启用状态'
                    }
                  ]
                })(
                  <Select style={{width:'100%'}} placeholder={'请选择启用状态'}>
                    <Option value={1}>未启用</Option>
                    <Option value={2}>已启用</Option>
                    <Option value={3}>已停用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="假期类别">
                {getFieldDecorator('holidayclName',{
                  rules: [
                    {
                      required: true,
                      message:'请选择假期类别'
                    }
                  ]
                })(
                  <Select
                    style={{width:'100%'}}
                    placeholder={'请选择假期类型'}
                    onFocus={this.onFocusTree}
                    onSelect={this.onSelectTree}
                  >
                    {option}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="日历规则">
                {getFieldDecorator('workcalendruleName',{
                  rules: [
                    {
                      required: true,
                      message:'请输入日历规则'
                    }
                  ]
                })(
                  <Input  placeholder={'请输入日历规则'}/>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="每周起始日">
                {getFieldDecorator('ffirstweekday',{
                  rules: [
                    {
                      required: true,
                      message:'请选择每周起始日'
                    }
                  ]
                })(
                  <Select style={{width:'100%'}} placeholder={'请选择每周起始日'}>
                    <Option value={1}>日</Option>
                    <Option value={2}>一</Option>
                    <Option value={3}>二</Option>
                    <Option value={4}>三</Option>
                    <Option value={5}>四</Option>
                    <Option value={6}>五</Option>
                    <Option value={7}>六</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
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
      </PageHeaderWrapper>
    );
  }
}

export default CalendarUpdate;

