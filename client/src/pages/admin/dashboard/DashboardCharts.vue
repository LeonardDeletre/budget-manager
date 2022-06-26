
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
      <dashboard-contributors-chart/>
    </div>
  </div>
</template>

<script>
import { getDonutChartData } from '@/data/charts/DonutChartData'
import { getLineChartData } from '@/data/charts/LineChartData'
import VaChart from '@/components/va-charts/VaChart.vue'
import { useGlobalConfig } from 'vuestic-ui'
import api from '@/services/api';
// import { tsOptionalType } from '@babel/types';

export default {
  name: 'dashboard-charts',
  components: { VaChart },
  data () {
    return {
      lineChartData: null,
      donutChartData: null,
      lineChartFirstMonthIndex: 0,
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

    async getTransfersByEmail(){
      try{
        const res = await api().get("transfer/" + 'a.a@a.fr')
        return res
      }
      catch(error){
        console.log("getTransfersByEmail Error")
      }
    },

    async getDataset(){
      try{
        const res = await this.getTransfersByEmail()
        // console.log('[DBChart] In getDataset :')
        res.data.forEach( (item) => {
          // console.log("in item, type : " + item['type'])
          // console.log("in item, amount " + item['amount'])
          // console.log("in item, date " + item['date'])
          // console.log('-------------------------------')

          this.data['type'].push(item['type'])
          this.data['amount'].push(item['amount'])
         
          const date = new Date(item['date'])
          const month = date.getMonth()
          this.data['month'].push((month))
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
        console.log("getDataset Error")
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
    donutChartDataURL () {
      return document.querySelector('.chart--donut canvas').toDataURL('image/png')
    },
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
