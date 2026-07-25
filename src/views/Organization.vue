<template>
    <Header
        v-if="organization"
        greeting="Welcome to"
        :name="organization.name">
    </Header>
        
    <div class="container mt-2">
        <div class="row d-flex justify-content-center">
            <div class="col-md-12">

                <ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">

                    <!-- role: student, org admin -->

                    <li class="nav-item"> 
                        <button class="nav-link active" id="events-tab"
                            data-bs-toggle="tab" data-bs-target="#events-tab-content" type="button" role="tab"
                            aria-controls="events">

                            <div class="d-flex flex-column lh-lg"> 
                                <i class="bi bi-calendar"></i>
                                <span>Events</span> 
                            </div>
                        </button> 
                    </li>
                    <!-- role: student, org admin -->

                    <!-- role: office admin, org admin -->
                    <li class="nav-item" v-if="isSysAdmin || isOrgAdmin">
                        <button class="nav-link" id="members-tab" data-bs-toggle="tab"
                            data-bs-target="#members-tab-content" type="button" role="tab" aria-controls="members">

                            <div class="d-flex flex-column lh-lg">
                                <i class="bi bi-person"></i>
                                <span>Members</span>
                            </div>
                        </button>
                    </li>
                    <!-- role: office admin, org admin -->

                    <li class="nav-item" v-if="isSysAdmin">
                        <button class="nav-link" id="admins-tab" data-bs-toggle="tab"
                            data-bs-target="#admins-tab-content" type="button" role="tab" aria-controls="admins">

                            <div class="d-flex flex-column lh-lg">
                                <i class="bi bi-person-workspace"></i>
                                <span>Admins</span>
                            </div>
                        </button>
                    </li>

                </ul>

                <div class="tab-content" id="myTabContent">

                    <!-- role: student, org admin -->
                    <div class="tab-pane fade active show" id="events-tab-content" role="tabpanel" aria-labelledby="events-tab">
                        <div class="container p-3">

                            <!-- student no add event button -->
                            <div class = "row mb-2" v-if="isSysAdmin || isOrgAdmin">
                                <div class = "col-md-8">
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-success" style="width: 100%" @click="showAddEventModal = true">
                                        <i class="bi bi-calendar p-1"></i>
                                        Add Event
                                    </button>
                                </div>
                            </div>
                            <!-- student no add event button -->
                            
                            <div class = "row">
                                <table class="table text-center table-bordered">
                                    <thead class = "bg-success text-white">
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Event Name</th>
                                            <th scope="col">Fines</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            :class="{'clickable-row': isOrgAdmin || isSysAdmin }"
                                            v-for="event of events.loadedOrgEvents"
                                            @click="$router.push({ name: 'event', params: { orgId: $route.params.orgId, eventId: event.id } })">
                                            <td>{{ dayjs(event.date).format('YYYY-MM-DD') }}</td>
                                            <td>{{ event.name }}</td>
                                            <td>{{ event.fine }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                    <!-- role: student, org admin -->


                    <!-- role: office admin, org admin -->
                    <div
                        v-if="isSysAdmin || isOrgAdmin"
                        class="tab-pane fade"
                        id="members-tab-content"
                        role="tabpanel"
                        aria-labelledby="members-tab">
                        <div class="container p-3">
                            <div class = "row mb-2">
                                <div class="col-md-8">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Name / ID Number">
                                        <button class="btn btn-success">
                                            <i class="bi bi-search px-1"></i>
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <!-- office admin no add member button -->
                                <div class = "col-md-4">
                                    <button class="btn btn-success" style="width: 100%" @click="showAddMemberModal = true">
                                        <i class="bi bi-person p-1"></i>
                                        Add Member
                                    </button>
                                </div>
                            </div>
                            <!-- office admin no add member button -->

                            <div class = "row">
                                <table class="table text-center table-bordered ">
                                    <thead class = "bg-success text-white">
                                        <tr>
                                            <th>ID Num</th>
                                            <th>Last Name</th>
                                            <th>First Name</th>
                                            <th>Course</th>
                                            <th>Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            class="clickable-row"
                                            v-for="member in orgMemberRoles"
                                            @click="$router.push({ name: 'member', params: { orgId: $route.params.orgId, studentId: member.studentId } })">
                                            <td>{{ member.studentId }}</td>
                                            <td>{{ member.lastname }}</td>
                                            <td>{{ member.firstname }}</td>
                                            <td>{{ member.course }}</td>
                                            <td>{{ member.year }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                    <!-- role: office admin, org admin -->

                    <div
                        v-if="isSysAdmin"
                        class="tab-pane fade"
                        id="admins-tab-content"
                        role="tabpanel"
                        aria-labelledby="admins-tab">
                        <div class="container p-3">
                            <div class="row mb-2">
                                <div class="col-md-8"></div>
                                <div class="col-md-4">
                                    <div class="d-grid">
                                        <button class="btn btn-success" @click="showAddAdminModal = true">
                                            <i class="bi bi-person-workspace"></i>
                                            Add Admin
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <table class="table text-center table-bordered">
                                    <thead class = "bg-success text-white">
                                        <tr>
                                            <th scope="col">Email</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="admin in orgAdminRoles">
                                            <td>{{ admin.userEmail }}</td>
                                            <td>
                                                <button
                                                    class="btn btn-sm btn-danger">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <Modal
        title="Add Event"
        action-label="Add"
        action-class="btn-primary"
        v-model="showAddEventModal"
        @action="addNewEvent"
        @close="resetAddEvent">
        <div class="mb-3 row">
            <label for="addEventNameInput" class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="addEventNameInput" v-model="addEvent.name">
            </div>
        </div>
        <div class="mb-3 row justify-content-start">
            <label for="addEventFineInput" class="col-sm-2 col-form-label">Fine</label>
            <div class="col-sm-4">
                <input type="number" id="addEventFineInput" class="form-control" v-model="addEvent.fine">
            </div>
        </div>
        <div class="mb-3 row">
            <label for="addEventDateInput" class="col-sm-2 col-form-label">Date</label>
            <div class="col-sm-10">
                <DatePicker id="addEventDateInput" v-model="addEvent.date"></DatePicker>
            </div>
        </div>
    </Modal>
    <Modal
        title="Add Member"
        action-label="Add"
        action-class="btn-primary"
        v-model="showAddMemberModal"
        @action="addMember"
        @close="addMemberId = ''">
        <div class="mb-3">
            <label for="addMemberIdInput" class="form-label">ID Num</label>
            <input type="text" class="form-control" id="addMemberIdInput" v-model="addMemberId">
        </div>
    </Modal>
    <Modal
        title="Add Organization Admin"
        action-label="Add"
        action-class="btn-primary"
        v-model="showAddAdminModal"
        @action="addAdmin"
        @close="addAdminEmail = ''">
        <div class="mb-3">
            <label for="addAdminEmailInput" class="form-label">Email</label>
            <input type="email" class="form-control" id="addAdminEmailInput" v-model="addAdminEmail">
        </div>
    </Modal>
</template>

<style>
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

    .clickable-row { 
        cursor: pointer; 
    }
</style>

<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script> -->
<script setup>
    import dayjs from 'dayjs'
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import Header from '@/components/Header.vue'
    import Modal from '@/components/Modal.vue'
    import DatePicker from '@/components/DatePicker.vue'
    import { useOrgStore } from '@/stores/org'
    import { useRolesStore } from '@/stores/roles'
    import { useEventsStore } from '@/stores/events'
    import { useErrorsStore } from '@/stores/errors'
    import { isEmailValid } from '@/util/validations'
    import makeReactive from '@/util/makeReactive'

    const route = useRoute()
    const org = useOrgStore()
    const roles = useRolesStore()
    const events = useEventsStore()
    const errors = useErrorsStore()

    const addMemberId = ref('')
    const addAdminEmail = ref('')
    const orgMemberRoles = ref([])
    const orgAdminRoles = ref([])

    const showAddEventModal = ref(false)
    const showAddMemberModal = ref(false)
    const showAddAdminModal = ref(false)

    const organization = computed(() => {
        return org.orgData[route.params.orgId]
    })

    const isOrgAdmin = computed(() => {
        return Boolean(roles.orgAdminRoles[route.params.orgId])
    })

    const isSysAdmin = computed(() => {
        return roles.isSysAdmin
    })

    const {
        data: addEvent,
        reset: resetAddEvent,
        unwrap: unwrapAddEvent
    } = makeReactive({
        name: '',
        fine: 50,
        date: dayjs().format('YYYY-MM-DD')
    })

    async function loadOrgInfo() {
        if(!organization.value) {
            try {
                await org.loadOrg(route.params.orgId)
            } catch(e) {
                errors.add(`Cannot load org: ${e.message}`)
            }
        }
    }

    async function loadOrgEvents() {
        const { orgId } = route.params
        try {
            await events.loadOrgEvents(orgId)
        } catch(e) {
            errors.add(`Cannot load org events: ${e.message}`)
        }
    }

    async function loadOrgMembers() {
        const { orgId } = route.params
        if(roles.isSysAdmin || roles.orgAdminRoles[orgId]) {
            orgMemberRoles.value = await roles.getOrgMemberRoles(orgId)
        }
    }

    async function loadOrgAdmins() {
        if(roles.isSysAdmin) {
            try {
                orgAdminRoles.value = await roles.getOrgAdminRoles(route.params.orgId)
            } catch(e) {
                errors.add(`Cannot load org admins: ${e.message}`)
            }
        }
    }

    async function addNewEvent($event) {
        const { orgId } = route.params
        try {
            const data = unwrapAddEvent()
            if(data.name.length < 3) {
                throw new Error('Event name must be at least 3 characters long')
            }
            if(data.fine < 0) {
                throw new Error('Event fine should not be negative')
            }

            const event = await events.createOrgEvent({ orgId, ...data })
            $event.close()
        } catch(e) {
            $event.error()
            console.error(e)
            errors.add(`Cannot add event: ${e.message}`)
        }
    }

    async function addMember($event) {
        try {
            const { orgId } = route.params
            const role = await roles.addOrgMember(orgId, addMemberId.value)
            orgMemberRoles.value.push(role)
            $event.close()
        } catch(e) {
            $event.error()
            console.error(e)
            errors.add(`Cannot add member: ${e.message}`)
        }
    }

    async function addAdmin($event) {
        try {
            if(!isEmailValid(addAdminEmail.value)) {
                throw new Error('Invalid email')
            }

            const result = await org.addAdmin(route.params.orgId, addAdminEmail.value)
            orgAdminRoles.value.push(result.data)
            $event.close()
        } catch(e) {
            $event.error()
            errors.add(`Cannot add admin: ${e.message}`)
        }
    }

    onMounted(async () => {
        await loadOrgInfo()
        await loadOrgEvents()
        await loadOrgMembers()
        await loadOrgAdmins()
    })
</script>
