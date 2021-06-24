import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Card,
  Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GGEditor, { Mind } from 'gg-editor';
import { dataAddLabel } from '@/pages/tool/ToTree'
/*import G6 from '@antv/g6';
import './style.less'*/

@connect(({ fview, loading }) => ({
  fview,
  loading: loading.models.fview,
}))
@Form.create()
class FactoryView extends PureComponent {

  state = {
    data:{},
    visible:false,
    dataList:[]
  };

  componentDidMount() {
    const {dispatch } =  this.props
    dispatch({
      type:'fview/fetch',
      payload:{},
      callback:(res)=>{
        if(!res.data){
          return
        }
        res.data.label = res.data.name;
        dataAddLabel(res.data.children);
        this.setState({
          data:res.data
        })
        //this.renderG6(res.data);
      }
    })
  }

  renderG6 = (data) => {
    var COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
      return [['M', x, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x + 2, y], ['L', x + 2 * r - 2, y]];
    };
    var EXPAND_ICON = function EXPAND_ICON(x, y, r) {
      return [['M', x, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x + 2, y], ['L', x + 2 * r - 2, y], ['M', x + r, y - r + 2], ['L', x + r, y + r - 2]];
    };
    G6.registerNode('tree-node', {
      drawShape: function drawShape(cfg, group) {
        var rect = group.addShape('rect', {
          attrs: {
            fill: '#fff',
            stroke: '#666'
          }
        });
        var content = cfg.name.replace(/(.{19})/g, '$1\n');
        var text = group.addShape('text', {
          attrs: {
            text: content,
            x: 0,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: '#c92d28'
          }
        });
        var bbox = text.getBBox();
        var hasChildren = cfg.children && cfg.children.length > 0;
        if (hasChildren) {
          group.addShape('marker', {
            attrs: {
              x: bbox.maxX + 6,
              y: bbox.minX + bbox.height / 2 - 6,
              r: 6,
              symbol: COLLAPSE_ICON,
              stroke: '#666',
              lineWidth: 2
            },
            className: 'collapse-icon'
          });
        }
        rect.attr({
          x: bbox.minX - 4,
          y: bbox.minY - 6,
          width: bbox.width + (hasChildren ? 26 : 8),
          height: bbox.height + 12
        });
        return rect;
      }
    }, 'single-shape');

    var graph = new G6.TreeGraph({
      container: 'mountNode',
      width: window.innerWidth,
      height: window.innerHeight,
      modes: {
        default: [{
          type: 'collapse-expand',
          onChange: function onChange(item, collapsed) {
            
            var data = item.get('model');
            var icon = item.get('group').findByClassName('collapse-icon');
            if (collapsed) {
              icon.attr('symbol', EXPAND_ICON);
            } else {
              icon.attr('symbol', COLLAPSE_ICON);
            }
            data.collapsed = collapsed;
            return true;
          }
        }, 'drag-canvas', 'zoom-canvas']
      },
      defaultNode: {
        shape: 'tree-node',
        anchorPoints: [[0, 0.5], [1, 0.5]]
      },
      defaultEdge: {
        shape: 'cubic-horizontal'
      },
      edgeStyle: {
        default: {
          stroke: '#A3B1BF'
        }
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 20;
        },
        getHGap: function getHGap() {
          return 80;
        }
      }
    });

    G6.Util.traverseTree(data, function(item) {
      item.id = item.name;
    });
    graph.data(data);
    graph.render();
    graph.fitView();
  };

  onClickModel = (e)=>{
      
    if(e.item && e.item._cfg && e.item._cfg.model && e.item._cfg.model.data){
      const { data } = e.item._cfg.model;
      this.setState({
        visible:true,
        dataList:data
      })
    }
  }

  handleCancel = ()=>{
    this.setState({
      visible:false,
      dataList:[]
    })
  }

  render() {
    const {

    } = this.props;

    const { data,visible,dataList } = this.state;

    return (
      <PageHeaderWrapper>
        <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hidden' }} bordered={false}>
          <div>
            <h1>工厂全景查看（视图）</h1>
            <h6 style={{color:'red'}}>可滚动鼠标查看完整视图</h6>
          </div>
          {/*<div id="mountNode" style={{overflow:'hidden',textAlign:'center'}}></div>*/}
          <div style={{textAlign:'left'}}>
            <GGEditor style={{width:'1486px'}}>
              <Mind
                style={{ width: '100%', height: 700,marginLeft:'-670px',}}
                data={data}
                onClick={(e)=>this.onClickModel(e)}
              />
            </GGEditor>
          </div>
          <Modal
            title="设备状态"
            visible={visible}
            //onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <div>
              {
                dataList.map(item =>{
                  return <p key={item.id} style={{marginBottom:'10px',verticalAlign:'middle'}}>
                    <b style={{fontSize:'18px'}}>{item.name} :</b>
                    <span> {item.equipmentstatusName}</span>
                  </p>
                })
              }
            </div>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default FactoryView;
