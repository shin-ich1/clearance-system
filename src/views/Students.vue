<template>
    <div class="container pt-2">
        <div class="d-flex align-items-center mb-2">
            <h1 class="me-auto">Students</h1>
            <button
                class="btn btn-primary btn-lg"
                @click="showCreateModal = true">
                New Student
            </button>
        </div>
    </div>
    <div class="container">
        <div class="table-responsive">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>User Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in data">
                        <td>{{ student.id }}</td>
                        <td>{{ student.lastname }}</td>
                        <td>{{ student.firstname }}</td>
                        <td>{{ student.course }}</td>
                        <td>{{ student.year }}</td>
                        <td>{{ student.userId ? 'Registered' : 'Unregistered' }}</td>
                        <td>
                            <button
                                class="btn btn-sm"
                                :class="student.userId ? 'btn-warning' : 'btn-info'"
                                @click="student.userId ? askUnbind(index, student) : startBinding(index, student)">
                                <i
                                    class="bi"
                                    :class="student.userId ? 'bi-x-circle' : 'bi-at'">
                                </i>
                            </button>
                            <button
                                class="btn btn-sm btn-danger"
                                @click="askToDelete(index)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Modal
        title="New Student"
        action-label="Save"
        action-class="btn-primary"
        v-model="showCreateModal"
        @action="createNewStudent"
        @close="resetNewStudent">
        <div class="mb-3">
            <label for="idInput" class="form-label">ID Number</label>
            <input type="text" id="idInput" class="form-control" v-model="newStudent.id">
        </div>
        <div class="mb-3">
            <label for="lastnameInput" class="form-label">Last Name</label>
            <input type="text" id="lastnameInput" class="form-control" v-model="newStudent.lastname">
        </div>
        <div class="mb-3">
            <label for="firstnameInput" class="form-label">First Name</label>
            <input type="text" id="firstnameInput" class="form-control" v-model="newStudent.firstname">
        </div>
        <div class="mb-3">
            <label for="courseInput" class="form-label">Course</label>
            <input type="text" id="courseInput" class="form-control" v-model="newStudent.course">
        </div>
        <div class="mb-3">
            <label for="yearInput" class="form-label">Year</label>
            <input type="number" id="yearInput" class="form-control" v-model="newStudent.year">
        </div>
    </Modal>
    <Modal
        title="Bind Student User"
        action-label="Bind"
        action-class="btn-primary"
        v-model="showBindUserModal"
        @action="bindStudent"
        @close="resetStudentBinding">
        <div class="mb-3">
            <label for="bindingEmailInput" class="form-label">Email</label>
            <input type="email" id="bindingEmailInput" class="form-control" v-model="studentBinding.email">
        </div>
    </Modal>
    <Modal
        title="Unbind Student User"
        action-label="Unbind"
        action-class="btn-warning"
        v-model="showUnbindUserModal"
        @action="unbindStudent"
        @close="indexToUnbind = -1">
        <p>Are you sure you want to unbind the account of this student?</p>
        <div class="container">
            <table class="table table-bordered">
                <tr>
                    <td>ID Num</td>
                    <td>{{ studentToUnbind.id }}</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>{{ studentToUnbind.lastname }}</td>
                </tr>
                <tr>
                    <td>First Name</td>
                    <td>{{ studentToUnbind.firstname }}</td>
                </tr>
                <tr>
                    <td>Course</td>
                    <td>{{ studentToUnbind.course }}</td>
                </tr>
                <tr>
                    <td>Year</td>
                    <td>{{ studentToUnbind.year }}</td>
                </tr>
            </table>
        </div>
    </Modal>
    <Modal
        title="Delete Student"
        action-label="Delete"
        action-class="btn-danger"
        v-model="showDeleteModal"
        @action="deleteStudent"
        @close="indexToDelete = -1">
        <p>Are you sure you want to delete this student?</p>
        <div class="container">
            <table class="table table-bordered">
                <tr>
                    <td>ID Num</td>
                    <td>{{ studentToDelete.id }}</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>{{ studentToDelete.lastname }}</td>
                </tr>
                <tr>
                    <td>First Name</td>
                    <td>{{ studentToDelete.firstname }}</td>
                </tr>
                <tr>
                    <td>Course</td>
                    <td>{{ studentToDelete.course }}</td>
                </tr>
                <tr>
                    <td>Year</td>
                    <td>{{ studentToDelete.year }}</td>
                </tr>
            </table>
        </div>
    </Modal>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useErrorsStore } from '@/stores/errors'
import Modal from '@/components/Modal.vue'
import makeReactive from '@/util/makeReactive'

const errors = useErrorsStore()
const students = useStudentsStore()

const isLoadingData = ref(false)
const data = ref([])

const showCreateModal = ref(false)
const showBindUserModal = ref(false)
const showUnbindUserModal = ref(false)
const showDeleteModal = ref(false)

const {
    data: newStudent,
    reset: resetNewStudent,
    unwrap: unwrapNewStudent
} = makeReactive({
    id: '',
    lastname: '',
    firstname: '',
    course: 'BSIT',
    year: 1
})

const {
    data: studentBinding,
    reset: resetStudentBinding,
    unwrap: unwrapStudentBinding
} = makeReactive({
    index: -1,
    studentId: '',
    email: ''
})

const indexToUnbind = ref(-1)
const studentToUnbind = computed(() => {
    return indexToUnbind.value > -1 ? data.value[indexToUnbind.value] : {}
})

const indexToDelete = ref(-1)
const studentToDelete = computed(() => {
    return indexToDelete.value > -1 ? data.value[indexToDelete.value] : {}
})

onMounted(async () => {
    try {
        isLoadingData.value = true
        data.value = await students.getStudents()
    } catch(e) {
        console.error(e)
        errors.add(`Cannot load students: ${e.message}`)
    } finally {
        isLoadingData.value = false
    }
})

function addStudent(student) {
    data.value.push(student)
    data.value.sort((a, b) => {
        if(a.lastname < b.lastname) {
            return -1
        }
        if(a.lastname > b.lastname) {
            return 1
        }
        return 0
    })
}

async function createNewStudent($event) {
    try {
        const student = await students.createStudent(unwrapNewStudent())
        addStudent(student)
        $event.close()
    } catch(e) {
        $event.error()
        console.error(e)
        errors.add(`Cannot create new student: ${e.message}`)
    }
}

function askUnbind(index) {
    indexToUnbind.value = index
    showUnbindUserModal.value = true
}

function startBinding(index, student) {
    studentBinding.index = index
    studentBinding.studentId = student.id
    showBindUserModal.value = true
}

async function bindStudent($event) {
    try {
        const result = await students.bind(unwrapStudentBinding())
        Object.assign(data.value[studentBinding.index], result.data)
        $event.close()
    } catch(e) {
        $event.error()
        console.error(e)
        errors.add(`Cannot bind student to user: ${e.message}`)
    }
}

async function unbindStudent($event) {
    $event.close()
}

function askToDelete(idx) {
    indexToDelete.value = idx
    showDeleteModal.value = true
}

async function deleteStudent($event) {
    if(indexToDelete.value > -1) {
        try {
            const student = data.value[indexToDelete.value]
            await students.deleteStudent(student.id)
            data.value.splice(indexToDelete.value, 1)
            indexToDelete.value = -1
            $event.close()
        } catch(e) {
            $event.error()
            console.error(e)
            errors.add(`Cannot delete student: ${e.message}`)
        }
    }
}
</script>