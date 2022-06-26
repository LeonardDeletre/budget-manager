
<template>
  <div class="row row-equal">
    <div class="flex xs12 xl6">
      <va-card v-if="lineChartData">
        <va-card-title>
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
        </va-card-title>
        <va-card-content>
          <va-chart class="chart" ref="lineChart" :data="lineChartData" type="line"/>
        </va-card-content>
      </va-card>
    </div>

    <div class="flex xs12 md6 xl3">
      <va-card class="d-flex">
        <va-card-title>
          <h1>{{ $t('dashboard.charts.loadingSpeed') }}</h1>
          <div class="mr-0 text-right">
            <va-button
              icon="print"
              flat
              class="mr-0"
              @click="printChart"
            />
          </div>

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
              <!-- <select name="type" id="type-select" v-model="type">
                <option value="entry">entry</option>
                <option value="expense">expense</option>
              </select> -->
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
    <!-- <my-component ref="childref"></my-component> -->
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
      description:"",
      title:"",
      type:"",
      currency:"",
      category: "",
      // typeValue: '',
      // currencyValue: '',
      // categoryValue: '',
      transferModule: getModule(Transfer, this.$store),
      transfers: {},
      email: window.localStorage.getItem('email'),
      lineChartData: null,
      donutChartData: null,
      lineChartFirstMonthIndex: 0,
      value: '',
      typeOptions: ['expense', 'entry'],
      currencyOptions: ['Euro', 'Dollar'],
      categoryOptions: ['Income', 'Rent', 'Transport', 'Food', 'Entertainment', 'Other'],
      data : {
          "type": [],
          "month": [],
          "amount": []
      },
      dataAvg  : {
          "expensesAvg" : [0,0,0,0,0,0,0,0,0,0,0,0],
          "entriesAvg" : [0,0,0,0,0,0,0,0,0,0,0,0]
      }
    }
  },
  async mounted() {
    // console.log('In DBChart')
    await this.getDatasetAvgMonth()
    // console.log(this.data)
    this.lineChartData = getLineChartData(this.theme, this.lineChartFirstMonthIndex, this.dataAvg)
    // this.donutChartData = getDonutChartData(this.theme)
    
   
  },
  watch: {
    '$themes.primary' () {
      this.lineChartData = getLineChartData(this.theme)
      this.donutChartData = getDonutChartData(this.theme)
    },

    '$themes.info' () {
      this.lineChartData = getLineChartData(this.theme)
      this.donutChartData = getDonutChartData(this.theme)
    },

    '$themes.danger' () {
      this.donutChartData = getDonutChartData(this.theme)
    },
  },
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
          // const a = 1;
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
          // console.log('[DBChart] In getDataset :')
          // console.log('this.transferModule.transfers: '+this.transferModule.transfers)
          this.transferModule.transfers.forEach( (transfer) => {
            // console.log("in transfer, type : " + transfer['type'])
            // console.log("in transfer, amount " + transfer['amount'])
            // console.log("in transfer, date " + transfer['date'])
            // console.log('-------------------------------')

            this.data['type'].push(transfer['type'])
            this.data['amount'].push(transfer['amount'])
          
            const date = new Date(transfer['date'])
            const month = date.getMonth()
            this.data['month'].push((month))
           })
        })
      
        // console.log("in getDataset, data : ")
        // for(const index in this.data['type']){
        //   console.log(this.data['type'][index])
        //   console.log(this.data['amount'][index])
        //   console.log(this.data['month'][index])
        //   console.log('-------------------------------')
        // }
      }
      catch(error){
        console.log("getDataset Error: "+error)
      }
    },

    async getDatasetAvgMonth(){
      try{
        // console.log('[DBChart] In getDatasetAvgMonth :')
        const totalExp = [0,0,0,0,0,0,0,0,0,0,0,0]
        const totalEnt = [0,0,0,0,0,0,0,0,0,0,0,0] // at index i, contains the number of entries of the month i
        let i = 0
        let j = 0
        await this.getDataset()
        for(j=0; j<this.data['type'].length; j++){
          // console.log('----------------------------------')
          // console.log("this.data['type']["+j+"]" + this.data['type'][j])
          // console.log("this.data['amount']["+j+"]" + this.data['amount'][j])
          // console.log("this.data['month']["+j+"]" + this.data['month'][j])

          if(this.data['type'][j] === "expense"){
            // console.log('in expense case')
            for(i=0; i<12; i++){
              // console.log('i : '+ i + "   this.data['month']["+j+"]" + this.data['month'][j])
                if(this.data['month'][j] === i){
                  // console.log('i and month OK')
                  totalExp[i] += 1 // +1 expenses in the month i
                  // console.log('totalExp[' + i + '] : ' + totalExp[i])
                  // console.log("this.data['amount'][" + j + ']' + this.data['amount'][j])
                  this.dataAvg['expensesAvg'][i] += this.data['amount'][j]  // sum of expenses of the same month i
                  // console.log("this.dataAvg['expensesAvg'][" + i + ']' + this.dataAvg['expensesAvg'][i])
                  break
                }
            }
          }

          else if(this.data['type'][j] === "entry"){
            // console.log('in entry case')
            for(i=0; i<12; i++){
              // console.log('i : ' + i + "   this.data['month']["+j+"]" + this.data['month'][j])
                if(this.data['month'][j] === i){
                  // console.log('i and month OK')
                  totalEnt[i] += 1 // +1 expenses in the month i
                  // console.log('totalEnt[' + i + '] : '+ totalEnt[i])
                  // console.log("this.data['amount'][" + j + ']' + this.data['amount'][j])
                  this.dataAvg['entriesAvg'][i] += this.data['amount'][j]  // sum of entries of the same month i
                  // console.log("this.dataAvg['entriesAvg'][" + i + ']' + this.dataAvg['entriesAvg'][i])
                  break
                }
            }
          }
          
        }
        //Average calculus
        // console.log('-----AVG Calculus------')
          for(i=0; i<12;i++){
            if(totalExp[i] !== null){
              this.dataAvg['expensesAvg'][i] = Math.round(this.dataAvg['expensesAvg'][i] / totalExp[i])
              // console.log("this.dataAvg['expensesAvg'][" + i + ']' + this.dataAvg['expensesAvg'][i])
            }
          }

          for(i=0; i<12;i++){
            if(totalEnt[i] !== null){
              this.dataAvg['entriesAvg'][i] = Math.round(this.dataAvg['entriesAvg'][i] / totalEnt[i])
              // console.log("this.dataAvg['entriesAvg'][" + i + ']' + this.dataAvg['entriesAvg'][i])
            }
          }

        // console.log('-----------------------------')
        // console.log("in getDatasetAvg, dataAvg : ")
        // for(const key in this.dataAvg){
        //   console.log(this.dataAvg[key])
        // }
        
      }
      catch(error){
        console.log("getDatasetAvgMonth Error")
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
