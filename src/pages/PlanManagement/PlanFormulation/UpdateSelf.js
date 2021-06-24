import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Checkbox,
  Select, Button,
} from 'antd';
import momentt from 'moment'
import SelectModelTable from '@/pages/tool/SelectModelTable';
import TableModelTable from '@/pages/tool/TableModelTable';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ workplan, loading }) => ({
  workplan,
  tableLoading: loading.effects['pfor/fetchMata'],
  workLoading: loading.effects['pfor/fetchWork'],
  codeLoading: loading.effects['pfor/fetcCode'],
}))
@Form.create()
class UpdateSelf extends PureComponent {
  state = {
    TreeWorkorderData: [], //存储左边树的数据
    WorkorderConditions: [], //存储查询条件
    workorder_id: null, //存储工作令左边数点击时的id  分页时使用
    TableWorkorderData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectWorkorderValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedWorkorderRowKeys: [], //工作令  存储右表选中时的挣个对象  可以拿到id
    pageWorkorder: null,
    record: {},
    SelectCodeValue: [],
    selectedCodeRowKeys: [],
    TableCodeData:[],
    CodeConditions: [],
    TableWorkData: [],//项目阶段
    SelectWorkValue: [],
    selectedWorkRowKeys: [],
    WorkConditions: [],
    startValue: null,
    endValue: null,
    endOpen: false,
    startValueAssign: null,
    endValueAssign: null,
    endOpenAssign: false,
    planStartTime:null,
    assignStartTime:null,
    planEndTime:null,
    endTimeShow:true,
    assignTimeShow:true,

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;
     console.log('===--',record)
      this.setState({
        record,
        selectedWorkorderRowKeys: [record.workId],
        SelectWorkorderValue: record.workName,
        selectedWorkRowKeys: [record.stageProjectId],
        SelectWorkValue: record.stageProjectName,
        selectedCodeRowKeys: [record.productNoticeId],
        SelectCodeValue: record.productNoticeCode,
        startValue: record.planStartDate ? record.planStartDate : null,
        endValue: record.planEndDate ? record.planEndDate : null,

      })
    }
  }

  handleOk = (onOk) => {
    const { form, data } = this.props;
    const { serialUpdate } = data;
    const { selectedWorkorderRowKeys, record,selectedCodeRowKeys, selectedWorkRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let obj = {
        reqData: {
          ...values,
          id: record.id,
          stageProjectId: selectedWorkRowKeys ? selectedWorkRowKeys[0] : null,
          workId: selectedWorkorderRowKeys ? selectedWorkorderRowKeys[0] : null,
          productNoticeId: selectedCodeRowKeys ? selectedCodeRowKeys[0] : null,
          releaseId: record.id,
          serialNumber: serialUpdate,
          isOver: values.isOver ? 1 : 0,
          planStartDate: values.startValue ? values.startValue.format('YYYY-MM-DD') : null,
          planEndDate: values.endValue ? values.endValue.format('YYYY-MM-DD') : null,
          releaseDate: values.planEndDate ? values.planEndDate.format('YYYY-MM-DD') : null,
          finishedDate: values.finishedDate ? values.finishedDate.format('YYYY-MM-DD') : null,
        }
      }
      this.setState({
        BStatus:true
      })
      onOk(obj, this.clear)
    })
  }

  handleCancel = (onCancel) => {
    onCancel(this.clear)
  }

  clear = (status) => {
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      TreeWorkorderData: [], //存储左边树的数据
      WorkorderConditions: [], //存储查询条件
      workorder_id: null, //存储工作令左边数点击时的id  分页时使用
      TableWorkorderData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectWorkorderValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedWorkorderRowKeys: [], //工作令  存储右表选中时的挣个对象  可以拿到id
      pageWorkorder: null,
      SelectCodeValue: [],
      selectedCodeRowKeys: [],
      TableCodeData:[],
      CodeConditions: [],
      TableWorkData: [],//项目阶段
      SelectWorkValue: [],
      selectedWorkRowKeys: [],
      WorkConditions: [],

      record: {},

      BStatus:false
    })
  }

  //工期开始计划
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  onChangeAssign = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onEndChangeAssign = value => {
    this.onChangeAssign('endValueAssign', value);
  };


  render() {
    const {
      form: { getFieldDecorator },
      on,
      data,
      tableLoading,
      codeLoading,
      workLoading
    } = this.props;
    const { endOpen } = this.state;
    const { visible, editableUpdate,loading } = data;
    const { onOk, onCancel } = on;

    const { record, SelectWorkorderValue, SelectWorkValue,SelectCodeValue } = this.state;

    const ons = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectWorkorderValue: nameList,
          selectedWorkorderRowKeys: selectedRowKeys,
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectWorkorderValue: [],
          selectedWorkorderRowKeys: [],
        })
      },

    };
    const datas = {
      SelectValue: this.state.SelectWorkorderValue, //框选中的集合
      selectedRowKeys: this.state.selectedWorkorderRowKeys, //右表选中的数据
      placeholder: '请选择工作令',
      columns: [
        {
          title: '工作令编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '工作令名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '型号类部件号',
          dataIndex: 'modelNumber',
          key: 'modelNumber',
        },
        {
          title: '经费来源',
          dataIndex: 'sourceOfFunding',
          key: 'sourceOfFunding',
        },
        {
          title: '开始时间',
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title: '终止时间',
          dataIndex: 'endDate',
          key: 'endDate',
        },
        {
          title: '停止标志',
          dataIndex: 'stopSign',
          key: 'stopSign',
        },
        {
          title: '申请人',
          dataIndex: 'applicantName',
          key: 'applicantName',
        },
        {
          title: '申请部门',
          dataIndex: 'deptName',
          key: 'deptName',
        },
        {
          title: '延期使用日期',
          dataIndex: 'extension',
          key: 'extension',
        },
        {
          title: '单据状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '工作令描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '研制状态',
          dataIndex: 'developmentName',
          key: 'developmentName',
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '工作令选择',
      treeType:'pfor/findtree',
      tableType:'pfor/fetchMata',
      treeCode:'invclId',
      tableLoading:tableLoading
    }

    const onWorkData = {
      TableData: this.state.TableWorkData,
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      columns: [
        {
          title: '项目阶段编码',
          dataIndex: 'code',
          sort: 0
        },
        {
          title: '项目阶段名称',
          dataIndex: 'name',
          sort: 1,
        },
        {
          title: '创建人',
          dataIndex: 'userName',
          sort: 2,
        },
        {
          title: '创建时间',
          dataIndex: 'creatTime',
          sort: 3,
        },

        {
          title: '备注',
          dataIndex: 'memo',
          sort: 9,
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '项目阶段',
      placeholder: '请选择项目阶段',
      tableType:'pfor/fetchWork',
      tableLoading:workLoading
    };
    const onWorkOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue: nameList,
          selectedWorkRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectWorkValue: [],
          selectedWorkRowKeys: [],
        })
      },
    };

    const onCodeData = {
      TableData: this.state.TableCodeData,
      SelectValue: this.state.SelectCodeValue,
      selectedRowKeys: this.state.selectedCodeRowKeys,
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
        },
        {
          title: '工作令',
          dataIndex: 'workOrderName',
        },
        {
          title: '订货单位',
          dataIndex: 'orderUnit',
        },
        {
          title: '所属行业',
          dataIndex: 'industry',
        },
        {
          title: '产品',
          dataIndex: 'materialName',
        },
        {
          title: '订货数量',
          dataIndex: 'num',
        },
        {
          title: '技术状态',
          dataIndex: 'tech',
        },
        {
          title: '交付时间',
          dataIndex: 'dueTime',
        },
        {
          title: '军种',
          dataIndex: 'militaryType',
        },
        {
          title: '是否军检',
          dataIndex: 'militaryCensor',
          render:((text,record)=>{
            return <Checkbox checked={text}/>
          })
        },
        {
          title: '审核人',
          dataIndex: 'reviewName',
        },
        {
          title: '制表人',
          dataIndex: 'watchName',
        },
        {
          title: '是否准批',
          dataIndex: 'isApproval',
          render:((text,record)=>{
            return <Checkbox checked={text}/>
          })
        },
        {
          title: '单据日期',
          dataIndex: 'receiptTime',
        },
        {
          title: '制表组',
          dataIndex: 'watchGroup',
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '投产通知单',
      placeholder: '请选择来源单据号',
      tableType:'pfor/fetchCode',
      tableLoading:codeLoading
    };
    const onCodeOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          console.log('selectedRows',selectedRows)
          return item.code
        });
        onChange(nameList)
        this.setState({
          SelectCodeValue: nameList,
          selectedCodeRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectCodeValue: [],
          selectedCodeRowKeys: [],
        })
      },
    };
    return (
      <Modal
        title="编辑"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onOk={() => this.handleOk(onOk)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划编码'>
                {getFieldDecorator('code', {
                  initialValue: record ? record.code : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入计划编码'
                    }
                  ],
                })(<Input placeholder='请输入计划编码' disabled={!editableUpdate} />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划名称'>
                {getFieldDecorator('name', {
                  initialValue: record ? record.name : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入计划名称'
                    }
                  ],
                })(<Input placeholder='请输入计划名称' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='状态'>
                {getFieldDecorator('status', {
                  initialValue: record ? record.status : '',
                })(<Input placeholder='请输入状态' disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作令'>
                {getFieldDecorator('workId', {
                  initialValue: SelectWorkorderValue,
                })(<SelectModelTable
                  on={ons}
                  data={datas}
                />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='下达人'>
                {getFieldDecorator('releaseId', {
                  initialValue: record ? record.releaseName : '',
                })(<Input placeholder='请输入下达人' disabled />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否完成'>
                {getFieldDecorator('isOver', {
                  valuePropName: "checked",
                  initialValue: record.isOver,
                })(<Checkbox />)}
              </FormItem>

            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划开始日期'>
                {getFieldDecorator('startValue', {
                  initialValue: this.state.startValue ? momentt(this.state.startValue) : null,
                })(<DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  //value={startValue}
                  style={{ width: '100%' }}
                  placeholder="请选择项目工期计划"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />)}
              </FormItem>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划完成日期'>
                {getFieldDecorator('endValue', {
                   initialValue: this.state.endValue ? momentt(this.state.endValue) : null,
                })(<DatePicker
                  disabledDate={this.disabledEndDate}
                  format="YYYY-MM-DD"
                  //value={endValue}
                  placeholder="请选择项目工期计划"
                  onChange={this.onEndChange}
                  open={endOpen}
                  style={{ width: '100%' }}
                  onOpenChange={this.handleEndOpenChange}
                />)}
              </FormItem>


            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='下达日期'>
                {getFieldDecorator('releaseDate', {
                  initialValue: record.releaseDate ? momentt(record.releaseDate) : null,
                })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实际完工时间'>
                {getFieldDecorator('finishedDate', {
                  initialValue: record.finishedDate ? momentt(record.finishedDate) : null,
                })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label="项目阶段">
                {getFieldDecorator('stageProjectId', {
                  initialValue: SelectWorkValue,
                })(<TableModelTable
                  on={onWorkOn}
                  data={onWorkData}
                />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='来源单据号'>
                {getFieldDecorator('productNoticeId', {
                  initialValue: SelectCodeValue,
                })(<TableModelTable
                  on={onCodeOn}
                  data={onCodeData}
                />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo', {
                  initialValue: record.memo ? record.memo : '',
                })(<TextArea rows={3} placeholder='请输入意见' />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default UpdateSelf;
