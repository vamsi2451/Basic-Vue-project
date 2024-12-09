<template>
  <div class="modal-overlay">
    <div class="modal">
      <button class="modal-close" @click="closeForm">&times;</button>
      <h2>Update Employee</h2>
      <form @submit.prevent="updateEmployee">
        <label for="name">Name</label>
        <input type="text" v-model="employee.name" id="name" required />

        <label for="role">Role</label>
        <select v-model="employee.role" id="role" required>
          <option value="" disabled selected>Select Role</option>
          <option value="Developer">Developer</option>
          <option value="Artist">Artist</option>
          <option value="Techie">Techie</option>
          <option value="Secret agent">Secret agent</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Scientist">Scientist</option>
          <option value="Electrician">Electrician</option>
          <option value="Organizer">Organizer</option>
        </select>

        <label for="mail">Email</label>
        <input type="email" v-model="employee.mail" id="mail" required />

        <button type="submit">Update Employee</button>
        <button type="button" @click="closeForm">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import http from "../https";

// Props: Employee to update
const props = defineProps({
  employee: Object,
});

// Emit events
const emit = defineEmits(["close", "employee-updated"]);

// Local state for the employee to avoid direct mutation
const employee = ref({ ...props.employee });

// Watch the employee prop to update local state when prop changes
watch(
  () => props.employee,
  (newEmployee) => {
    employee.value = { ...newEmployee };
  }
);

// Update the employee in the database
const updateEmployee = async () => {
  try {
    await http.put(
      `/employees/updateEmployeebyId/${employee.value.id}`,
      employee.value
    );
    emit("employee-updated");
    closeForm();
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// Close the form (emit close event to parent)
const closeForm = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  position: relative;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
}

.modal label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #555;
}

.modal input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.modal input:focus {
  border-color: #4caf50;
  outline: none;
}

.modal button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.modal button[type="submit"]:hover {
  background-color: #45a049;
}

.modal button[type="button"] {
  background-color: #f44336;
  color: white;
}

.modal button[type="button"]:hover {
  background-color: #d32f2f;
}

/* Add a close button */
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #555;
}
</style>
