<template>
    <div class="container p-3">
        <h1>{{ eventData.name }}</h1>
        <div v-if="isOrgAdmin || isSysAdmin" class = "row">
            <div class="col-md-8 mb-2">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="ID Number" v-model="addAttendanceInput">
                    <button
                        class="btn btn-success"
                        :disabled="isAddingAttendance"
                        @click="addAttendance">
                        <span v-if="isAddingAttendance" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        <i v-else class="bi bi-plus-circle"></i>
                        Add Attendance
                    </button>
                </div>
            </div>
            <!-- office admin no add member button -->
            <div class = "col-md-4 mb-2">
                <a href = "http://localhost:3000">
                <button class="btn btn-success" style="width: 100%">
                    <i class="bi bi-person-badge p-1"></i>
                    Start RFID Attendance
                </button>
                </a>
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
                    <tr v-for="member in membersAttended"> <!-- link -->
                        <td>{{ member.studentId }}</td>
                        <td>{{ member.studentLastname }}</td>
                        <td>{{ member.studentFirstname }}</td>
                        <td>{{ member.studentCourse }}</td>
                        <td>{{ member.studentYear }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useEventsStore } from '@/stores/events'
    import { useErrorsStore } from '@/stores/errors'
    import { useRolesStore } from '@/stores/roles'

    const route = useRoute()
    const events = useEventsStore()
    const errors = useErrorsStore()
    const roles = useRolesStore()
    const eventData = ref({})
    const addAttendanceInput = ref('')
    const isAddingAttendance = ref(false)
    const membersAttended = ref([])

    const isOrgAdmin = computed(() => {
        return Boolean(roles.orgAdminRoles[route.params.orgId])
    })

    const isSysAdmin = computed(() => {
        return roles.isSysAdmin
    })

    async function addAttendance() {
        try {
            isAddingAttendance.value = true
            const attendance = await events.addAttendance(eventData.value, addAttendanceInput.value)
            membersAttended.value.push(attendance)
            addAttendanceInput.value = ''
        } catch(e) {
            console.error(e)
            errors.add(`Cannot add attendance: ${e.message}`)
        } finally {
            isAddingAttendance.value = false
        }
    }

    async function loadEventData() {
        const { eventId } = route.params
        try {
            eventData.value = await events.getEvent(eventId)
        } catch(e) {
            errors.add(`Cannot load event: ${e.message}`)
        }
    }

    async function loadAttendances() {
        const { orgId, eventId } = route.params
        try {
            membersAttended.value = await events.getAttendances(orgId, eventId)
        } catch(e) {
            errors.add(`Cannot load attendances: ${e.message}`)
        }
    }
    
    onMounted(async () => {
        await loadEventData()
        await loadAttendances()
    })
</script>
