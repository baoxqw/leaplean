import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Checkbox,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ testduty, loading }) => ({
  testduty,
  loading: loading.models.testduty,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class UpdateProject extends PureComponent {
  state = {
    initData:{},
    fileList:[],
    deleteFile:[],
    TableWorkData:[],//计量单位
    SelectWorkValue:[],
    selectedWorkRowKeys:[],
    WorkConditions:[],
  };

  componentWillReceiveProps(nextProps){
    const { dispatch } = this.props;
    if(nextProps.data.record.id !== this.props.data.record.id){
      const { id } = nextProps.data.record;
      const initData = nextProps.data.record
     
      //附件
      dispatch({
        type:'testduty/fetchList',
        payload:{
          reqData:{
            bill_id:id,
            type:'checkitem'
          }
        },
        callback:(res)=>{
          this.setState({
            fileList:res
          })
        }
      });
      this.setState({
        initData:nextProps.data.record,
        selectedWorkRowKeys:[initData.unit],
        SelectWorkValue:initData.unitName,
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { selectedWorkRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const { initData,deleteFile} = this.state;
      const obj = {
        ...values,
        id:initData.id,
        inspectionSampleId:initData.inspectionSampleId,
        number:values.number?Number(values.number):null,
        projectId:values.projectId?Number(values.projectId):null,
        identifier:values.identifier?values.identifier:'',
        claim:values.claim?values.claim:'',
        claimValue:values.claimValue?Number(values.claimValue):null,
        unit:selectedWorkRowKeys.length?selectedWorkRowKeys[0]:null,
        cap:values.cap?Number(values.cap):null,
        lower:values.lower?Number(values.lower):null,
        tool:values.tool?values.tool:'',
        measuredCap:values.measuredCap?Number(values.measuredCap):null,
        measuredLower:values.measuredLower?Number(values.measuredLower):null,
        description:values.description?values.description:'',
        device:values.device?Number(values.device):null,
        isSingleQual:values.isSingleQual?1:0,
      }
      onOk(obj,this.clear,deleteFile)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = ()=> {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;
    const { initData,fileList } = this.state;

    const onWorkData = {
      TableData:this.state.TableWorkData,
      SelectValue:this.state.SelectWorkValue,
      selectedRowKeys:this.state.selectedWorkRowKeys,
      columns : [
        {
          title: '编码',
          dataIndex: 'code',
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '所属量纲',
          dataIndex: 'dimension',
        },
        {
          title: '是否基本计量单位',
          dataIndex: 'basecodeflag',
          render:(text,record)=>{
            return <Checkbox checked={text}/>
          }
        },
        {
          title: '换算率（与量纲基本单位）',
          dataIndex: 'conversionrate',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'编码',code:'code',placeholder:'请输入编码'},
        {label:'名称',code:'name',placeholder:'请输入名称'},
      ],
      title:'计量单位',
      placeholder:'请选择计量单位',
    };
    const onWordOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'testduty/fetchWork',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableWorkData:res,
              })
            }
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue:nameList,
          selectedWorkRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { WorkConditions } = this.state;
        const param = {
          ...obj
        };
        if(WorkConditions.length){
          dispatch({
            type:'testduty/fetchWork',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'testduty/fetchWork',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { code, name } = values;
        if(code || name){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            WorkConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'testduty/fetchWork',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }else{
          this.setState({
            WorkConditions:[],
          });
          dispatch({
            type:'testduty/fetchWork',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          WorkConditions:[]
        });
        dispatch({
          type:'testduty/fetchWork',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectWorkValue:[],
          selectedWorkRowKeys:[],
        })
      }
    };

    const props = {
      onRemove: file => {
        if(file.id){
          this.setState({
            deleteFile:[...this.state.deleteFile,file]
          })
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      showUploadList: {
        showDownloadIcon: false,
        downloadIcon: 'download ',
      },
      fileList,
    };

    return (
      <Modal
        title="检验项目编辑"
        destroyOnClose
        centered
        visible={visible}
        width={"80%"}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验序号'>
                {getFieldDecorator('number',{
                  initialValue:initData.number?initData.number:'',
                })(<Input placeholder='请输入检验序号'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验项目'>
                {getFieldDecorator('projectId',{
                  initialValue:initData.projectId?initData.projectId:null,
                })(<Input placeholder='请输入检验项目' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='标识'>
                {getFieldDecorator('identifier',{
                  initialValue:initData.identifier?initData.identifier:'',
                })(<Input placeholder='请输入标识' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验要求'>
                {getFieldDecorator('claim',{
                  initialValue:initData.claim?initData.claim:'',
                })(<Input placeholder='请输入检验要求' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='要求值'>
                {getFieldDecorator('claimValue',{
                  initialValue:initData.claimValue?initData.claimValue:null,
                })(<Input placeholder='请输入要求值' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="计量单位">
                {getFieldDecorator('unit', {
                  initialValue:this.state.SelectWorkValue,
                  rules: [
                    {
                      required: true,
                      message:'计量单位'
                    }
                  ],
                })(<ModelTable
                  on={onWordOn}
                  data={onWorkData}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='上限'>
                {getFieldDecorator('cap',{
                  initialValue:initData.cap?initData.cap:null,
                })(<Input placeholder='请输入上限' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='下限'>
                {getFieldDecorator('lower',{
                  initialValue:initData.lower?initData.lower:null,
                })(<Input placeholder='请输入下限' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验设备/工具'>
                {getFieldDecorator('tool',{
                  initialValue:initData.tool?initData.tool:'',
                })(<Input placeholder='请输入检验设备/工具' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实测上限值'>
                {getFieldDecorator('measuredCap',{
                  initialValue:initData.measuredCap?initData.measuredCap:null,
                })(<Input placeholder='请输入实测上限值' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实测下限值'>
                {getFieldDecorator('measuredLower',{
                  initialValue:initData.measuredLower?initData.measuredLower:null,
                })(<Input placeholder='请输入实测上限值' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实测描述'>
                {getFieldDecorator('description',{
                  initialValue:initData.description?initData.description:'',
                })(<Input placeholder='请输入实测描述'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='设备'>
                {getFieldDecorator('device',{
                  initialValue:initData.device?initData.device:null,
                })(<Input placeholder='请输入设备' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='单件是否合格'>
                {getFieldDecorator('isSingleQual',{
                  initialValue:initData.isSingleQual,
                  valuePropName:"checked",
                })(<Checkbox />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="添加附件">
                {getFieldDecorator('annex', {
                })(
                  <Upload {...props}>
                    <Button style={{width:'246px',display:'inline-block'}}>
                      <Icon type="upload" /> 请添加附件
                    </Button>
                  </Upload>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='工艺备注'>
                {getFieldDecorator('memo',{
                  initialValue:initData.memo?initData.memo:'',
                })(<TextArea rows={3} placeholder='请输入备注'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateProject;
