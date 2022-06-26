<template>
  <div class="row row-equal">
    <div class="flex xl6 xs12">
      <div class="row">
        <div
          class="flex xs12 sm4"
          v-for="(info, idx) in infoTiles"
          :key="idx"
        >
          <va-card class="mb-4" :color="info.color">
            <va-card-content>
              <p class="display-2 mb-0" style="color: white;">{{ info.value }}</p>
              <p style="color: white;">{{$t(info.text)}}</p>              
            </va-card-content>
          </va-card>
        </div>
      </div>

      <div class="row">
        <div class="flex xs12 md6">
          <va-card>
            <va-card-content>
              <p class="display-2 mb-1" :style="{color: theme.primary}">Goal</p>
              <p class="no-wrap">{{$t('200€/month maximum')}}</p>              
            </va-card-content>
          </va-card>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { useGlobalConfig } from 'vuestic-ui'
// import api from '@/services/api';
import { getModule } from 'vuex-module-decorators'
import { defineComponent } from 'vue'
import Transfer from '@/store/modules/transfer.module'

export default defineComponent({
  name: 'DashboardInfoBlock',
  data () {
    return {
      transferModule: getModule(Transfer, this.$store),
      transfers: {},
      email: window.localStorage.getItem('email'),
      infoTiles: [{
        color: 'success',
        value: '0',
        text: 'entries of the month',
        icon: '',
      }, {
        color: 'danger',
        value: '0',
        text: 'expenses of the month',
        icon: '',
      }, {
        color: 'info',
        value: '0',
        text: 'available',
        icon: '',
      }],
    }
  },
  async mounted(){
    await this.getTransfers();
  },
  methods: {
    async getTransfers(){
      if(this.email){
        await this.transferModule.getTransfersByEmail(this.email)
        console.log("this.transferModule.transfers: "+this.transferModule.transfers)
        const sum = this.transfersSum(this.transferModule.transfers)
        console.log('sum: '+sum)
        this.infoTiles[0].value = sum['entries'].toString()
        this.infoTiles[1].value = sum['expenses'].toString()
        this.infoTiles[2].value = sum['current'].toString()
        console.log('this.infoTiles[0].value: '+this.infoTiles[0].value)
        console.log('this.infoTiles[1].value: '+this.infoTiles[1].value)
        console.log('this.infoTiles[2].value: '+this.infoTiles[2].value)
      }
    },
  
    transfersSum(transfers: any){
      const result = {
        "expenses" : 0,
        "entries" : 0,
        "current" : 0
      }
      transfers.forEach( (transfer: any) => {
        console.log('transfer: '+transfer)
        if(transfer['type'] === "expense"){
          result['expenses'] += transfer['amount']
        }
        else if(transfer['type'] === "entry"){
          result['entries'] += transfer['amount']
        }

        result['current'] = result['entries'] - result['expenses']
      })
      return result
    },
  },
  computed: {
    theme() {
      return useGlobalConfig().getGlobalConfig().colors || {}
    }
  }
})
</script>

<style lang="scss" scoped>
  .row-separated {
    .flex + .flex {
      border-left: 1px solid var(--va-background);
    }

    // @include media-breakpoint-down(xs) {
    //   p:not(.display-2) {
    //     font-size: 0.875rem;
    //   }
    // }
  }

  .rich-theme-card-text {
    line-height: 24px;
  }

  .dashboard {
    .va-card__header--over {
      // @include media-breakpoint-up(md) {
      //   padding-top: 0 !important;
      // }
    }

    .va-card__image {
      // @include media-breakpoint-up(md) {
      //   padding-bottom: 0 !important;
      // }
    }
    // .image-card {
    //   position: relative;
    //   .va-button {
    //     position: absolute;
    //   }
    // }
  }
</style>
