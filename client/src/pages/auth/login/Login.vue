<template>
  <form @submit.prevent="handleLogin()">
    <va-input
      class="mb-3"
      v-model="user.email"
      type="email"
      :label="$t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      class="mb-3"
      v-model="user.password"
      type="password"
      :label="$t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <router-link class="ml-1 link" :to="{name: 'recover-password'}">
      {{$t('auth.recover_password')}}
    </router-link>

    <div class="d-flex justify--center mt-3">
      <va-button @click="handleLogin" class="my-0">{{ $t('auth.login') }}</va-button>
    </div>
    <br>
    <div v-if="errorMessage.length>0" class="va-alert" style="background: rgb(228, 34, 34) none repeat scroll 0% 0%; box-shadow: none;"><div style="background-color: rgb(228, 34, 34);" class="va-alert__border-- va-alert__border"></div><div style="color: rgb(255, 255, 255);" class="va-alert__content">{{ errorMessage }}</div></div>
    <div v-if="successMessage.length>0" class="va-alert" style="background: rgb(34, 200, 34) none repeat scroll 0% 0%; box-shadow: none;"><div style="background-color: rgb(34, 228, 34);" class="va-alert__border-- va-alert__border"></div><div style="color: rgb(255, 255, 255);" class="va-alert__content">{{ successMessage }}</div></div>
  </form>

  
</template>

<script lang="ts">

import * as EmailValidator from 'email-validator';
import { defineComponent } from 'vue'
import { getModule } from 'vuex-module-decorators'
import User from '@/store/modules/auth.module'

export default defineComponent({
  name: 'login',
  data(){
    return {
      user : { email: '', password: '' },
      emailErrors: '',
      passwordErrors: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      userModule: getModule(User, this.$store),
    }
  },
  mounted(){
    if(this.userModule.isLoggedIn){
      this.$router.push({ name: 'dashboard' }); 
    }
  },
  methods: {
    
    formReady(){
      return this.emailErrors.length === 0 &&  this.passwordErrors.length === 0
    },
    handleLogin() {
      this.loading = true;
      
      if(!this.user.email){
        this.emailErrors = 'Email is required';
      }
      else if(!EmailValidator.validate(this.user.email)){
        this.emailErrors = 'Email is invalid';
      }
      else{
        this.emailErrors = '';
      }
      this.passwordErrors = this.user.password ? '' : 'Password is required'

      if (!this.formReady()) {
        this.loading = false;
        return
      }
      else{
        try{
          this.userModule.login(this.user).then(
            (data: string) => {
                this.loading = false;
                this.errorMessage = '';
                this.successMessage = data+', you will be redirected to dashboard in a few seconds';
                // wait 5 seconds and redirect to dashboard
                setTimeout(() => {
                  this.$router.push({ name: 'dashboard' }); 
                }, 5000);
            },
            (error: string) => {
              this.loading = false;
              this.errorMessage = error;
            }
          );
        }
        catch(error){
          console.log("Login error: "+error);
        }   
      } 
    }
  }
})
</script>