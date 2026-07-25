import { useAuthStore } from '../stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const authenticatedRoutes = [
    {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/students',
        name: 'students',
        component: () => import('@/views/Students.vue')
    },
    {
        path: '/school-year',
        name: 'school-year',
        component: () => import('@/views/SchoolYear.vue')
    },
    {
        path: '/organizations/:orgId',
        name: 'organization',
        component: () => import('@/views/Organization.vue')
    },
    {
        path: '/organizations/:orgId/events/:eventId',
        name: 'event',
        component: () => import('@/views/Event.vue')
    },
    {
        path: '/organizations/:orgId/members/:studentId',
        name: 'member',
        component: () => import('@/views/Member.vue')
    },
    {
        path: '/email-confirmation',
        name: 'email-confirmation',
        component: () => import('@/views/EmailConfirmation.vue')
    },
    {
        path: '/admin-approval',
        name: 'admin-approval',
        component: () => import('@/views/AdminApproval.vue')
    }
]

const routes = [
    {
        path: '',
        component: () => import('@/views/Authenticated.vue'),
        children: authenticatedRoutes,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue') //HOME
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from) => {
    const auth = useAuthStore()

    if(to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: 'login' }
    }

    // if(to.meta.requiresSystemAdmin && !auth.isSystemAdmin) {
    //     return { name: 'home' }
    // }
})

export default router