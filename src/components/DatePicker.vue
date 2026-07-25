<template>
    <div class="d-flex">
        <div class="dropdown me-2">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ months[month] || 'Month' }}
            </button>
            <ul class="dropdown-menu scrollable">
                <li v-for="(monthName, index) in months">
                    <a
                        href="#"
                        class="dropdown-item"
                        :class="{ active: month === index }"
                        @click.prevent="month = index">
                        {{ monthName }}
                    </a>
                </li>
            </ul>
        </div>

        <div class="dropdown me-2">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ day || 'Day' }}
            </button>
            <ul class="dropdown-menu scrollable">
                <li v-for="index in 31">
                    <a
                        href="#"
                        class="dropdown-item"
                        :class="{ active: day === index }"
                        @click.prevent="day = index">
                        {{ index }}
                    </a>
                </li>
            </ul>
        </div>

        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ year || 'Year' }}
            </button>
            <ul class="dropdown-menu scrollable">
                <li v-for="yearVal in years">
                    <a
                        href="#"
                        class="dropdown-item"
                        :class="{ active: year === yearVal }"
                        @click.prevent="year = yearVal">
                        {{ yearVal }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
.dropdown-menu.scrollable {
    max-height: 10em;
    overflow-y: scroll;
}
</style>
<script setup>
import dayjs from 'dayjs'
import { ref, watch } from 'vue'

const props = defineProps([ 'modelValue' ])
const emit = defineEmits([ 'update:modelValue' ])

const currentYear = dayjs().year()
const years = []
for(let i = currentYear - 5; i < currentYear + 5; i++) {
  years.push(i)
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const initDate = props.modelValue
    ? dayjs(props.modelValue, 'YYYY-MM-DD')
    : dayjs()

const year = ref(initDate.year())
const month = ref(initDate.month())
const day = ref(initDate.date())

function emitValue() {
  if(year.value && month.value && day.value) {
    const paddedMon = String(month.value + 1).padStart(2, '0')
    const paddedDay = String(day.value).padStart(2, '0')
    const value = `${year.value}-${paddedMon}-${paddedDay}`
    emit('update:modelValue', value)
  }
}

watch(year, emitValue)
watch(month, emitValue)
watch(day, emitValue)
</script>