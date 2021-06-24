import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
} from 'antd';
import env from '../../../../config/env';

@connect(({ QI, loading }) => ({
  QI,
  loading: loading.models.QI,
}))
@Form.create()
class DetailLook extends PureComponent {
  state = {};

  handleCancel = (onCancel) => {
    onCancel();
  };

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data,
    } = this.props;
    const { visible, record } = data;
    const { onCancel } = on;

    console.log('record--', record);
    const baseUrl = '/wookong';
    return (
      <Modal
        title="查看"
        destroyOnClose
        centered
        visible={visible}
        width={'76%'}
        onCancel={() => this.handleCancel(onCancel)}
        footer={null}>
        <div style={{textAlign:'center'}}>
          <img
            src={`${env}/createProcessFlowChart?processInstanceId=${record.processId}`}
            alt=""
            style={{
              width: '100%'
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default DetailLook;
