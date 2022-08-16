import { RouteRecordRaw } from 'vue-router'
import LayoutProjectPage from '@/layouts/ProjectPage.vue'
import LayoutProject from '@/layouts/Project.vue'
import Index from '@/pages/Index.vue'
import ProjectPagePage1 from '@/pages/project/page/Page1.vue'
import ProjectPagePage2 from '@/pages/project/page/Page2.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/project/:projectId',
    name: 'project',
    children: [
      {
        path: 'page/:pageId/:pid',
        name: 'project_page',
        children: [
          {
            path: 'page1',
            name: 'project_page_page_1',
            component: ProjectPagePage1
          },
          {
            path: 'page2',
            name: 'project_page_page_2',
            component: ProjectPagePage2
          }
        ],
        component: LayoutProjectPage
      }
    ],
    component: LayoutProject
  }
]

export default routes
