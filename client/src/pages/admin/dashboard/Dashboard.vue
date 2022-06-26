<template>
  <div class="dashboard">
    <dashboard-charts />
    <dashboard-info-block />
    <!-- <div class="row row-equal">
      <div class="flex xs12 lg6">
        <dashboard-tabs @submit="addAddressToMap"/>
      </div>
      <div class="flex xs12 lg6">
        <dashboard-map ref="dashboardMap"/>
      </div>
    </div> -->
  </div>
</template>

<script>
import DashboardCharts from './DashboardCharts'
import DashboardInfoBlock from './DashboardInfoBlock'
import { getModule } from 'vuex-module-decorators'
import User from '@/store/modules/auth.module'

export default {
  name: 'dashboard',
  data(){
    return{
      userModule: getModule(User, this.$store),
    }
  },
  mounted(){
    if(!this.userModule.isLoggedIn){
      this.$router.push({ name: 'login' }); 
    }
  },
  components: {
    DashboardCharts,
    DashboardInfoBlock,
  },
}
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }

  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
