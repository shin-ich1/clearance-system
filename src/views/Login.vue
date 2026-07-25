<template>
    <div class="vw-100 vh-100 has-img-bg">
        <div class="container-fluid h-100">
            <div class="row align-items-center h-100">
                                            
                <div class="col-sm-12 col-lg-7 h-100 bg-success" style="--bs-bg-opacity: .7;">
                    <div class="h-100">
                        <div class="row align-items-center h-100">
                            <div class="col-sm-12 col-lg-12 text-center">
                                <img src = "@/assets/img/DWCSJLogo.png" alt = "logo" width = "150px"/>
                                <p></p>
                                <h4 class="text-white">Web Based Online Clearance</h4>
                                <h4 class="text-white">with ESP32 - RFID Attendance System</h4>
                                
                                <p class="text-white fst-italic">Divine Word College of San Jose Online Clearance</p>
                    
                                <div class = "mobileViewShowLoginButton">
                                    <button class = "btn btn-success btn-lg col-6" data-bs-toggle="modal" href="#loginModal">
                                        Login 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 col-lg-5 p-5 pcViewLoginCard">
                    <div class="card">
                        <div class="card-body">

                            

                            <ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <button class="nav-link active" id="faq_tab_1-tab" data-bs-toggle="tab"
                                        data-bs-target="#loginTab" type="button" role="tab" aria-controls="faq_tab_1"
                                        aria-selected="true">
                                        <div class="d-flex flex-column lh-lg">
                                            <i class="bi bi-person"></i>
                                            <span>Login</span>
                                        </div>
                                    </button>
                                </li>
                                <li class="nav-item"> 
                                    <button class="nav-link" id="faq_tab_4-tab"
                                        data-bs-toggle="tab" data-bs-target="#registerTab" type="button" role="tab"
                                        aria-controls="faq_tab_4" aria-selected="false">

                                        <div class="d-flex flex-column lh-lg"> 
                                            <i class="bi bi-calendar"></i>
                                            <span>Register</span> 
                                        </div>
                                    </button> 
                                </li>
                            </ul>

                            <div class="tab-content mt-3" id="myTabContent">
                                <div class="tab-pane fade active show" id="loginTab" role="tabpanel" aria-labelledby="faq_tab_1-tab">
                                    <form @submit.prevent="onLogin">
                                        <div class="mb-3">
                                            <label for="username" class="form-label">Username / ID Num</label>
                                            <input type="text" class="form-control" id="username" v-model="username"> 
                                        </div>
                                        <div class="mb-3">
                                            <label for="password" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="password" v-model="password"> 
                                        </div>
                                        <div class="d-grid">
                                            <button
                                                type="submit"
                                                class="btn btn-success btn-lg"
                                                :disabled="isLoggingIn">
                                                <span v-if="isLoggingIn" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div class="tab-pane fade" id="registerTab" role="tabpanel" aria-labelledby="faq_tab_4-tab">
                                    <form @submit.prevent="onRegister">
                                        <div class="mb-3">
                                            <label for="registerEmail" class="form-label">Email Address</label>
                                            <input type="email" class="form-control" id="registerEmail" v-model="registerEmail"> 
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerPassword" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="registerPassword" v-model="registerPassword"> 
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                                            <input type="password" class="form-control" id="registerConfirmPassword" v-model="registerConfirmPassword"> 
                                        </div>
                                        <div class="d-grid">
                                            <button
                                                type="submit"
                                                class="btn btn-success btn-lg"
                                                :disabled="isRegistering">
                                                <span v-if="isRegistering" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                Register
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="card">
                    <div class="card-body">

                        <ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" id="faq_tab_1-tab" data-bs-toggle="tab"
                                    data-bs-target="#loginTabMobile" type="button" role="tab" aria-controls="faq_tab_1"
                                    aria-selected="true">
                                    <div class="d-flex flex-column lh-lg">
                                        <i class="bi bi-person"></i>
                                        <span>Login</span>
                                    </div>
                                </button>
                            </li>
                            <li class="nav-item"> 
                                <button class="nav-link" id="faq_tab_4-tab"
                                    data-bs-toggle="tab" data-bs-target="#registerTabMobile" type="button" role="tab"
                                    aria-controls="faq_tab_4" aria-selected="false">

                                    <div class="d-flex flex-column lh-lg"> 
                                        <i class="bi bi-person-add"></i>
                                        <span>Register</span> 
                                    </div>
                                </button> 
                            </li>
                        </ul>

                        <div class="tab-content mt-3" id="myTabContent">
                            <div class="tab-pane fade active show" id="loginTabMobile" role="tabpanel" aria-labelledby="faq_tab_1-tab">
                                <form @submit.prevent="onLogin">
                                    <div class="mb-3">
                                        <label for="username" class="form-label">Username / ID Num</label>
                                        <input type="text" class="form-control" id="username" v-model="username"> <!-- id -->
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="password" v-model="password"> <!-- id -->
                                    </div>
                                    <div class="d-grid">
                                        <button
                                            type="submit"
                                            class="btn btn-success btn-lg"
                                            :disabled="isLoggingIn" data-bs-dismiss="modal">
                                            <span v-if="isLoggingIn" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane fade" id="registerTabMobile" role="tabpanel" aria-labelledby="faq_tab_4-tab">
                                <form @submit.prevent="onRegister">
                                    <div class="mb-3">
                                        <label for="registerEmail" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="registerEmail" v-model="registerEmail"> <!-- id -->
                                    </div>
                                    <div class="mb-3">
                                        <label for="registerPassword" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="registerPassword" v-model="registerPassword"> <!-- id -->
                                    </div>
                                    <div class="mb-3">
                                        <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                                        <input type="password" class="form-control" id="registerConfirmPassword" v-model="registerConfirmPassword"> <!-- id -->
                                    </div>
                                    <div class="d-grid">
                                        <button
                                            type="submit"
                                            class="btn btn-success btn-lg"
                                            :disabled="isRegistering">
                                            <span v-if="isRegistering" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .nav-tabs .nav-link.active {
            border-color: transparent;
            background-color: #fff !important;
            color: #198754 !important;
            border-bottom: 4px solid #198754 !important
    }

    .nav-fill .nav-item .nav-link,
    .nav-justified .nav-item .nav-link {
        width: 100%;
        color: #000
    }

    .mobileViewShowLoginButton {
        display: block; 
    }

    .pcViewLoginCard {
        display: none; 
    }

    @media (min-width: 992px) {
        .mobileViewShowLoginButton {   
        display: none; 
        }
        .pcViewLoginCard {   
        display: block; 
        }
    }

</style>

<script setup>
    import { ref } from 'vue'
    import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth'
    import { useFirebaseStore } from '@/stores/firebase'
    import { useErrorsStore } from '@/stores/errors'
    import { isEmailValid, isPasswordValid } from '@/util/validations'

    const errors = useErrorsStore()
    const firebase = useFirebaseStore()
    const auth = firebase.getAuth()
    const username = ref('')
    const password = ref('')
    const registerEmail = ref('')
    const registerPassword = ref('')
    const registerConfirmPassword = ref('')
    const isLoggingIn = ref(false)
    const isRegistering = ref(false)

    async function onLogin() {
        isLoggingIn.value = true
        try {
            await signInWithEmailAndPassword(auth, username.value, password.value)
            console.log('login success')
        } catch(e) {
            errors.add('Login failed.')
            console.error(e)
        } finally {
            isLoggingIn.value = false
        }
    }

    async function onRegister() {
        isRegistering.value = true
        try {
            if(!isEmailValid(registerEmail.value)) {
                throw new Error('Email is invalid')
            }

            if(!isPasswordValid(registerPassword.value)) {
                throw new Error('Password is invalid')
            }

            if(registerPassword.value != registerConfirmPassword.value) {
                throw new Error('Passwords do not match')
            }

            await createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
        } catch(e) {
            errors.add(`Registration failed: ${e.message}`)
            console.error(e)
        } finally {
            isRegistering.value = false
        }
    }
</script>