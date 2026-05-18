<script setup>
import { computed, onMounted, ref } from 'vue'
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeList from './components/EmployeeList.vue'
import SearchSortControls from './components/SearchSortControls.vue'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from './api/employeeApi.js'

const employees = ref([])
const editingEmployee = ref(null)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const search = ref('')
const sortBy = ref('')
const order = ref('asc')

const activeHeadcount = computed(() => {
  return employees.value.filter((employee) => employee.active).length
})

async function loadEmployees() {
  loading.value = true
  errorMsg.value = ''

  try {
    const params = {}

    if (search.value.trim()) {
      params.q = search.value.trim()
    }

    if (sortBy.value) {
      params.sortBy = sortBy.value
      params.order = order.value
    }

    const { data } = await getEmployees(params)
    employees.value = data
  } catch (err) {
    errorMsg.value = err.userMessage || 'Failed to load employees.'
  } finally {
    loading.value = false
  }
}

async function handleSave(payload) {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    if (editingEmployee.value) {
      await updateEmployee(editingEmployee.value.id, payload)
      editingEmployee.value = null
      successMsg.value = 'Employee updated successfully.'
    } else {
      await createEmployee(payload)
      successMsg.value = 'Employee added successfully.'
    }

    await loadEmployees()
  } catch (err) {
    errorMsg.value = err.userMessage || 'Save failed.'
  } finally {
    loading.value = false
  }
}

function handleEdit(employee) {
  editingEmployee.value = { ...employee }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleCancel() {
  editingEmployee.value = null
}

async function handleDelete(id) {
  const confirmed = confirm('Are you sure you want to delete this employee?')

  if (!confirmed) return

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await deleteEmployee(id)
    successMsg.value = 'Employee deleted successfully.'
    await loadEmployees()
  } catch (err) {
    errorMsg.value = err.userMessage || 'Delete failed.'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  search.value = ''
  sortBy.value = ''
  order.value = 'asc'
  loadEmployees()
}

onMounted(loadEmployees)
</script>

<template>
  <header class="app-header">
    <div>
      <h1>Employee Directory</h1>
      <p>Vue 3 · Axios · Express · MySQL</p>
    </div>

    <div class="headcount-card">
      <span>Active Headcount</span>
      <strong>{{ activeHeadcount }}</strong>
    </div>
  </header>

  <main>
    <p v-if="loading" class="loading">Loading request...</p>
    <p v-if="errorMsg" class="error-banner">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success-banner">{{ successMsg }}</p>

    <EmployeeForm
      :editingEmployee="editingEmployee"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <SearchSortControls
      v-model:search="search"
      v-model:sortBy="sortBy"
      v-model:order="order"
      @apply="loadEmployees"
      @clear="clearFilters"
    />

    <EmployeeList
      :employees="employees"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </main>
</template>