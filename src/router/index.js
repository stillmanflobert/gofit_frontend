import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
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
        path: 'adminDashboard',
        name: 'adminDashboard',
        component: () => import('../components/admin/adminDashboard.vue'),
      },
      {
        path: 'context',
        name: 'context',
        component: () => import('../components/admin/context.vue'),
      },
      {
        path: 'dataInstruktur',
        name: 'instruktur',
        component: () => import('../components/admin/dataInstruktur.vue'),
      },
    ],
  },
  {
    path: '/kasir',
    name: 'kasir',
    component: () => import('../components/kasir/kasirSidebar.vue'),
    children: [
      {
        path: 'kasirDashboard',
        name: 'kasirDashboard',
        component: () => import('../components/kasir/memberIndex.vue'),
      },
      {
        path: 'memberKadaluarsa',
        name: 'memberKadaluarsa',
        component: () => import('../components/kasir/memberKadaluarsa.vue'),
      },
      {
        path: 'kelasKadaluarsa',
        name: 'kelasKadaluarsa',
        component: () => import('../components/kasir/depositKelasKadaluarsa.vue'),
      },
      {
        path: 'presensiGym',
        name: 'presensiGym',
        component: () => import('../components/kasir/presensiGym.vue'),
      },
      {
        path: 'presensiKelas',
        name: 'presensiKelas',
        component: () => import('../components/kasir/presensiKelas.vue'),
      },
    ],
  },
  {
    path: '/mo',
    name: 'manajeroperasional',
    component: () => import('../components/mo/moSidebar.vue'),
    children: [
      {
        path: 'moDashboard',
        name: 'moDashboard',
        component: () => import('../components/mo/kelasIndex.vue'),
      },
      {
        path: 'jadwalUmum',
        name: 'jadwalUmum',
        component: () => import('../components/mo/jadwalUmum.vue'),
      },
      {
        path: 'jadwalHarian',
        name: 'jadwalHarian',
        component: () => import('../components/mo/jadwalHarian.vue'),
      },
      {
        path: 'izinInstruktur',
        name: 'izinInstruktur',
        component: () => import('../components/mo/izinInstruktur.vue'),
      },
      {
        path: 'laporan',
        name: 'laporam',
        component: () => import('../components/mo/laporan.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (
      err.name === 'NavigationDuplicated' &&
      err.message.includes('Avoided redundant navigation')
    ) {
    } else {
      throw err;
    }
  });
};

export default router;
