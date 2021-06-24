import React, { PureComponent, useState } from 'react';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {
  Card,
  Tabs,
  Divider,
  Button,
  Avatar,
  Calendar,
  Badge,
  Pagination,
  Row,
  Col,
  Modal,
  List,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import Context from '@/layouts/MenuContext';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';

const { TabPane } = Tabs;

@connect(({ user, menu }) => ({
  ...user,
  ...menu,
}))
class ManagerCenter extends PureComponent {
  state = {
    // navigations: ['财务审批', '财务审批', '财务审批', '财务审批', '财务审批', '财务审批'],
    navigations: ['财务审批'],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取进行中项目
    dispatch({
      type: 'user/fetchUserDashboard',
    });
    // 获取日程
    this.fetchUserSchedule();
    // 获取消息
    this.fetchTaskMsg();
    this.fetchAfterInvestMsg();
  }

  // 获取投后信息列表
  fetchAfterInvestMsg = (pageIndex = 0) => {
    const { dispatch } = this.props;
    const payload = {
      pageSize: 5,
      pageIndex,
      reqData: {
        type: 2,
      },
    };
    dispatch({
      type: 'user/fetchUserAfterInvestMsg',
      payload,
    });
  };

  // 获取任务信息列表
  fetchTaskMsg = (pageIndex = 0) => {
    const { dispatch } = this.props;
    const payload = {
      pageSize: 5,
      pageIndex,
      reqData: {
        type: 1,
      },
    };
    dispatch({
      type: 'user/fetchUserTaskMsg',
      payload,
    });
  };

  fetchUserSchedule = (date = moment()) => {
    const { dispatch } = this.props;
    const payload = {
      reqData: {
        year: date.format('YYYY'),
        month: date.format('MM'),
      },
    };
    dispatch({
      type: 'user/fetchUserSchedule',
      payload,

    });
  };

  toProject = (record) => {
    if(record.project_status == '初始状态'){
      record.project_status = 'INITIAL'
    }else if(record.project_status == '完善项目信息'){
      record.project_status = 'FILL'
    }else if(record.project_status == '投决会'){
      record.project_status = 'ICM'
    }else if(record.project_status == '项目决策'){
      record.project_status = 'ID'
    }else if(record.project_status == '确定投资计划'){
      record.project_status = 'CIP'
    }else if(record.project_status == '投后管理'){
      record.project_status = 'POST'
    }
    this.props.history.push("/projectmanagement/ongoingproject/checklist", {
      query: record
    });
  }

  render() {
    const { navigations } = this.state;
    const { userDashboard, userSchedule } = this.props;
    return (
      <React.Fragment>
        <StatisticCard {...this.props} />
        <Row className="flex flex-v-start">
          <Row className="mg-r flex1">
          <OngoingCard {...userDashboard} toProject={this.toProject}/>
          <MessageCard {...this.props} />
          <CalendarCard
            {...{
              userSchedule,
              onChange: this.fetchUserSchedule,
            }}
          />
        </Row>
          <NavigationCard navigations={navigations} />
        </Row>
      </React.Fragment>
    );
  }
}

export default ManagerCenter;

// 个人统计面板
function StatisticCard({ currentUser, avatar, userDashboard }) {
  const { name } = currentUser;
  const { projectVisitCount, projectCount, teamCount, teamRanking } = userDashboard;
  const StatisticItem = ({ divider = true, title, children }) => (
    <React.Fragment>
      <Row className="mg-h">
        <p>{title}</p>
        {children}
      </Row>
      {divider && <Divider type="vertical" style={{ height: '60%' }} />}
    </React.Fragment>
  );

  return (
    <Card style={{ margin: '-24px -24px 24px' }}>
      <Row type="flex" justify="space-between" >
        <Row>
          <Avatar src={avatar} icon="use" size={64} className="mg-r" />
          <Col>{name}</Col>
        </Row>
        <Row className="flex flex-v-center text-center">
          {/*项目数量*/}
          <StatisticItem title={formatMessage({id:'project.number'})}>
            <h1>{projectCount}</h1>
          </StatisticItem>
          {/*团队国内排名*/}
          <StatisticItem title={formatMessage({id:'project.ranking.china'})}>
            <h1>
              <Col>{teamRanking}</Col>
            </h1>
          </StatisticItem>
          {/*项目访问*/}
          <StatisticItem title={formatMessage({id:'project.access'})} divider={false}>
            <h1>{numeral(projectVisitCount).format('0,0')}</h1>
          </StatisticItem>
        </Row>
      </Row>
    </Card>
  );
}

// 快捷导航面板
function NavigationCard({ navigations }) {
  const [modalShow, changeModalShow] = useState(false);
  const margin = isNegative => {
    const value = 16;
    return {
      margin: `${isNegative ? -value : value}px`,
    };
  };

  const addNavigation = () => {
    changeModalShow(true);
  };

  const handleTreeSelectChange = e => {
  };

  // 格式化 menu 数据为 TreeSelect 组件数据格式
  const formatMenuData = data => {
    const result = data.map(({ name, path, children }) => {
      const formatedItem = {
        title: name,
        value: path,
        key: path,
      };

      if (children && children.length) {

        formatedItem.children = formatMenuData(children);
      }

      return formatedItem;
    });

    return result;
  };

  // 设置导航
  const setNavigations = () => {
    changeModalShow(false);
  };

  return (
    //快速开始/便捷导航
    <Card title={formatMessage({id:'project.quick.start'})} style={{ width: 300 }}>
      <Modal
        title={formatMessage({id:'project.Add.navigation'})}
        visible={modalShow}
        onOk={setNavigations}
        onCancel={() => changeModalShow(false)}
      >
        <Context.Consumer>
          {({ menuData }) => (
            <TreeSelect
              treeData={formatMenuData(menuData)}
              style={{ width: '100%' }}
              treeCheckable
              onChange={handleTreeSelectChange}
            />
          )}
        </Context.Consumer>
      </Modal>
      <Row className="flex flex-between flex-wrap" style={margin(true)}>
        {navigations.map((item,index) => (
          <Col style={margin()} key={index}>
            {item}
          </Col>
        ))}
        <Button size="small" style={margin()} onClick={addNavigation}>
          {/*+ 添加*/}
          {formatMessage({id:'project.add'})}
        </Button>
      </Row>
    </Card>
  );
}

// 正在进行中面板
function OngoingCard({ projectOngoing = [],toProject }) {
  const toJump = ()=>{
    router.push("/projectmanagement/ongoingproject/list")
  }
  let aa = ''
for(let i=0;i<projectOngoing.length;i++){
  if(projectOngoing[i].project_status == 'INITIAL'){
    projectOngoing[i].project_status = '初始状态'

  }else if(projectOngoing[i].project_status == 'FILL'){
    projectOngoing[i].project_status = '完善项目信息'

  }else if(projectOngoing[i].project_status == 'ICM'){
    projectOngoing[i].project_status= '投决会'

  }else if(projectOngoing[i].project_status == 'ID'){
    projectOngoing[i].project_status= '项目决策'

  }else if(projectOngoing[i].project_status == 'CIP'){
    projectOngoing[i].project_status = '确定投资计划'

  }else if(projectOngoing[i].project_status == 'POST'){
    projectOngoing[i].project_status = '投后管理'
  }
}
  return (
    <Card title={formatMessage({id:'project.ongoing.project'})} extra={<Button onClick={toJump}>{formatMessage({id:'project.look.all'})}</Button>} className="mg-b">
      {projectOngoing.map(
        (item, index) => (
          <Card.Grid key={String(index)} >
            <Row className="flex flex-column flex-between" onClick={()=>toProject(item)}>
              <Row>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <h4>{item.project_name}</h4>
                  <p>{moment(item.createdate).fromNow()}</p>
                </div>
            <div style={{height:'60px'}}>
              {item.subjectdesc?<Ellipsis length={25} tooltip>
                {item.subjectdesc}
              </Ellipsis>:'暂无备注信息'}
            </div>
              </Row>
              <Row className="flex flex-between">
                {/*项目状态*/}
                <b>{formatMessage({id:'validation.projectstatus'})}：</b>
                <b>{item.project_status}</b>
              </Row>
            </Row>
          </Card.Grid>
        )
      )}
    </Card>
  );
}

// 消息面板
function MessageCard({ onChange, userAfterInvestMsg, userTaskMsg, dispatch }) {
  // const MessageList = ({ data = [] }) => (
  //   <React.Fragment>
  //     {data.map((item, index) => (
  //       <div key={String(index)} onClick={() => handleMsgClick(item)}>
  //         <div>
  //           <h4>{item.content}</h4>
  //           <p style={{ fontSize: '12px' }}>{moment(item.senddate).fromNow()}</p>
  //           {index + 1 !== data.length && <Divider />}
  //         </div>
  //       </div>
  //     ))}
  //   </React.Fragment>
  // );

  const MessageList = ({ data, onClick, total }) => {
    if (!data) {
      data = []
    }
    const handleMsgClick = ({ content, id, state }, index) => {
      Modal.info({
        content,
      });
      if (onClick && state === 0) onClick(id, index);
    };
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item onClick={() => handleMsgClick(item, index)}>
            <List.Item.Meta title={item.content} description={moment(item.senddate).fromNow()} />
            {item.state === 0 && <Badge status="error" style={{ transform: 'scale(2)' }} />}
          </List.Item>
        )}
        pagination={{
          size: 'small',
          total,
        }}
      />
    );
  };

  const handleMsgClick = (id, index, type) => {
    dispatch({
      type: 'user/markRead',
      payload: {
        index,
        type,
        id,
      },
    });
  };

  return (
    <Card className="mg-b">
      <Tabs onChange={onChange}>
        {/*个人任务信息提醒*/}
        <TabPane tab={<Badge count={userTaskMsg.unreadCount}>{formatMessage({id:'project.Personal.information'})}</Badge>} key="1">
          <MessageList
            data={userTaskMsg.data}
            total={userTaskMsg.total}
            onClick={(id, index) => handleMsgClick(id, index, 'task')}
          />
        </TabPane>
        <TabPane
          tab={<Badge count={userAfterInvestMsg.unreadCount}>{formatMessage({id:'project.investment.information'})}</Badge>}
          key="2"
        >
          <MessageList
            data={userAfterInvestMsg.data}
            total={userAfterInvestMsg.total}
            onClick={(id, index) => handleMsgClick(id, index, 'afterInvest')}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}

// 日历面板
function CalendarCard({ userSchedule = [], onChange }) {
  const renderCellContent = momentDate => {
    // 找到日期匹配日程
    const scheduleFinded = userSchedule.find(item => item.date === momentDate.format('YYYY-MM-DD'));
    if (!scheduleFinded) return null;

    return (
      <Row>
        <Badge status="warning" text={scheduleFinded.schedule} />
      </Row>
    );
  };
  const handlePanelChange = (momentDate, mode) => {
    if (mode === 'month') {
      onChange(momentDate);
    }
  };

  return (
    <Card>
      <Calendar dateCellRender={renderCellContent} onPanelChange={handlePanelChange} />
    </Card>
  );
}
