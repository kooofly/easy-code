import { createRouter, RouteRecordRaw } from 'vue-router'
<%- layoutImports %>
<%- pageImports %>

const routes: Array<RouteRecordRaw> = <%- routes %>

const router = createRouter({
  routes
})

export default router