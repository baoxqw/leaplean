import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  TextArea,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import storage from '@/utils/storage'

class PlanLeading extends PureComponent {
  state = {

  }


  componentDidMount(){

  }

  render() {
    const {

    } = this.props;

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              <div
              style={{width:0,height:0,
                borderStyle:'solid',
                borderColor:'transparent #000 transparent transparent',
                transform:'rotate(45deg)',
                borderWidth:'10px',
                // border:'10px solid #ccc #fff #ccc #ccc #ccc'
              }}
              ></div>
            </div>
          </Card>

        </div>
      </PageHeaderWrapper>
    );
  }
}

export default PlanLeading;
;
