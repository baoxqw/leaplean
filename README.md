#这是1.1.1版本  

1.增加参照框的查询时loading（除了SelectTableRedis组件，由于是前台分页，加了反而反到影响显示速度,后面再想想)  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/1.png)  
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/1.png)


2.修复最小其套数计算问题,包括只显示制造件  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/2.jpg)  
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/2.jpg)


3.新增查看物资配套情况  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/3.jpg)    
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-11-25/3.jpg)


4.继续补充新建编辑时的loading，是的点击不会重复提交


5.检查页面的placeholder的完整


2020-12-1  
1.物料新增4个字段
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-01/2.jpg)    
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-01/2.jpg)

2.重构客商档案  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-01/1.jpg)    
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-01/1.jpg)


2020-12-07  
1.生产线增加子表    
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/1.jpg)      
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/1.jpg)

2.选择生产线，查询订单概览。订单默认显示全部概况。    
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/2.jpg)      
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/2.jpg)

3.添加综合查询提示   
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/3.jpg)        
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-07/3.jpg)

2020-12-08
1.首页面点击订单概览跳转到相应页面显示相应数据  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-08/1.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-08/1.jpg)  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-08/2.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-08/2.jpg)  

2020-12-16
1.质量问题添加“提交审核”操作，点击之后在弹出框里选择要审核的事业部质量师(非质量技术部无权限提交审核)  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/1.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/1.jpg)  

2.事业部质量师接收消息通知，可点击跳转到审批页面  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/2.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/2.jpg)  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/3.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/3.jpg)   
 
3.审批完后，质量技术部提交人将收到消息通知，并更新质量问题的状态  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/3.jpg)          
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-16/3.jpg)  


2020-12-22
1.质量问题界面，在审批进行中的数据可以点击‘查看流程’

2020-12-29  
1.数据导入界面，选择类型为：BOM，可以进行导出模板，以及导入模板的操作。  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-29/1.jpg)            
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2020-12-29/1.jpg)


2021-01-06  
1.物料申请单审批流程任意角色发起审批
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/1.jpg)              
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/1.jpg) 

2.事业部主管查看消息（id：74）  
[图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/2.jpg)                
![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/2.jpg)    

3.事业部主管进行审批  
 [图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/3.jpg)                
 ![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/3.jpg)
 
4.查看结果  
  [图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/4.jpg)                
  ![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-06/4.jpg)   
  
2020-01-07  
1.审批审核的查看流程改为查看流程图  
  [图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-07/1.jpg)                
  ![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-07/1.jpg)  
  [图示](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-07/2.jpg)                  
  ![tree](https://www.leapingtech.net/nienboot-0.0.1-SNAPSHOT/img/leaplean-1.1.1/2021-01-07/2.jpg)     


2020-01-21
加了多页签后出现的bug修复：  
1.之前建的路由结构不够规范导致有的点击显示不出来有的能显示   
2.不从菜单，从其他地方点击跳转无法跳转      
3.页面的头部布局错乱

4.菜单点击到第四层的时候，展开关闭会有问题   

(注意问题可能会成为bug：通过?方式传参的时候在多页签点击的时候参数会丢失)
