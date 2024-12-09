<!-- <template>
  <!-- <div class="modal-overlay"> -->
  <div class="modal">
    <h2>Add Employee</h2>
    <form @submit.prevent="addEmployee">
      <label for="id">ID</label>
      <input type="text" v-model="employee.id" id="id" required />

      <label for="name">Name</label>
      <input type="text" v-model="employee.name" id="name" required />

      <label for="role">Role</label>
      <input type="text" v-model="employee.role" id="role" required />

      <label for="mail">Email</label>
      <input type="email" v-model="employee.mail" id="mail" required />

      <div class="modal-actions">
        <button type="submit" class="submit-button">Add Employee</button>
      </div>
    </form>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref } from "vue";
import http from "../https";

// Define the employee object with empty fields
const employee = ref({
  name: "",
  role: "",
  mail: "",
});

// Add the employee to the database
const addEmployee = async () => {
  try {
    await http.post("/employees/addEmployee", employee.value);
    employee.value = {
      id: "",
      name: "",
      role: "",
      mail: "",
    };
    fetchEmployees();
    // Emit an event to notify the parent to refresh the employee list
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};
</script>

<style scoped>
/* Overlay for the modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal container styling */
.modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Styling for labels and inputs */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}

/* Add a focus effect on input fields */
input:focus {
  border-color: #4caf50;
  outline: none;
}

/* Modal action buttons container */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

/* Submit and Cancel buttons */
.submit-button,
.cancel-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 48%;
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Close button on modal (X) */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}
</style> -->
