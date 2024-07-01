import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/protected/Shared/HomeView.vue'
import SuperAdminLogin from '@/views/unprotected/SuperAdminModule/SuperAdminLogin.vue'
import configuration from '@/views/protected/AdminModule/UserConfiguration.vue'
import user from '@/views/protected/AdminModule/UserHub.vue'
import AppUsers from '@/views/protected/AdminModule/AppUsers.vue'
import Vendors from '@/views/protected/AdminModule/Vendors.vue'
import AdminDetails from '@/views/protected/AdminModule/AdminDetails.vue'
import UserDetails from '@/views/protected/AdminModule/UserDetails.vue'
import AdminDashboard from '@/views/protected/AdminModule/AdminDashboard.vue'

import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import ErrorPage from '@/views/unprotected/ErrorPageView.vue'
import WeeshesPage from '@/views/unprotected/UserWeeshes.vue'
import AdminView from '@/views/protected/AdminModule/AdminList.vue'
import AdminList from '@/views/protected/SuperAdminModule/AdminList.vue'
import CreateUser from '@/views/protected/SuperAdminModule/CreateUser.vue'
import DepotPage from '@/views/protected/AdminModule/DepotPage.vue'
import BankPage from '@/views/protected/AdminModule/BankPage.vue'
import ActivityLog from '@/views/protected/AdminModule/ActivityLog.vue'
import ConfigHub from '@/views/protected/ConfigModule/RoleModule/ConfigHub.vue'
import RoleManager from '@/views/protected/ConfigModule/RoleModule/RoleManager.vue'
import WeeshesConfig from '@/views/protected/ConfigModule/WeeshesCategories/WeeshesConfig.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },

  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  //   meta: { requiresAuth: true }
  // },

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
    path: '/user/appuser/:id',
    name: 'appuserDetails',
    component: UserDetails,
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

    component: AdminView,

    meta: { requiresAuth: true }
  },
  {
    path: '/admin-creation',
    name: 'admin-creation',

    component: CreateUser,

    meta: { requiresAuth: true }
  },
  {
    path: '/admin-list',
    name: 'admin-list',

    component: AdminList,

    meta: { requiresAuth: true }
  },

  {
    path: '/admindetails/:Id',
    name: 'AdminDetails',

    component: AdminDetails,

    meta: { hideSidebar: true }
  },

  {
    path: '/weeshes',
    name: 'weeshes',
    component: WeeshesPage
  },

  {
    path: '/depot',
    name: 'depot',
    component: DepotPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/bank',
    name: 'bank',
    component: BankPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/activity',
    name: 'activity',
    component: ActivityLog,
    meta: { requiresAuth: true }
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigHub,
    meta: { requiresAuth: true }
  },
  {
    path: '/config/role',
    name: 'role',
    component: RoleManager,
    meta: { requiresAuth: true }
  },
  {
    path: '/config/weesh',
    name: 'configWeesh',
    component: WeeshesConfig,
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
