<template>
 <div class="main">
  <h3>Account list</h3>

  <form class="form" >
    <input class="input" v-model="firstName" type="text" name="firstName" placeholder="Enter your first name" />
    <br/>
    <input class="input" v-model="lastName" type="text" name="lastName"  placeholder="Enter your last name" />
    <br/>
    <input class="input" v-model="email" type="text" name="email"  placeholder="Enter your email" />
    <br/>
    <input class="input" v-model="password" type="text" name="password"  placeholder="Enter your password" />
    <br/>
    <input class="input" v-model="confirmPassword" type="text" name="confirmPassword"  placeholder="Enter again your password" />
    <br/>
    <button class="submit-button" @click="addAccount">Register</button>
  </form>
  <div class="account-container">
    <ul>
      <li v-for="(account, i) in accounts" :key="account.email">
        <div class="account">
        <span class="account-firstName">{{ account.firstName }}</span>
        <span class="account-lastName">{{ account.lastName }}</span>
      </div>
        <button class="delete-btn" @click="removeAccount(account, i)">DELETE account</button>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      accounts: [],
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  async mounted() {
    const response = await axios.get("api/account/");
    this.accounts = response.data;
  },
  methods: {
    async addAccount(e) {
      e.preventDefault();
      const response = await axios.post("api/account/", {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      });
      this.accounts.push(response.data);
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    },
    async removeAccount(item, i) {
      await axios.delete("api/account/" + item.email);
      this.accounts.splice(i, 1);
    },
  }
};
</script>

<style>
.main {
  margin: auto;
  margin-top: 3rem;
  max-width: 400px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

 h3{
  font-size: 22px;
  font-weight: bold;
  text-align: center;
}

.input {
  width: 100%;
  padding: 10px;
}

.submit-button {
  width: 400px;
  padding: 10px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
}

.account-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-container ul {
  width: 100%;
  list-style: none;
  padding: 0;
}

.account-container ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.account {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
  max-width: 250px;
}

.account-firstName {
  font-size: 18px;
  font-weight: bold;
}

.account-lastName {
  max-width: 70%;
  font-size: 14px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  padding: 10px;
  cursor: pointer;
  border: none;
}
</style>