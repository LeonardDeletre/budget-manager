
<template>
  <div class="row row-equal">
    <div class="flex xs12 xl6">
      <va-card v-if="lineChartData">
        <!-- <va-card-title>
          <h1>{{ $t('dashboard.charts.trendyTrends') }}</h1>
          <div class="mr-0 text-right">
            <va-button
              size="small"
              color="danger"
              @click="deleteSection"
              :disabled="lineChartData.labels.length < 2"
            >
              {{ $t('dashboard.charts.showInMoreDetail') }}
            </va-button>
          </div>
        </va-card-title> -->
        <va-card-content>
          <va-chart class="chart" ref="lineChart" :data="lineChartData" type="line"/>
        </va-card-content>
      </va-card>
    </div>

    <div class="flex xs12 md6 xl3">
      <va-card class="d-flex">
        <va-card-title>
          <!-- <h1>{{ $t('dashboard.charts.loadingSpeed') }}</h1> -->
          <!-- <div class="mr-0 text-right">
            <va-button
              icon="print"
              flat
              class="mr-0"
              @click="printChart"
            />
          </div> -->

        </va-card-title>
        <va-card-content v-if="donutChartData">
          <va-chart class="chart chart--donut" :data="donutChartData" type="donut"/>
        </va-card-content>
      </va-card>
    </div>

    <div class="flex xs12 md6 xl3">
      <div class="va-card auth-layout__card" style="background-color: rgb(255, 255, 255);"><!--v-if-->
        <div class="va-card__inner">
          <br/>
          <form class="form2" @submit.prevent="addTransfer()">   
            <div class="va-input-wrapper va-input va-input va-input_labeled va-input_solid mb-3"><!--v-if--><div class="va-input-wrapper__content"><div class="va-input__container" style=""><!--v-if--><div class="va-input__content-wrapper"><div class="va-input__content"><label aria-hidden="true" class="va-input__label" style="color: rgb(21, 78, 193); ">Amount</label><input type="text" v-model="amount" name="amount" placeholder="Enter an amount" tabindex="0" aria-label="Amount" class="va-input__content__input"></div></div><!--v-if--><!--v-if--></div><!--v-if--><div class="va-input-wrapper__message-list-wrapper"><!--v-if--></div></div><!--v-if--></div>
            <va-date-input style="width:100%" v-model="date" label="Date" bordered/>              
            <br/>
            <div class="va-input-wrapper va-input va-input va-input_labeled va-input_solid mb-3"><!--v-if--><div class="va-input-wrapper__content"><div class="va-input__container" style=""><!--v-if--><div class="va-input__content-wrapper"><div class="va-input__content"><label aria-hidden="true" class="va-input__label" style="color: rgb(21, 78, 193);">Description</label><input v-model="description" type="text" name="description"  placeholder="Enter a description" tabindex="0" aria-label="Date" class="va-input__content__input"></div></div><!--v-if--><!--v-if--></div><!--v-if--><div class="va-input-wrapper__message-list-wrapper"><!--v-if--></div></div><!--v-if--></div>
            <div class="va-input-wrapper va-input va-input va-input_labeled va-input_solid mb-3"><!--v-if--><div class="va-input-wrapper__content"><div class="va-input__container" style=""><!--v-if--><div class="va-input__content-wrapper"><div class="va-input__content"><label aria-hidden="true" class="va-input__label" style="color: rgb(21, 78, 193);">Title</label><input v-model="title" type="text" name="title"  placeholder="Enter a title" tabindex="0" aria-label="Date" class="va-input__content__input"></div></div><!--v-if--><!--v-if--></div><!--v-if--><div class="va-input-wrapper__message-list-wrapper"><!--v-if--></div></div><!--v-if--></div>
            <va-select label="Type" v-model="type" :options="typeOptions" />
            <br/>
            <va-select label="Currency" v-model="currency" :options="currencyOptions" />
            <br/>
            <va-select label="Category" v-model="category" :options="categoryOptions" />
            <br/>
            <va-button style="width:100%" @click="addTransfer">Add Transfer</va-button>
          </form>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import { getDonutChartData } from '@/data/charts/DonutChartData'
import { getLineChartData } from '@/data/charts/LineChartData'
import VaChart from '@/components/va-charts/VaChart.vue'
import { useGlobalConfig } from 'vuestic-ui'
import { getModule } from 'vuex-module-decorators'
import Transfer from '@/store/modules/transfer.module'

export default {
  name: 'dashboard-charts',
  components: { VaChart },
  data () {
    return {
      amount:"",
      date : new Date(),
      today: new Date(),
      description:"",
      title:"",
      type:"",
      currency:"",
      category: "",
      transferModule: getModule(Transfer, this.$store),
      email: window.localStorage.getItem('email'),
      lineChartData: null,
      donutChartData: null,
      lineChartFirstMonthIndex: 0,
      value: '',
      typeOptions: ['expense', 'entry'],
      currencyOptions: ['Euro', 'Dollar'],
      categoryOptions: ['Salary', 'Rent', 'Transport', 'Food', 'Entertainment', 'Other'],
      data : {
          "type": [],
          "month": [],
          "year": [],
          "amount": []
      },
      dataSum  : {
          "expensesSum" : [0,0,0,0,0,0,0,0,0,0,0,0],
          "entriesSum" : [0,0,0,0,0,0,0,0,0,0,0,0]
      },
      dataDonut : [0,0,0,0,0]

      
    }
  },
  async mounted() {
    this.today = new Date()
    await this.getDatasetSumPerMonth()
    await this.getExpCategory()
    this.lineChartData = getLineChartData(this.theme, this.lineChartFirstMonthIndex, this.dataSum)
    this.donutChartData = getDonutChartData(this.theme, this.dataDonut)
  },
  // watch: {
  //   '$themes.primary' () {
  //     this.lineChartData = getLineChartData(this.theme, this.lineChartFirstMonthIndex, this.dataSum)
  //     this.donutChartData = getDonutChartData(this.theme, this.dataDonut)
  //   },

  //   '$themes.info' () {
  //     this.lineChartData = getLineChartData(this.theme, this.lineChartFirstMonthIndex, this.dataSum)
  //     this.donutChartData = getDonutChartData(this.theme, this.dataDonut)
  //   },

  //   '$themes.danger' () {
  //     this.donutChartData = getDonutChartData(this.theme, this.dataDonut)
  //   },
  // },
  methods: {
    async addTransfer() {
      if(this.email){
        const transfer = {
          accountEmail: this.email,
          amount: this.amount,
          date : this.date,
          description: this.description,
          title: this.title,
          type: this.type,
          currency: this.currency,
          category: this.category,
        }
        await this.transferModule.addTransferByEmail(transfer).then(() => {
          window.location.reload()
        })
      }
      this.amount="";
      this.date="";
      this.description="";
      this.title="";
      this.type="";
      this.currency="";
      this.category="";
    },
    async getDataset(){
      try{
        await this.transferModule.getTransfersByEmail(localStorage.getItem('email'))
        .then(() =>{
          this.transferModule.transfers.forEach( (transfer) => {
            this.data['type'].push(transfer['type'])
            this.data['amount'].push(transfer['amount'])
            const date = new Date(transfer['date'])
            const month = date.getMonth()
            const year = date.getFullYear()
            this.data['month'].push((month))
            this.data['year'].push((year))
           })
        })
      }
      catch(error){
        console.log("getDataset error: "+error)
      }
    },

    async getDatasetSumPerMonth(){
      try{
        const totalExp = [0,0,0,0,0,0,0,0,0,0,0,0]
        const totalEnt = [0,0,0,0,0,0,0,0,0,0,0,0] // at index i, contains the number of entries of the month i
        let i = 0
        let j = 0
        await this.getDataset()
        for(j=0; j<this.data['type'].length; j++){
          if(this.data['type'][j] === "expense"){
            for(i=0; i<12; i++){
                if(this.data['month'][j] === i && this.data['year'][j] === this.today.getFullYear()){
                  totalExp[i] += 1 // +1 expenses in the month i
                  this.dataSum['expensesSum'][i] += this.data['amount'][j]  // sum of expenses of the same month i
                  break
                }
            }
          }
          else if(this.data['type'][j] === "entry"){
            for(i=0; i<12; i++){
                if(this.data['month'][j] === i && this.data['year'][j] === this.today.getFullYear()){
                  totalEnt[i] += 1 // +1 expenses in the month i
                  this.dataSum['entriesSum'][i] += this.data['amount'][j]  // sum of entries of the same month i
                  break
                }
            }
          }
        }
      }
      catch(error){
        console.log("getDatasetAvgMonth error: "+error)
      }
    },

    async getExpCategory(){
      try{
        await this.transferModule.getTransfersByEmail(localStorage.getItem('email'))
        .then(() =>{
          this.transferModule.transfers.forEach( (transfer) => {
            const d = new Date(transfer['date'])
            if(transfer['type'] === "expense"){
              if(d.getMonth() === this.today.getMonth() && d.getFullYear() === this.today.getFullYear()){
                if(transfer['category'] === "Rent"){
                  this.dataDonut[0] += transfer['amount']
                }
                else if(transfer['category'] === "Transport"){
                  this.dataDonut[1] += transfer['amount']
                }
                else if(transfer['category'] === "Food"){
                  this.dataDonut[2] += transfer['amount']
                }
                else if(transfer['category'] === "Entertainment"){
                  this.dataDonut[3] += transfer['amount']
                }
                else if(transfer['category'] === "Other"){
                  this.dataDonut[4] += transfer['amount']
                }
              }
            }
          })   
        })
      }
      catch(error){
        console.log("getExpCategory error: "+error)
      }
    },

    deleteSection () {
      this.lineChartFirstMonthIndex += 1
      this.lineChartData = getLineChartData(this.theme, this.lineChartFirstMonthIndex)
      this.$refs.lineChart.refresh()
    },
    printChart () {
      const win = window.open('', 'Print', 'height=600,width=800')
      win.document.write(`<br><img src='${this.donutChartDataURL}'/>`)
      // TODO: find better solution how to remove timeout
      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        win.close()
      }, 200)
    },
  },
  computed: {
    theme() {
      return useGlobalConfig().getGlobalConfig().colors
    },
    // donutChartDataURL () {
    //   return document.querySelector('.chart--donut canvas').toDataURL('image/png')
    // },
  },
}
</script>

<style scoped>
  .chart {
    height: 400px;
  }
  .text-right {
    text-align: right;
  }
</style>
