<template>
    <div class="container-fluid p-0">
        <div v-if="checkedAuth">
            <router-view></router-view>
        </div>
        <div v-else class="d-flex justify-content-center align-items-center min-vh-100">
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <ErrorToast
            v-for="(value, key) in errors.errors"
            :key="key"
            :message="value"
            @hidden="errors.remove(key)">
        </ErrorToast>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import ErrorToast from '@/components/ErrorToast.vue'
import { onAuthStateChanged, sendEmailVerification } from '@firebase/auth'
import { useErrorsStore } from '@/stores/errors'
import { useFirebaseStore } from '@/stores/firebase'
import { useAuthStore } from '@/stores/auth'
import { useRolesStore } from '@/stores/roles'
import router from '@/plugins/router'

const errors = useErrorsStore()
const firebase = useFirebaseStore()
const auth = useAuthStore()
const roles = useRolesStore()

const checkedAuth = ref(false)

onAuthStateChanged(firebase.getAuth(), async (user) => {
    checkedAuth.value = true
    if (user) {
        auth.user = user

        try {
            if(user.emailVerified) {
                await roles.initializeUserRoles()
                if(roles.userRoles.length) {
                    await roles.initializeStudentRoles()
                    router.push({ name: 'home' })
                } else {
                    router.push({ name: 'admin-approval' })
                }
            } else {
                await sendEmailVerification(user)
                router.push({ name: 'email-confirmation' })
            }
        } catch(e) {
            errors.add(`An unexpected error occured: ${e.message}\nPlease try to refresh the page.`)
        }
        
    } else {
        roles.$reset()
        auth.$reset()
        router.push({ name: 'login' })
    }
})
</script>
