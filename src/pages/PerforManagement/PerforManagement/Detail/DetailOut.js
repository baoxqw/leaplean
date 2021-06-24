/*退出详情*/
import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Form, Col, Row, DatePicker, Input, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
const FormItem = Form.Item;

const { TextArea } = Input;

const fieldLabels = {
  name: '基金名称',
  date: '退出时间',
  tag: 'TAG',
  partner: '主要合伙人',
  original: '原始投资额',
  conversion: '换算率',
  amount: '原始投资金额',
  count: '项目币数量',
  outcount: '当次项目币退出数量',
  actualcount: '项目币实存量',
  outnumber: '退出数字币种',
  outmechanism: '退出机构',
  exchange: '汇率',
  outamount: '退出金额',
  outinterest: '退出获利',
  price: '价格',
  netvalue: '净价值',
  net: '价值',
  superratio: '超额比率',
  superamount: '超额金额',
  carryratio: 'carry lead比率',
  ratioamount: 'carry lead金额',
  descratio: 'carry desc比率',
  carryamount: 'carry desc金额',
  cooperation: '合作超额金额',
  contribution: '收益贡献',
  remarks: '备注',
};
class DetailOut extends PureComponent {
  state = {};

  render() {
    return (
      <PageHeaderWrapper>
        <Card title="新增退出" bordered={false}>
          <Form layout="vertical" >
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  <Input placeholder="基金A" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.date}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.tag}>
                  <Input placeholder="MultiChain" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.partner}>
                  <Input placeholder="合伙人A" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.original}>
                  <Input placeholder="100,000" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.conversion}>
                  <Input placeholder="外部抓取" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.amount}>
                  <Input placeholder="计算得出" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.count}>
                  <Input placeholder="1000" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.outcount}>
                  <Input placeholder="100" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.actualcount}>
                  <Input placeholder="900" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.outnumber}>
                  <Select placeholder="请选择退出数字币种">
                    <Option value="lucy">1</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.outmechanism}>
                  <Select placeholder="请选择退出机构">
                    <Option value="lucy">机构</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.exchange}>
                  <Input placeholder="外部数据" disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.outamount}>
                  <Input placeholder="计算得出" />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.outinterest}>
                  <Input placeholder="计算得出" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.price}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.netvalue}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.netvalue}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.superratio}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.superamount}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.carryratio}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.ratioamount}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.descratio}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.carryamount}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.cooperation}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.contribution}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={16} md={16} sm={24}>
                <Form.Item label={fieldLabels.remarks}>
                  <TextArea rows={3} placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar>
          <Button>取消</Button>
          <Button type="primary">提交</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default DetailOut;
