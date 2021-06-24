export const roles = {
  // 项目经理
  pm: {
    index: '/account/center',
    accessRoutes: [
      {
        path: '/',
        routes: [

          {
            path: '/workmanagement',
          },
          {
            path: '/basicdata',
          },
          {
            path: '/approval',
          },
          {
            path: '/projectmanagement',
            routes: [
              {
                path: '/projectmanagement/ongoingproject',
                routes: [
                  {
                    path: '/projectmanagement/ongoingproject/list',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/checklist',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/updateproject',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/ir',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/investplan',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/duediligence',
                  },
                ],
              },
            ],
          },
          {
            path: '/account',
            routes: [
              {
                path: '/account/center',
              },
            ],
          },
        ],
      },
    ],
  },
  stuffer: {
    index: '/dashboard/projectDashboard',
    accessRoutes: [
      {
        path: '/',
        routes: [

          {
            path: '/workmanagement',
          },
          {
            path: '/basicdata',
          },
          {
            path: '/postmanagement',
          },
          {
            path: '/projectmanagement',
            routes: [
              {
                path: '/projectmanagement/ongoingproject',
                routes: [
                  {
                    path: '/projectmanagement/ongoingproject/list',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/checklist',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/icm',
                  }
                ]
              }
            ]
          },
          {
            path: '/workmanagement',
          },
          {
            path: '/approval',
          },
          {
            path: '/analysis',
          },
          {
            path: '/dashboard/projectDashboard',
          },
        ],
      },
    ],
  },
  header: {
    index: '/dashboard/projectDashboard',
    accessRoutes: [
      {
        path: '/',
        routes: [

          {
            path: '/workmanagement',
          },
          {
            path: '/postmanagement',
          },
          {
            path: '/projectmanagement',
            routes: [
              {
                path: '/projectmanagement/ongoingproject',
                routes: [
                  {
                    path: '/projectmanagement/ongoingproject/list',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/checklist',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/projectdecision',
                  }
                ]
              }
            ]
          },
          {
            path: '/workmanagement',
          },
          {
            path: '/approval',
          },
          {
            path: '/analysis',
          },
          {
            path: '/dashboard/projectDashboard',
          },
        ],
      },
    ],
  },
  treasury: {
    index: '/dashboard/projectDashboard',
    accessRoutes: [
      {
        path: '/',
        routes: [

          {
            path: '/workmanagement',
          },
          {
            path: '/postmanagement',
          },
          {
            path: '/projectmanagement',
            routes: [
              {
                path: '/projectmanagement/ongoingproject',
                routes: [
                  {
                    path: '/projectmanagement/ongoingproject/list',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/checklist',
                  },
                  {
                    path: '/projectmanagement/ongoingproject/confirmproject',
                  }
                ]
              }
            ]
          },
          {
            path: '/workmanagement',
          },
          {
            path: '/approval',
          },
          {
            path: '/analysis',
          },
          {
            path: '/dashboard/projectDashboard',
          },
        ],
      },
    ],
  },
  corpadmin: {
    index: '/dashboard/projectDashboard',
    accessRoutes: [
      {
        path: '/',
        routes: [
          {
            path: '/sysadmin',
          },
    /*      {
            path: '/workmanagement',
          },
          {
            path: '/basicdata',
          },
          {
            path: '/postmanagement',
          },
          {
            path: '/projectmanagement',
          },
          {
            path: '/workmanagement',
          },
          {
            path: '/approval',
          },
          {
            path: '/analysis',
          },
          {
            path: '/dashboard/projectDashboard',
          },*/
        ],
      },
    ],
  },
  admin: {
    index: '/dashboard/projectDashboard',
    accessRoutes: [
      {
        path: '/',
        routes: [
          {
            path: '/sysadmin',
          },
          /*      {
                  path: '/workmanagement',
                },
                {
                  path: '/basicdata',
                },
                {
                  path: '/postmanagement',
                },
                {
                  path: '/projectmanagement',
                },
                {
                  path: '/workmanagement',
                },
                {
                  path: '/approval',
                },
                {
                  path: '/analysis',
                },
                {
                  path: '/dashboard/projectDashboard',
                },*/
        ],
      },
    ],
  },

};

const authorizeRoutes = routes => {
  const setRoutesAuth = (setRoutes, matchRoutes, role) => {
    return setRoutes.map(setItemRoute => {
      const authority = setItemRoute.authority || ['admin'];
      matchRoutes.forEach(matchItemRoute => {
        if (matchItemRoute.path === setItemRoute.path) {
          authority.push(role);

          // 若还有子路由则递归调用
          if (setItemRoute.routes && setItemRoute.routes.length) {
            // 角色配置有子路由，根据匹配设置对应路由可访问
            // 角色配置没有子路由，则全部设置为可访问
            setItemRoute.routes = setRoutesAuth(
              setItemRoute.routes,
              matchItemRoute.routes && matchItemRoute.routes.length
                ? matchItemRoute.routes
                : setItemRoute.routes,
              role
            );
          }
        }
      });

      return { ...setItemRoute, authority };
    });
  };

  let authorizedRoutes = routes;

  // 遍历角色
  Object.keys(roles).forEach(role => {
    authorizedRoutes = setRoutesAuth(authorizedRoutes, roles[role].accessRoutes, role);
  });
  return authorizedRoutes;
};

export default authorizeRoutes;
