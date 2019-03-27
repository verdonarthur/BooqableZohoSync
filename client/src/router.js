import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Customers from './views/Customers.vue'
import Products from './views/Products.vue'
import Invoices from './views/Invoices.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices
    },
    //{
    //  path: '/about',
    //  name: 'about',
    //  // route level code-splitting
    //  // this generates a separate chunk (about.[hash].js) for this route
    //  // which is lazy-loaded when the route is visited.
    //  component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    //}
  ]
})
