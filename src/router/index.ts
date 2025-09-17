import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            title: '仪表盘',
            icon: 'DashboardOutlined'
          }
        },
        {
          path: '/users',
          name: 'user-list',
          component: () => import('@/views/UserManagement.vue'),
          meta: {
            title: '用户管理',
            icon: 'UserOutlined'
          }
        },
        {
          path: '/users/:id',
          name: 'user-detail',
          component: () => import('@/views/UserDetail.vue'),
          meta: {
            title: '用户详情',
            hidden: true
          }
        },
        {
          path: '/instances',
          name: 'instance-list',
          component: () => import('@/views/InstanceManagement.vue'),
          meta: {
            title: 'GPU实例',
            icon: 'DesktopOutlined'
          }
        },
        {
          path: '/orders',
          name: 'order-list',
          component: () => import('@/views/OrderManagement.vue'),
          meta: {
            title: '订单管理',
            icon: 'ShoppingCartOutlined'
          }
        },
        {
          path: '/settings',
          name: 'basic-settings',
          component: () => import('@/views/Settings.vue'),
          meta: {
            title: '系统设置',
            icon: 'SettingOutlined'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录',
        layout: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '页面不存在',
        layout: false
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - GPU租借管理平台`
  }

  // 检查登录状态（这里暂时跳过）
  // const token = localStorage.getItem('access_token')
  // if (!token && to.name !== 'login') {
  //   next({ name: 'login' })
  //   return
  // }

  next()
})

export default router
