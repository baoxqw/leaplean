import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Checkbox, Button,
} from 'antd';
import TableModelTable from '@/pages/tool/TableModelTable';
const { TextArea } = Input;
const { Option } = Select;
@connect(({ protype, loading }) => ({
  protype,
  loading: loading.models.protype,
  WorkLoading: loading.effects['protype/fetchWork'],
  AreaLoading:loading.effects['protype/fetchArea'],
  StationLoading:loading.effects['protype/fetchStation'],
}))
@Form.create()
class ProcessTypeAdd extends PureComponent {
  state = {
    SelectWorkValue: [],
    selectedWorkRowKeys: [],

    SelectAreaValue: [],
    selectedAreaRowKeys: [],

    SelectStationValue: [],
    selectedStationRowKeys: [],

    BStatus:false
  };

  handleOk = (onSave) => {
    const { form } = this.props;
    const { selectedAreaRowKeys, selectedWorkRowKeys, selectedStationRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const obj = {
        ...fieldsValue,
        disassemblytime: fieldsValue['disassemblytime'] ? Number(fieldsValue['disassemblytime']) : '',
        productiontime: fieldsValue['productiontime'] ? Number(fieldsValue['productiontime']) : '',
        setuptime: fieldsValue['setuptime'] ? Number(fieldsValue['setuptime']) : '',
        waitingtime: fieldsValue['waitingtime'] ? Number(fieldsValue['waitingtime']) : '',
        transfertime: fieldsValue['transfertime'] ? Number(fieldsValue['transfertime']) : '',
        checkFlag: fieldsValue['checkFlag'] ? 1 : 0,
        handoverFlag: fieldsValue['handoverFlag'] ? 1 : 0,
        backflushFlag: fieldsValue['backflushFlag'] ? 1 : 0,
        countFlag: fieldsValue['countFlag'] ? 1 : 0,
        parallelFlag: fieldsValue['parallelFlag'] ? 1 : 0,
        activeFlag: fieldsValue['activeFlag'] ? 1 : 0,
        laborutilization: fieldsValue['laborutilization'] ? Number(fieldsValue['laborutilization']) : '',
        machineutilization: fieldsValue['machineutilization'] ? Number(fieldsValue['machineutilization']) : '',
        productioninonecycle: fieldsValue['productioninonecycle'] ? Number(fieldsValue['productioninonecycle']) : '',
        assignedtooperation: fieldsValue.assignedtooperation,
        divisionId: selectedAreaRowKeys.length ? selectedAreaRowKeys[0] : null,
        productionlineId: selectedWorkRowKeys.length ? selectedWorkRowKeys[0] : null,
        workstationtypeId: selectedStationRowKeys.length ? selectedStationRowKeys[0] : null,
      };
      this.setState({
        BStatus:true
      })
      if (typeof onSave === 'function') {
        onSave(obj, this.clear);
      }
    })
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear)
    }
  };

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
      SelectWorkValue: [],
      selectedWorkRowKeys: [],

      SelectAreaValue: [],
      selectedAreaRowKeys: [],

      SelectStationValue: [],
      selectedStationRowKeys: [],

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      WorkLoading,
      AreaLoading,
      StationLoading,
      data,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onOk, onCancel } = on;

    const onWorkData = {
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      columns: [
        {
          title: '生产线编号',
          dataIndex: 'code',
        },
        {
          title: '生产线名称',
          dataIndex: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title: '生产线',
      placeholder: '请选择生产线',
      tableType: 'protype/fetchWork',
      tableLoading:WorkLoading
    };
    const onWordOn = {
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

    const onAreaData = {
      SelectValue: this.state.SelectAreaValue,
      selectedRowKeys: this.state.selectedAreaRowKeys,
      columns: [
        {
          title: '区域编号',
          dataIndex: 'code',
        },
        {
          title: '区域名称',
          dataIndex: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title: '区域',
      placeholder: '请选择区域',
      tableType: 'protype/fetchArea',
      tableLoading:AreaLoading
    };
    const onAreaOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectAreaValue: nameList,
          selectedAreaRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectAreaValue: [],
          selectedAreaRowKeys: [],
        })
      },
    };

    const onStationData = {
      SelectValue: this.state.SelectStationValue,
      selectedRowKeys: this.state.selectedStationRowKeys,
      columns: [
        {
          title: '工作单元类型编号',
          dataIndex: 'code',
        },
        {
          title: '工作单元类型名称',
          dataIndex: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title: '工作单元类型',
      placeholder: '请选择工作单元类型',
      tableType: 'protype/fetchStation',
      tableLoading:StationLoading
    };
    const onStationOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectStationValue: nameList,
          selectedStationRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectStationValue: '',
          selectedStationRowKeys: [],
        })
      },
    };

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工序编码">
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '工序编码' }]
                })(<Input placeholder="请输入工序编码" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工序名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '工序名称' }],
                })(
                  <Input placeholder="请输入工序名称" />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="生产线">
                {getFieldDecorator('productionlineName', {
                  rules: [{ required: true, message: '请选择生产线' }]
                })(<TableModelTable
                  data={onWorkData}
                  on={onWordOn}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作站类型">
                {getFieldDecorator('assignedtooperation', {
                  rules: [{
                    required: true,
                    message: '请选择工作站类型'
                  }],
                })(<Select style={{ width: '100%' }} placeholder="请选择工作中心">
                  <Option value={0}>DIVISION_ID</Option>
                  <Option value={1}>PRODUCTIONLINE</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="时间单位">
                {getFieldDecorator('timetype', {
                  rules: [
                    {
                      required: true,
                      message: '请选择时间单位'
                    }
                  ]
                })(<Select style={{ width: '100%' }} placeholder="请选择时间单位">
                  <Option value="时">时</Option>
                  <Option value="分">分</Option>
                  <Option value="秒">秒</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作站">
                {getFieldDecorator('workstationtypeName', {
                  rules: [{ required: true, message: '请选择工作站' }],
                })(<TableModelTable
                  data={onStationData}
                  on={onStationOn}
                />)}
              </Form.Item>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="准备时间">
                {getFieldDecorator('setuptime', {
                })(<Input placeholder="请输入准备时间" type='number' />)}
              </Form.Item>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="拆卸时间">
                {getFieldDecorator('disassemblytime', {
                })(<Input placeholder="请输入拆卸时间" type='number' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="区域">
                {getFieldDecorator('divisionName', {
                  rules: [{ required: true, message: '请选择区域' }],
                })(<TableModelTable
                  data={onAreaData}
                  on={onAreaOn}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="加工时间">
                {getFieldDecorator('productiontime', {
                })(<Input placeholder="请输入加工时间" type='number' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="等待时间">
                {getFieldDecorator('waitingtime', {
                })(<Input placeholder="请输入等待时间" type='number' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="传送时间">
                {getFieldDecorator('transfertime', {
                })(<Input placeholder="请输入传送时间" type='number' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作站数量">
                {getFieldDecorator('quantityofworkstations', {
                })(<Input placeholder="请输入工作站数量" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="机器利用率">
                {getFieldDecorator('machineutilization', {
                })(<Input placeholder="请输入工作站数量" type='nubmer' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="人工利用率">
                {getFieldDecorator('laborutilization', {
                })(<Input placeholder="请输入人工利用率" type='nubmer' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="单位周期生产数量">
                {getFieldDecorator('productioninonecycle', {
                })(<Input placeholder="请输入单位周期生产数量" type='number' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="首检类型">
                {getFieldDecorator('checktype', {
                })(<Select style={{ width: '100%' }} placeholder="请选择首检方式">
                  <Option value="首检类型1">首检方式1</Option>
                  <Option value="首检类型2">首检方式2</Option>
                  <Option value="首检类型3">首检方式3</Option>
                </Select>)}
              </Form.Item>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否激活">
                {getFieldDecorator('activeFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否检验点">
                {getFieldDecorator('checkFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否倒冲">
                {getFieldDecorator('backflushFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否并行工序">
                {getFieldDecorator('parallelFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否交接点">
                {getFieldDecorator('handoverFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否计数点">
                {getFieldDecorator('countFlag', {
                })(<Checkbox />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="工序描述">
                {getFieldDecorator('description', {

                })(<TextArea rows={3} placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}


export default ProcessTypeAdd;

