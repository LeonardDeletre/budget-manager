<template>
  <form @submit.prevent="login()">
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

    <router-link class="ml-1 link" :to="{name: 'recover-password'}">
      {{$t('auth.recover_password')}}
    </router-link>

    <div class="d-flex justify--center mt-3">
      <va-button @click="login" class="my-0">{{ $t('auth.login') }}</va-button>
    </div>
    <br/>
    <div class="d-flex justify--center mt-3">
    </div>
  </form>

  
</template>

<script>
import api from '@/services/api';
import * as EmailValidator from 'email-validator';
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      emailErrors: [],
      passwordErrors: [],
    }
  },
  methods: {
    async login(e) {
      e.preventDefault();
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
  
      if (!this.formReady()) {
        return
      }
      else{
        try{
            await api().post("account/login", {
            email: this.email,
            password: this.password,
          });
          this.email = "";
          this.password = "";
          this.$router.push({ name: 'dashboard' }); 
        }
        catch(error){
          console.log("Login error");
        }   
      } 
    },
  },

  computed: {
    formReady () {
      return !(this.emailErrors.length || this.passwordErrors.length)
    },
  },
}
</script>