<template>
  <div class="container">
    <h1>Employee Management</h1>
    <div class="content-wrapper">
      <!-- Employee Table -->
      <div class="table-section">
        <div class="top-section">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by Name"
            @input="searchEmployees"
            class="search-input"
          />
          <!-- Add Employee Button -->
          <button @click="openAddModal" class="submit-button">
            Add Employee
          </button>
        </div>

        <!-- Employee Table -->
        <table class="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.name">
              <td>{{ employee.id }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.role }}</td>
              <td>{{ employee.mail }}</td>
              <td class="action-cell">
                <div class="action-buttons">
                  <button class="img-btn">
                    <img
                      :src="editicon"
                      @click="openEditModal(employee)"
                      alt="edit Employee"
                      class="icon"
                    />
                  </button>
                  <UpdateEmployeeModal
                    v-if="showModal"
                    :employee="selectedEmployee"
                    @close="showModal = false"
                    @employee-updated="fetchEmployees"
                  />
                  <button class="img-btn">
                    <img
                      :src="deleteIcon"
                      @click="openDeleteModal(employee.id)"
                      alt="delete Employee"
                      class="icon"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button
            :disabled="page === 1"
            @click="changePage(page - 1)"
            class="submit-button"
          >
            Previous
          </button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button
            :disabled="page === totalPages"
            @click="changePage(page + 1)"
            class="submit-button"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Employee Form -->
      <!-- <div class="form-section">
        <div class="modal">
          <h2>Add Employee</h2>
          <form @submit.prevent="addEmployee">
            <label for="name">Name</label>
            <input
              type="text"
              v-model="employee.name"
              id="name"
              placeholder="Enter Name"
              required
            />

            <label for="role">Role</label>
            <input
              type="text"
              v-model="employee.role"
              id="role"
              placeholder="Enter Role"
              required
            />

            <label for="mail">Email</label>
            <input
              type="email"
              v-model="employee.mail"
              id="mail"
              placeholder="Enter Mail"
              required
            />

            <p v-show="isduplicate" class="error-message">
              Email already existed!!!
            </p>

            <div class="modal-actions">
              <button type="submit" class="submit-button">Add Employee</button>
            </div>
          </form>
        </div>
      </div> -->
      <!-- Add Employee Modal (Popup Form) -->
      <div v-if="showAddModal" class="delete-modal-overlay">
        <div class="modal">
          <h2>Add Employee</h2>
          <form @submit.prevent="addEmployee">
            <label for="name">Name</label>
            <input
              type="text"
              v-model="employee.name"
              id="name"
              placeholder="Enter Name"
              required
            />

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
            </select>

            <label for="mail">Email</label>
            <input
              type="email"
              v-model="employee.mail"
              id="mail"
              placeholder="Enter Mail"
              required
            />

            <!-- Error message for duplicate email -->
            <p v-show="isduplicate" class="error-message">
              Email already existed!!!
            </p>

            <div class="modal-actions">
              <button type="submit" class="submit-button">Add Employee</button>
              <button @click="closeAddModal" class="close-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="delete-modal-overlay">
        <div class="delete-modal">
          <h3>Are you sure you want to delete this employee?</h3>
          <div class="modal-actions">
            <button
              @click="deleteEmployee(deleteEmployeeId)"
              class="submit-button"
            >
              Delete
            </button>
            <button @click="closeDeleteModal" class="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import deleteIcon from "../delete-button-svgrepo-com.svg";
import editicon from "../edit-button-svgrepo-com (1).svg";
import http from "../https";
import UpdateEmployeeModal from "./update-employee-form.vue";

// Employee data
const employees = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const total = ref(0);
const page = ref(1);
const size = ref(5);
const totalPages = ref(0);
const showAddModal = ref(false);

// const fetchEmployees = async () => {
//   try {
//     const response = await http.get(`/employees/getAllEmployees`);
//     employees.value = response.data.employees;
//     total.value = response.data.total;
//     totalPages.value = Math.ceil(total.value / size.value);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//   }
// };
const fetchEmployees = async () => {
  try {
    const response = await http.get(`/employees/getAllEmployees`, {
      params: { page: page.value, size: size.value },
    });
    employees.value = response.data.data;
    total.value = response.data.total;
    totalPages.value = Math.ceil(total.value / size.value);
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

const changePage = (newPage) => {
  page.value = newPage;

  if (searchQuery.value.trim() === "") {
    fetchEmployees();
  } else {
    searchEmployees();
  }
};

// Selected employee for editing
const selectedEmployee = ref(null);

// Employee object to add
const employee = ref({
  id: "",
  name: "",
  role: "",
  mail: "",
});

// Modal for delete confirmation
const showDeleteModal = ref(false);
const deleteEmployeeId = ref(null);
const isduplicate = ref(false);

const openDeleteModal = (id) => {
  deleteEmployeeId.value = id;
  showDeleteModal.value = true;
};
const openAddModal = () => {
  showAddModal.value = true;
};
const closeAddModal = () => {
  showAddModal.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteEmployeeId.value = null;
};

const deleteEmployee = async (id) => {
  try {
    await http.delete(`/employees/deleteEmployeebyId/${id}`);
    fetchEmployees();
    closeDeleteModal(); // Close the modal after deletion
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

// const addEmployee = async () => {
//   try {
//     const { id, ...employeeData } = employee.value;
//     await http.post("/employees/addEmployee", employeeData);
//     fetchEmployees();
//     isduplicate.value = false;
//     employee.value = { id: "", name: "", role: "", mail: "" };
//   } catch (error) {
//     isduplicate.value = true;
//     console.error("Error adding employee:", error);
//   }
// };
const addEmployee = async () => {
  try {
    const { id, ...employeeData } = employee.value;
    const response = await http.post("/employees/addEmployee", employeeData);
    fetchEmployees();
    employee.value = { id: "", name: "", role: "", mail: "" };
    isduplicate.value = false;
    closeAddModal();
  } catch (error) {
    isduplicate.value = true;
    console.error("Error adding employee:", error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "An unexpected error occurred.";
    }
  }
};

const searchEmployees = async () => {
  try {
    if (searchQuery.value.trim() === "") {
      fetchEmployees();
    } else {
      const response = await http.get(
        `/employees/searchEmployees?query=${encodeURIComponent(
          searchQuery.value
        )}&page=${1}&size=${size.value}`
      );
      employees.value = response.data.data;
      total.value = response.data.total;
      totalPages.value = Math.ceil(total.value / size.value);
    }
  } catch (error) {
    console.error("Error searching employees:", error);
  }
};

const openEditModal = (employee) => {
  selectedEmployee.value = { ...employee };
  showModal.value = true;
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  width: 100%;
}

.table-section {
  flex: 2;
}

.form-section {
  flex: 1;
}

.employee-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.employee-table th,
.employee-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.employee-table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.employee-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.employee-table tr:hover {
  background-color: #f1f1f1;
}
.action-buttons {
  display: flex;
  gap: 8px;
}
/* Input Styling */
.search-input {
  padding: 10px;
  margin: 20px 0;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4caf50;
  outline: none;
}

/* Pagination Styling */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin: 0 10px;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #45a049;
}

/* Modal Styling */
.modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  margin: 100px;
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

.submit-button {
  /* padding: 10px 20px; */
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 120px;
  height: 40px;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #45a049;
}

.modal-actions {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
}
.icon {
  height: 50px;
  width: 35px;
  cursor: pointer;
}
.img-btn {
  border: none;
  background: none;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.pagination span {
  font-size: 14px;
  margin-top: inherit;
}
/* Delete Confirmation Modal Styling */
.delete-modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  margin: 100px auto;
  max-width: 90%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  text-align: center;
}

/* Modal Title */
.delete-modal h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

/* Modal Message */
.delete-modal p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

/* Modal Buttons */
.delete-modal .modal-actions {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

/* Button Styling */
.delete-modal .cancel-button,
.delete-modal .confirm-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.delete-modal .cancel-button {
  background-color: #ddd;
  color: #333;
  margin-top: auto;
  height: 40px;
}

.delete-modal .cancel-button:hover {
  background-color: #bbb;
}

.delete-modal .confirm-button {
  background-color: #e74c3c;
  color: white;
}

.delete-modal .confirm-button:hover {
  background-color: #c0392b;
}

.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark overlay */
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-message {
  color: red;
}
.top-section {
  display: flex;
  justify-content: space-evenly;
}
.close-button {
  padding: 10px;
  border-radius: 6px;
  height: 40px;
  margin-top: 21px;
  cursor: pointer;
}
</style>
