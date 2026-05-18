<script setup>
defineProps({
  employees: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const salaryFormatter = new Intl.NumberFormat('ms-MY', {
  style: 'currency',
  currency: 'MYR'
})

function formatSalary(value) {
  return salaryFormatter.format(Number(value))
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-MY')
}
</script>

<template>
  <section class="list-section">
    <div v-if="!employees.length" class="empty-box">
      No employees found.
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Hire Date</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>
              <strong>{{ employee.name }}</strong>
              <div class="muted">{{ employee.empId }}</div>
              <div class="muted">{{ employee.email }}</div>
            </td>

            <td>{{ employee.department }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ formatDate(employee.hireDate) }}</td>
            <td>{{ formatSalary(employee.salary) }}</td>

            <td>
              <span :class="employee.active ? 'badge active' : 'badge inactive'">
                {{ employee.active ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td>
              <button @click="emit('edit', employee)">Edit</button>
              <button class="danger" @click="emit('delete', employee.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>