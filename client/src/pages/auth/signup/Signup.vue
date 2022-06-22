<template>
  <form @submit.prevent="addAccount()">

    <va-input
      class="mb-3"
      v-model="firstName"
      :label="$t('firstName')"
      :error="!!firstNameErrors.length"
      :error-messages="firstNameErrors"
    />

    <va-input
      class="mb-3"
      v-model="lastName"
      :label="$t('lastName')"
      :error="!!lastNameErrors.length"
      :error-messages="lastNameErrors"
    />

    <va-input
      class="mb-3"
      v-model="email"
      type="email"
      :label="$t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      class="mb-3"
      v-model="password"
      type="password"
      :label="$t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <va-input
      class="mb-3"
      v-model="checkPassword"
      type="password"
      :label="$t('Checking Password')"
      :error="!!checkPasswordErrors.length"
      :error-messages="checkPasswordErrors"
    />

  
    <br/>
    <br/>
    <div class="auth-layout__options d-flex align--center justify--space-between">
      <va-checkbox
        v-model="agreedToTerms"
        class="mb-0"
        :error="!!agreedToTermsErrors.length"
        :errorMessages="agreedToTermsErrors"
      >
        <template #label>
          <span class="ml-1">
            {{ $t('auth.agree') }}
            <span class="link">{{ $t('auth.termsOfUse') }}</span>
          </span>
        </template>
      </va-checkbox>
      <router-link class="ml-1 link" :to="{name: 'recover-password'}">
        {{$t('auth.recover_password')}}
      </router-link>
    </div>

    <div class="d-flex justify--center mt-3">
      <va-button @click="addAccount" class="my-0">{{ $t('auth.sign_up') }}</va-button>
    </div>
  </form>
</template>

<script>
import api from '@/services/api';
import * as EmailValidator from 'email-validator';
export default {
  name: 'signup',
  data () {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      checkPassword: '',
      agreedToTerms: false,
      emailErrors: [],
      passwordErrors: [],
      firstNameErrors: [],
      lastNameErrors: [],
      checkPasswordErrors: [],
      agreedToTermsErrors: [],
      accounts: [],
    }
  },
  methods: {
    async mounted() {
      const response = await api().get("account/");
      this.accounts = response.data;
    },

    async addAccount(e) {
      e.preventDefault();

      this.firstNameErrors = this.firstName ? [] : ['First Name is required']
      this.lastNameErrors = this.lastName ? [] : ['Last Name is required']
      if(!this.email){
        this.emailErrors = ['Email is required'];
      }
      else if(!EmailValidator.validate(this.email)){
        this.emailErrors = ['Email is invalid'];
      }
      else{
        this.emailErrors = [];
      }
      this.passwordErrors = this.password ? [] : ['Password is required']
      if(!this.checkPassword){
        this.checkPasswordErrors = ['Checking password is required'];
      }
      else if(this.password!==this.checkPassword){
        this.checkPasswordErrors = ['Not matching with the password'];
      }
      else{
        this.checkPasswordErrors = [];
      }
      this.agreedToTermsErrors = this.agreedToTerms ? [] : ['You must agree to the terms of use to continue']

      if (!this.formReady) {
        return
      }
      else{
        const response = await api().post("account/register", {
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
        this.checkPassword = "";
        this.$router.push({ name: 'login' });   
      } 
    },
    
  },

  computed: {
    formReady () {
      return !(this.firstNameErrors.length || this.lastNameErrors.length || this.emailErrors.length || this.passwordErrors.length || this.checkPasswordErrors.length || this.agreedToTermsErrors.length)
    },
  },
}
</script>

<style lang="scss">
</style>
