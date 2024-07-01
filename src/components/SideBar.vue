<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { ability, defineAbilities } from '@/lib/ability';
import { useRoute } from 'vue-router';
const superAdminStore = useSuperAdminStore()
defineAbilities()
const route = useRoute()
const isActive = (path: string) => {
  return route.path.startsWith(path);
};
const config = computed(()=>{
  const role = ability.can('read', 'roles')
  const categories = ability.can('read', 'weesh-categories')
  if (role || categories ){
    return true
  }
  return false
})
const users = computed(()=>{
  const admin = ability.can('read', 'admins')
  const users = ability.can('read', 'users')
  if(admin || users){
    return true
  }
  return false
})
const logout = async () => {
  await superAdminStore.logout()
}
</script>

<template>
  <nav class="main-menu">
    <div class="flex items-start justify-center w-full py-8">
      <img
        class="nav-Icon"
        src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
        alt=""
      />
    </div>
    <ul class="space-y-3">
      <li :class="{ 'dashboard-active': $route.path === '/', 'opacity:20 cursor-not-allowed': ability.cannot('read', 'users') }">
        <a @click="$router.push({ name: 'home' })">
          <div class="icon-grid">
            <Icon
              icon="ri:dashboard-horizontal-fill"
              width="16"
              height="16"
              class="icons-sidebar"
            />
          </div>

          <span class="nav-text"> Dashboard </span>
        </a>
      </li>

      <li v-if="users" :class="{ 'dashboard-active': isActive('/user') }">
        <a @click="$router.push({ name: 'user' })">
          <div class="icon-grid">
            <Icon icon="teenyicons:users-solid" width="16" height="16" class="icons-sidebar" />
          </div>

          <span class="nav-text"> Users </span>
        </a>
      </li>

      <li :class="{ 'dashboard-active': isActive('/weeshes') }">
        <a @click="$router.push({ name: 'weeshes' })">
          <div class="icon-grid">
            <Icon icon="codicon:note" width="17" height="17" class="icons-sidebar" />
          </div>

          <span class="nav-text"> Weeshes </span>
        </a>
      </li>

      <li :class="{ 'dashboard-active': isActive('/depot') }">
        <a @click="$router.push({ name: 'depot' })">
          <div class="icon-grid">
            <Icon icon="mdi:truck-fast" width="17" height="17" class="icons-sidebar" />
          </div>

          <span class="nav-text"> Depot </span>
        </a>
      </li>

      <li :class="{ 'dashboard-active': isActive('/bank') }">
        <a @click="$router.push({ name: 'bank' })">
          <div class="icon-grid">
            <Icon
              icon="fluent:building-bank-16-filled"
              width="17"
              height="17"
              class="icons-sidebar"
            />
          </div>

          <span class="nav-text"> Bank </span>
        </a>
      </li>

      <li v-if="config" :class="{ 'dashboard-active': isActive('/config') }">
        <a @click="$router.push({ name: 'config' })">
          <div class="icon-grid">
            <Icon
              icon="mdi:settings"
              width="17"
              height="17"
              class="icons-sidebar"
            />
          </div>

          <span class="nav-text"> Configuration </span>
        </a>
      </li>

      <li>
        <a>
          <div class="icon-grid">
            <Icon icon="carbon:text-link-analysis" width="16" height="16" class="icons-sidebar" />
          </div>

          <span class="nav-text"> Analytics </span>
        </a>
      </li>

      <li :class="{ 'dashboard-active': isActive('/activity') }">
        <a @click="$router.push({ name: 'activity' })">
          <div class="icon-grid">
            <Icon icon="octicon:log-24" width="16" height="16" class="icons-sidebar" />

          </div>

          <span class="nav-text"> Activity Log </span>
        </a>
      </li>

     
    </ul>

    <ul class="logout">
      <li class="mb-4" style="margin-bottom: 15px">
        <a @click="logout">
          <div class="icon-grid">
            <Icon icon="solar:logout-2-bold" width="16" height="16" style="color: white" />
          </div>

          <span class="nav-text"> Logout </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
@import url(//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css);

.nav-Icon {
  width: auto;
  transform: rotate(-90deg); /* Initial rotation */
  height: 70px;
}

.main-menu:hover .nav-Icon {
  transition: opacity 0.3s ease;
  transform: rotate(0deg); /* Rotate back to 0 degrees on hover */
  transition: 0.3s ease;
  padding-top: 10px;
  padding-bottom: 10px;
}

.icon-grid {
  padding: 10px;
  /* background-color:#BAEF23; */
  background-color: #d9d9d91a;
  border-radius: 25%;
  margin-left: 15px;
  margin-right: 15px;
}

.dashboard-active .icon-grid {
  background-color: #baef23; /* Change background color on dashboard active */
}

.icons-sidebar {
  color: #baef23;
}

.dashboard-active .icons-sidebar {
  color: #020721;
}

.fa-2x {
  font-size: 2em;
}
.fa {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
}

.main-menu:hover,
nav.main-menu.expanded {
  width: 200px;
  overflow: visible;
}

.main-menu {
  background: #020721;
  border-right: 1px solid #e5e5e5;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100vh;
  left: 0;
  width: 65px;
  overflow: hidden;
  -webkit-transition: width 0.05s linear;
  transition: width 0.05s linear;
  transform: translateZ(0) scale(1, 1);
  -webkit-transform: translateZ(0) scale(1, 1);
  z-index: 1000;
}

.main-menu > ul {
  margin: 7px 0;
}

.main-menu li {
  position: relative;
  display: block;
  width: 200px;
}

.main-menu li > a {
  position: relative;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  color: white;
  font-family: arial;
  font-size: 14px;
  text-decoration: none;
  transform: translateZ(0) scale(1, 1);
  -webkit-transform: translateZ(0) scale(1, 1);
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}

.main-menu .nav-icon {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 18px;
}

.main-menu .nav-text {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  width: 190px;
  font-family: 'Titillium Web', sans-serif;
}

.main-menu > ul.logout {
  position: absolute;
  left: 0;
  bottom: 0;
}

.no-touch .scrollable.hover {
  overflow-y: hidden;
}

.no-touch .scrollable.hover:hover {
  overflow-y: auto;
  overflow: visible;
}

a:hover,
a:focus {
  text-decoration: none;
}

nav {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

nav ul,
nav li {
  outline: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.main-menu li:hover > a,
nav.main-menu li.active > a,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus,
.dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus,
.no-touch .dashboard-page nav.dashboard-menu ul li:hover a,
.dashboard-page nav.dashboard-menu ul li.active a {
  color: #baef23;
  /* background-color:#000000; */
}
.area {
  float: left;
  background: white;
  width: 100%;
  height: 100%;
}
</style>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin