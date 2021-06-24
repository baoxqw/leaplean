import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import axiosApi from "../../../services/axios";
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Popconfirm,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
// import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;




@connect(({ BL, loading }) => ({
  BL,
  loading: loading.models.BL,
}))
@Form.create()
class BusinessLine extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{}
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'BL/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
  }

  //新建模态框
  handleModalVisible = ()=>{
    this.setState({
      addVisible:true
    })
  }
  addHandleOk = ()=>{
    this.setState({
      addVisible:false
    })
  }
  addHandleCancel = ()=>{
    this.setState({
      addVisible:false
    })
  }

  //修改模态框
  updateChange = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateVisible:true,
      updata:record
    })
  }
  updateHandleOk = ()=>{
    this.setState({
      updateVisible:false
    })
  }
  updateHandleCancel = ()=>{
    this.setState({
      updateVisible:false
    })
  }

//查看模态框
  viewChange = ()=>{
    this.setState({
      viewVisible:true
    })
  }
  viewHandleOk = ()=>{
    this.setState({
      viewVisible:false
    })
  }
  viewHandleCancel = ()=>{
    this.setState({
      viewVisible:false
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='业务线名称'>
              {getFieldDecorator('businesslinename')(<Input placeholder='请输入业务线名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='所属部门'>
              {getFieldDecorator('department')(<Input placeholder='请输入所属部门' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      form:{getFieldDecorator},
      BL:{fetchData}
    } = this.props;
    const { updata } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '业务线名称',
        dataIndex: 'businesslinename',
      },
      {
        title: '所属部门',
        dataIndex: 'department',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        render: (text, record) => (
          <Fragment>
            <a href="#javascript;" onClick={(e)=> this.updateChange(e,record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.viewChange(e)}>查看</a>
          </Fragment>
        ),
      },

    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <NormalTable  columns={columns} data={fetchData} />
          </div>
        </Card>

        <Modal
          title="新建业务线维护"
          visible={this.state.addVisible}
          onOk={this.addHandleOk}
          width='50%'
          onCancel={this.addHandleCancel}
        >
          <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='业务线名称'>
                  {getFieldDecorator('businesslinename',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                    initialValue:updata.businesslinename?updata.businesslinename:''
                  })(<Input placeholder='请输入业务线名称' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='负责人'>
                  {getFieldDecorator('principal',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                    initialValue:updata.principal?updata.principal:''
                  })(<Input placeholder='请输入负责人' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='所属部门'>
                  {getFieldDecorator('department',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                    initialValue:updata.department?updata.department:''
                  })(<Input placeholder='请输入所属部门' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='主要成员'>
                  {getFieldDecorator('person',{
                  })(<Select placeholder="请选择主要成员" >
                    <Option value="jack">主要成员1</Option>
                    <Option value="lucy">主要成员2</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='存储基数(元)'>
                  {getFieldDecorator('storagebase',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                    initialValue:updata.storagebase?updata.storagebase:''
                  })(<Input placeholder='请输入存储基数' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                    initialValue:updata.memo?updata.memo:''
                  })(<TextArea rows={3} placeholder={'请输入备注'} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="修改客户信息"
          visible={this.state.updateVisible}
          onOk={this.updateHandleOk}
          width='50%'
          onCancel={this.updateHandleCancel}
        >
          <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='业务线名称'>
                  {getFieldDecorator('businesslinename',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入业务线名称' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='负责人'>
                  {getFieldDecorator('principal',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入负责人' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='所属部门'>
                  {getFieldDecorator('department',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入所属部门' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='主要成员'>
                  {getFieldDecorator('person',{
                  })(<Select placeholder="请选择主要成员" >
                    <Option value="jack">主要成员1</Option>
                    <Option value="lucy">主要成员2</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='存储基数(元)'>
                  {getFieldDecorator('storagebase',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入存储基数' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<TextArea rows={3} placeholder={'请输入备注'} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="查看客户信息"
          visible={this.state.viewVisible}
          width='50%'
          onCancel={this.viewHandleCancel}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='业务线名称'>
                  {getFieldDecorator('businesslinename',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入业务线名称' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='负责人'>
                  {getFieldDecorator('principal',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入负责人' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='所属部门'>
                  {getFieldDecorator('department',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入所属部门' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='主要成员'>
                  {getFieldDecorator('person',{
                  })(<Select placeholder="请选择主要成员" >
                    <Option value="jack">主要成员1</Option>
                    <Option value="lucy">主要成员2</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='存储基数(元)'>
                  {getFieldDecorator('storagebase',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder='请输入存储基数' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<TextArea rows={3} placeholder={'请输入备注'} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BusinessLine;
