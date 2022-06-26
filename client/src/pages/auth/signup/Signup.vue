<template>
  <form @submit.prevent="addAccount()">

    <va-input
      class="mb-3"
      v-model="user.firstName"
      :label="$t('firstName')"
      :error="!!firstNameErrors.length"
      :error-messages="firstNameErrors"
    />

    <va-input
      class="mb-3"
      v-model="user.lastName"
      :label="$t('lastName')"
      :error="!!lastNameErrors.length"
      :error-messages="lastNameErrors"
    />

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

    <va-input
      class="mb-3"
      v-model="user.checkPassword"
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
  name: 'signup',
  data () {
    return {
      user : { email: '', password: '', checkPassword: '', firstName: '', lastName: ''},
      agreedToTerms: false,
      emailErrors: '',
      passwordErrors: '',
      firstNameErrors: '',
      lastNameErrors: '',
      checkPasswordErrors: '',
      agreedToTermsErrors: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      userModule: getModule(User, this.$store)
    }
  },
  mounted() {
    if(this.userModule.isLoggedIn){
      this.$router.push({ name: 'dashboard' }); 
    }
  },
  methods: {
    
    formReady(){
      return this.firstNameErrors.length === 0 && this.lastNameErrors.length === 0 &&  this.emailErrors.length === 0 &&  this.passwordErrors.length === 0 && this.checkPasswordErrors.length === 0 && this.agreedToTermsErrors.length === 0
    },

    addAccount() {
      this.loading = true;
      this.firstNameErrors = this.user.firstName ? '' : 'First Name is required'
      this.lastNameErrors = this.user.lastName ? '' : 'Last Name is required'
      this.passwordErrors = this.user.password ? '' : 'Password is required'
      this.agreedToTermsErrors = this.agreedToTerms ? '' : 'You must agree to the terms of use'

      if(!this.user.email){
        this.emailErrors = 'Email is required';
      }
      else if(!EmailValidator.validate(this.user.email)){
        this.emailErrors = 'Email is invalid';
      }
      else{
        this.emailErrors = '';
      }
      if(!this.user.checkPassword){
        this.checkPasswordErrors = 'Checking password is required';
      }
      else if(this.user.password!==this.user.checkPassword){
        this.checkPasswordErrors = 'Not matching with the password';
      }
      else{
        this.checkPasswordErrors = '';
      }

      if (!this.formReady()) {
        this.loading = false;
        return
      }
      else{
        try{
          this.userModule.register(this.user).then(
            (data: string) => {
            this.user.firstName = '';
            this.user.lastName = '';
            this.user.email = '';
            this.user.password = '';
            this.user.checkPassword = '';
            this.agreedToTerms = false;
            this.firstNameErrors = '';
            this.lastNameErrors = '';
            this.passwordErrors = '';
            this.checkPasswordErrors = '';
            this.agreedToTermsErrors = '';
            this.emailErrors = '';
            this.errorMessage = '';
            this.loading = false;
            this.successMessage = data+', you will be redirected to login page in a few seconds';
            // wait 5 secondes and redirect to login page
            setTimeout(() => {
              this.$router.push({ name: 'login' });
            }, 5000);
          },
          (error: string) => {
              this.loading = false;
              this.errorMessage = error;
            }
          );
        }
        catch(error){
          console.log("Register Error")
        }    
          
      } 
    },
  },
})
</script>

<style lang="scss">
</style>
