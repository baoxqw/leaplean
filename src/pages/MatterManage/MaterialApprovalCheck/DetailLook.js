import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
} from 'antd';
import env from '../../../../config/env';

@connect(({ loading }) => ({
  loading: loading.models.MAC,
}))
@Form.create()
class DetailLook extends PureComponent {

  render() {
    const {
      data,
    } = this.props;
    const {  record } = data;
    return (
        <div style={{textAlign:'center'}}>
          <img
            src={`${env}/createProcessFlowChart?processInstanceId=${record.processInstanceId}`}
            alt=""
            style={{
              width: '100%'
            }}
          />
        </div>
    );
  }
}

export default DetailLook;
