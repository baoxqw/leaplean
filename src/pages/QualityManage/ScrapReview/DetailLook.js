import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
} from 'antd';
import env from '../../../../config/env';

@connect(({ Sreview, loading }) => ({
  Sreview,
  loading: loading.models.Sreview,
}))
@Form.create()
class DetailLook extends PureComponent {
  state = {};

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
