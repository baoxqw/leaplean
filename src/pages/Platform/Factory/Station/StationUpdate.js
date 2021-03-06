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
          title: '????????????',
          dataIndex: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
        },
        {
          title: '?????????',
          dataIndex: 'psnName',
        },
        {
          title: '???????????????',
          dataIndex: 'productionlineName',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title: '??????',
      placeholder: '???????????????',
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
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>??????</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '?????????????????????'
                }],
                initialValue: initData.code ? initData.code : ''
              })(<Input placeholder="?????????????????????" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????'
                  }
                ],
                initialValue: initData.name ? initData.name : ''
              })(
                <Input placeholder="?????????????????????" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('productionregionId', {
                rules: [{
                  required: true,
                  message: '???????????????'

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
            <Form.Item label="??????">
              {getFieldDecorator('memo', {
                initialValue: initData.memo ? initData.memo : ''
              })(<TextArea rows={3} placeholder={'???????????????'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default StationUpdate;

