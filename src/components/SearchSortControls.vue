<script setup>
const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: ''
  },
  order: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['update:search', 'update:sortBy', 'update:order', 'apply', 'clear'])
</script>

<template>
  <section class="controls">
    <label>
      Search
      <input
        :value="props.search"
        placeholder="Search by name, ID, email, department"
        @input="emit('update:search', $event.target.value)"
      />
    </label>

    <label>
      Sort By
      <select
        :value="props.sortBy"
        @change="emit('update:sortBy', $event.target.value)"
      >
        <option value="">Default</option>
        <option value="name">Name</option>
        <option value="hireDate">Hire Date</option>
        <option value="salary">Salary</option>
      </select>
    </label>

    <label>
      Order
      <select
        :value="props.order"
        @change="emit('update:order', $event.target.value)"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </label>

    <div class="control-actions">
      <button @click="emit('apply')">Apply</button>
      <button class="secondary" @click="emit('clear')">Clear</button>
    </div>
  </section>
</template>