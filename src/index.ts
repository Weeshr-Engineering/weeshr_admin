import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/protected/Shared/HomeView.vue'
import SuperAdminLogin from '@/views/unprotected/SuperAdminModule/SuperAdminLogin.vue'
import configuration from '@/views/protected/AdminModule/UserConfiguration.vue'
import user from '@/views/protected/AdminModule/UserHub.vue'
import AppUsers from '@/views/protected/AdminModule/AppUsers.vue'
import Vendors from '@/views/protected/AdminModule/Vendors.vue'
import Admin from '@/views/protected/AdminModule/AdminList.vue'
import AdminDetails from '@/views/protected/AdminModule/AdminDetails.vue'
import UserDetails from '@/views/protected/AdminModule/UserDetails.vue'

import { useSuperAdminStore } from '@/stores/super-admin/super-admin'

import ErrorPage from '@/views/unprotected/ErrorPageView.vue'
import AdminList from './views/protected/SuperAdminModule/AdminList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'superAdmin-login',
    component: SuperAdminLogin,
    meta: { hideSidebar: true }
  },

  {
    path: '/error',
    name: 'error',
    component: ErrorPage,
    meta: { hideSidebar: true }
  },
  {
    path: '/admin-list',
    name: 'adminlist',
    component: AdminList,
    meta: { requiresAuth: true }
  },

  {
    path: '/configuration',
    name: 'configuration',
    component: configuration,
    meta: { requiresAuth: true }
  },

  {
    path: '/user',
    name: 'user',
    component: user,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/appuser',
    name: 'appuser',
    component: AppUsers,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/vendors',
    name: 'vendors',
    component: Vendors,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/admin',
    name: 'admin',
    component: () => Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/admindetails/:Id',
    name: 'AdminDetails',
    component: () => AdminDetails,
    meta: { requiresAuth: true }
  },

  {
    path: '/usersdetails/:Id',
    name: 'UserDetails',
    component: () => UserDetails,
    meta: { requiresAuth: true }
  },

  {
    path: '/:pathMatch(.*)*', // Wildcard route to catch all unmatched paths
    redirect: { name: 'error' } // Redirect to error page
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = useSuperAdminStore().token !== ''
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'superAdmin-login' }) // Redirect to login if not authenticated
  } else {
    next() // Continue navigation
  }
})

export default router
