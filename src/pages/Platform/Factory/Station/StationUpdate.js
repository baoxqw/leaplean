import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Modal, Button,
} from 'antd';
import TableModelTable from '@/pages/tool/TableModelTable';
const { TextArea } = Input;

@connect(({ station, loading }) => ({
  station,
  loading: loading.models.station,
  WorkLoading: loading.effects['station/fetchArea'],
}))
@Form.create()
class StationUpdate extends PureComponent {
  state = {
    initData: {},
    SelectAreaValue: [],
    selectedAreaRowKeys: [],
    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const initData = nextProps.data.record;
      const productionregionId = initData.productionregionId;
      const productionregionName = initData.productionregionName;

      this.setState({
        initData: nextProps.data.record,
        selectedAreaRowKeys: [productionregionId],
        SelectAreaValue: productionregionName,
      })
    }
  }

  handleOk = (onSave) => {
    const { form } = this.props;
    const { initData, selectedAreaRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      const obj = {
        id: initData.id,
        code: values.code,
        name: values.name,
        productionregionId: selectedAreaRowKeys.length ? selectedAreaRowKeys[0] : null,
        memo: values.memo
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
      initData: {},
      SelectAreaValue: [],
      selectedAreaRowKeys: [],
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      WorkLoading,
      on
    } = this.props;

    const { visible,loading } = data;
    const { onSave, onCancel } = on;

    const { initData } = this.state;


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
          title: '负责人',
          dataIndex: 'psnName',
        },
        {
          title: '生产线名称',
          dataIndex: 'productionlineName',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '区域',
      placeholder: '请选择区域',
      tableType: 'station/fetchArea',
      tableLoading:WorkLoading,
    };
    const onAreaOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
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


    return (
      <Modal
        title={"编辑"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工位编号">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '请选择工位编号'
                }],
                initialValue: initData.code ? initData.code : ''
              })(<Input placeholder="请输入工位编号" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工位名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择工位名称'
                  }
                ],
                initialValue: initData.name ? initData.name : ''
              })(
                <Input placeholder="请输入工位名称" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="区域">
              {getFieldDecorator('productionregionId', {
                rules: [{
                  required: true,
                  message: '请选择区域'

                }],
                initialValue: this.state.SelectAreaValue
              })(<TableModelTable
                on={onAreaOn}
                data={onAreaData}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue: initData.memo ? initData.memo : ''
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default StationUpdate;

