<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  editingEmployee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const emptyForm = () => ({
  empId: '',
  name: '',
  email: '',
  department: '',
  position: '',
  hireDate: '',
  salary: '',
  active: true
})

const form = ref(emptyForm())
const errors = ref({})

const isEditing = computed(() => Boolean(props.editingEmployee))

watch(
  () => props.editingEmployee,
  (employee) => {
    form.value = employee ? { ...employee } : emptyForm()
    errors.value = {}
  },
  { immediate: true }
)

const empIdRegex = /^EMP[0-9]{3,5}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  const e = {}

  if (!form.value.empId.trim()) {
    e.empId = 'Employee ID is required.'
  } else if (!empIdRegex.test(form.value.empId.trim().toUpperCase())) {
    e.empId = 'Format must be EMP followed by 3 to 5 digits, e.g. EMP001.'
  }

  if (!form.value.name.trim()) {
    e.name = 'Name is required.'
  } else if (form.value.name.trim().length < 3) {
    e.name = 'Name must be at least 3 characters.'
  }

  if (!form.value.email.trim()) {
    e.email = 'Email is required.'
  } else if (!emailRegex.test(form.value.email.trim())) {
    e.email = 'Please enter a valid email address.'
  }

  if (!form.value.department) {
    e.department = 'Department is required.'
  }

  if (!form.value.position.trim()) {
    e.position = 'Position is required.'
  }

  if (!form.value.hireDate) {
    e.hireDate = 'Hire date is required.'
  } else {
    const selectedDate = new Date(form.value.hireDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate > today) {
      e.hireDate = 'Hire date cannot be in the future.'
    }
  }

  const salary = Number(form.value.salary)

  if (Number.isNaN(salary)) {
    e.salary = 'Salary is required.'
  } else if (salary < 1500 || salary > 50000) {
    e.salary = 'Salary must be between RM1,500 and RM50,000.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

function onSubmit() {
  if (!validate()) return

  emit('save', {
    ...form.value,
    empId: form.value.empId.trim().toUpperCase(),
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    position: form.value.position.trim(),
    salary: Number(form.value.salary)
  })

  if (!isEditing.value) {
    form.value = emptyForm()
  }
}

function onCancel() {
  emit('cancel')
  form.value = emptyForm()
  errors.value = {}
}
</script>

<template>
  <form class="employee-form" @submit.prevent="onSubmit">
    <h2>{{ isEditing ? 'Edit Employee' : 'Add Employee' }}</h2>

    <label>
      Employee ID
      <input v-model.trim="form.empId" placeholder="EMP001" />
      <span v-if="errors.empId" class="error-text">{{ errors.empId }}</span>
    </label>

    <label>
      Full Name
      <input v-model.trim="form.name" placeholder="Employee full name" />
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
    </label>

    <label>
      Email
      <input v-model.trim="form.email" type="email" placeholder="name@company.com" />
      <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
    </label>

    <label>
      Department
      <select v-model="form.department">
        <option value="">-- Select department --</option>
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
        <option>Marketing</option>
        <option>Operations</option>
      </select>
      <span v-if="errors.department" class="error-text">{{ errors.department }}</span>
    </label>

    <label>
      Position
      <input v-model.trim="form.position" placeholder="Job title" />
      <span v-if="errors.position" class="error-text">{{ errors.position }}</span>
    </label>

    <label>
      Hire Date
      <input v-model="form.hireDate" type="date" />
      <span v-if="errors.hireDate" class="error-text">{{ errors.hireDate }}</span>
    </label>

    <label>
      Salary (RM)
      <input
        v-model.number="form.salary"
        type="number"
        min="1500"
        max="50000"
        step="100"
        placeholder="3000"
      />
      <span v-if="errors.salary" class="error-text">{{ errors.salary }}</span>
    </label>

    <label class="checkbox-label">
      <input v-model="form.active" type="checkbox" />
      Active employee
    </label>

    <div class="form-actions">
      <button type="submit">
        {{ isEditing ? 'Update Employee' : 'Add Employee' }}
      </button>

      <button
        v-if="isEditing"
        type="button"
        class="secondary"
        @click="onCancel"
      >
        Cancel
      </button>
    </div>
  </form>
</template>