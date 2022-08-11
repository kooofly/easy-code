import { createRouter, RouteRecordRaw } from 'vue-router'
import layout_admin_project_api from '@/layout/admin_project_api.vue'
import layout_admin_project from '@/layout/admin_project.vue'
import layout_admin_role from '@/layout/admin_role.vue'
import layout_admin from '@/layout/admin.vue'
import admin_book from '@/pages/admin/book.vue'
import admin_project_api_detail from '@/pages/admin/project/api/detail.vue'
import admin_project_index from '@/pages/admin/project/index.vue'
import admin_project_list from '@/pages/admin/project/list.vue'
import admin_role_index from '@/pages/admin/role/index.vue'
import admin_role_list from '@/pages/admin/role/list.vue'
import admin_user from '@/pages/admin/user.vue'
import index from '@/pages/index.vue'
import _404 from '@/pages/_404.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    name: 'admin',
    children: [
      {
        path: '/book',
        name: 'admin_book',
        component: admin_book
      },
      {
        path: '/admin/project',
        name: 'admin_project',
        children: [
          {
            path: '/admin/project/api',
            name: 'admin_project_api',
            children: [
              {
                path: '/detail',
                name: 'admin_project_api_detail',
                component: admin_project_api_detail
              }
            ],
            component: layout_admin_project_api
          },
          {
            path: '/',
            name: 'admin_project_index',
            component: admin_project_index
          },
          {
            path: '/list',
            name: 'admin_project_list',
            component: admin_project_list
          }
        ],
        component: layout_admin_project
      },
      {
        path: '/admin/role',
        name: 'admin_role',
        children: [
          {
            path: '/',
            name: 'admin_role_index',
            component: admin_role_index
          },
          {
            path: '/list',
            name: 'admin_role_list',
            component: admin_role_list
          }
        ],
        component: layout_admin_role
      },
      {
        path: '/user',
        name: 'admin_user',
        component: admin_user
      }
    ],
    component: layout_admin
  },
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/_404',
    name: '_404',
    component: _404
  }
]

const router = createRouter({
  routes
})

export default router
