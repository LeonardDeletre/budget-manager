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

      <va-card :title="$t('tables.stripedHoverable')">
        <va-card-content>
          <div class="table-wrapper">
            <table class="va-table va-table--striped va-table--hoverable">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="transfer in transferModule.transfers" :key="transfer.lastName">
                  <td>{{ transfer.amount }}€</td>
                  <td>{{ ''+new Date(transfer.date).getDate() + '/'+(new Date(transfer.date).getMonth()+1)+'/'+ new Date(transfer.date).getFullYear()}}</td>
                  <td>{{ transfer.description }}</td>
                  <td>{{ transfer.title }}</td>
                  <td>{{ transfer.type }}</td>
                  <td>{{ transfer.category }}</td>
                </tr>
              </tbody>
            </table>          
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>

</template>

<script lang="ts">
import { useGlobalConfig } from 'vuestic-ui'
import { getModule } from 'vuex-module-decorators'
import { defineComponent } from 'vue'
import Transfer from '@/store/modules/transfer.module'

export default defineComponent({
  name: 'DashboardInfoBlock',
  data () {
    return {
      data: [],
      today: new Date(),
      transferModule: getModule(Transfer, this.$store),
      items: {},
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
    this.today = new Date()
    await this.getTransfers()
   
  },
  methods: {
    async getTransfers(){
      if(this.email){
        await this.transferModule.getTransfersByEmail(this.email)
        this.items = this.transferModule.transfers
        const sum = this.transfersSum(this.transferModule.transfers)
        this.infoTiles[0].value = sum['entries'].toString()
        this.infoTiles[1].value = sum['expenses'].toString()
        this.infoTiles[2].value = sum['current'].toString()
      }
    },
  
    transfersSum(transfers: any){
      const result = {
        "expenses" : 0,
        "entries" : 0,
        "current" : 0
      }
      transfers.forEach( (transfer: any) => {
        const d = new Date(transfer['date'])
        if(d.getMonth() === this.today.getMonth() && d.getFullYear() === this.today.getFullYear()){
          if(transfer['type'] === "expense") {
          result['expenses'] += transfer['amount']
          }
          else if(transfer['type'] === "entry"){
            result['entries'] += transfer['amount']
          }
          result['current'] = result['entries'] - result['expenses']
        }
      })
      return result
    },
  },
  computed: {
    fields () {
      return [{
        name: 'fullName',
        title: this.$t('tables.headings.name'),
      }, {
        name: 'email',
        title: this.$t('tables.headings.email'),
      }, {
        name: 'country',
        title: this.$t('tables.headings.country'),
      }]
    },
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
