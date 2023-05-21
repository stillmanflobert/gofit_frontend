import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/loginPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../components/admin/sideBar.vue'),
      children: [
        {
          path: '/admin/adminDashboard',
          name: 'adminDashboard',
          component: () => import('../components/admin/adminDashboard.vue'),
        },
        {
          path: '/admin/context',
          name: 'context',
          component: () => import('../components/admin/context.vue'),
        },
        {
          path: '/admin/dataInstruktur',
          name: 'instruktur',
          component: () => import('../components/admin/dataInstruktur.vue'),
        }
      ]
    },
    {
      path: '/kasir',
      name: 'kasir',
      component: () => import('../components/kasir/kasirSidebar.vue'),
      children: [
        {
          path: '/kasir/kasirDashboard',
          name: 'kasirDashboard',
          component: () => import('../components/kasir/memberIndex.vue'),
        },
        {
          path: '/kasir/memberKadaluarsa',
          name: 'memberKadaluarsa',
          component: () => import('../components/kasir/memberKadaluarsa.vue'),
        },
        {
          path: '/kasir/kelasKadaluarsa',
          name: 'kelasKadaluarsa',
          component: () => import('../components/kasir/depositKelasKadaluarsa.vue'),
        },
        {
          path: '/kasir/presensiGym',
          name: 'presensiGym',
          component: () => import('../components/kasir/presensiGym.vue'),
        },
        {
          path: '/kasir/presensiKelas',
          name: 'presensiKelas',
          component: () => import('../components/kasir/presensiKelas.vue'),
        }
      ]
    },
    {
      path: '/mo',
      name: 'manajeroperasional',
      component: () => import('../components/mo/moSidebar.vue'),
      children: [
        {
          path: '/mo/moDashboard',
          name: 'moDashboard',
          component: () => import('../components/mo/kelasIndex.vue'),
        },
        {
          path: '/mo/jadwalUmum',
          name: 'jadwalUmum',
          component: () => import('../components/mo/jadwalUmum.vue'),
        },
        {
          path: '/mo/jadwalHarian',
          name: 'jadwalHarian',
          component: () => import('../components/mo/jadwalHarian.vue'),
        },
        {
          path: '/mo/izinInstruktur',
          name: 'izinInstruktur',
          component: () => import('../components/mo/izinInstruktur.vue'),
        }
      ]
    }
  ]
})

export default router
