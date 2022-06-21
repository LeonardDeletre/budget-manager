<template>
 <div class="main">
  <h3>Create Account</h3>

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


    <form class="form2" >
    <input class="input" v-model="accountEmail" type="text" name="accountEmail" placeholder="Enter your email" />
    <br/>
    <input class="input" v-model="amount" type="text" name="amount"  placeholder="Enter an amount" />
    <br/>
    <input class="input" v-model="date" type="text" name="date"  placeholder="AAAA-MM-JJ" />
    <br/>
    <input class="input" v-model="description" type="text" name="description"  placeholder="Enter a description" />
    <br/>
    <input class="input" v-model="title" type="text" name="title"  placeholder="Enter a title" />
    <br/>
    <input class="input" v-model="type" type="text" name="type"  placeholder="Enter a type" />
    <br/>
    <input class="input" v-model="currency" type="text" name="currency"  placeholder="Enter a currency" />
    <br/>
    <input class="input" v-model="category" type="text" name="category"  placeholder="Enter a category" />
    <br/>
    <button class="submit-button" @click="addTransfer">Add Transfer</button>
    <br/>
  </form>

<div class="transfer-container">
    <ul>
      <li v-for="(transfer, i) in transfers" :key="transfer.accountEmail">
        <div class="transfer"> 
        <span class="transfer-email">{{ transfer.accountEmail }}</span><br/>
        <span class="transfer-amount">{{ transfer.amount }}</span>
      </div>
        <button class="delete-btn" @click="removeTransfer(transfer, i)">DELETE transfer</button>
      </li>
    </ul>
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
      transfers: [],
      accountEmail: "",
      amount:"",
      date : "",
      description:"",
      title:"",
      type:"",
      currency:"",
      category: "",
    };
  },
  async mounted() {
    const response = await axios.get("api/account/");
    this.accounts = response.data;
    const response2 = await axios.get("api/transfer/");
    this.transfers = response2.data;
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
    async addTransfer(e) {
      e.preventDefault();
      const response2 = await axios.post("api/transfer/", {
        accountEmail: this.accountEmail,
        amount: this.amount,
        date : this.date,
        description: this.description,
        title: this.title,
        type: this.type,
        currency: this.currency,
        category: this.category,
      });

      this.transfers.push(response2.data);
      this.accountEmail ="";
      this.amount="";
      this.date="";
      this.description="";
      this.title="";
      this.type="";
      this.currency="";
      this.category="";
    },
    async removeTransfer(item, i) {
      await axios.delete("api/transfer/" + item.accountEmail);
      this.transfers.splice(i, 1);
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