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

  <form class="form2" >
    <input class="input" v-model="accountEmail" type="text" name="accountEmail" placeholder="Enter your email" />
    <br/>
    <input class="input" v-model="amount" type="text" name="amount"  placeholder="Enter an amount" />
    <br/>
    <input class="input" v-model="date" type="text" name="date"  placeholder="AAAA-MM-JJ" />
    <br/>
    <input class="input" v-model="description" type="text" name="description"  placeholder="Enter a description" />
    <br/>
    <input class="input" v-model="title" type="text" name="title"  placeholder="Enter a title" />
    <br/>
    <!-- <input class="input" v-model="type" type="text" name="type"  placeholder="Enter a type" /> -->
    <label for="type-select">Choose a type of transfer:</label>
    <br/>
    <select name="type" id="type-select" v-model="type">
      <option value="entry">entry</option>
      <option value="expense">expense</option>
    </select>
    <br/>
    <input class="input" v-model="currency" type="text" name="currency"  placeholder="Enter a currency" />
    <!-- <label for="currency-select">Choose a currency:</label>
    <br/>
    <select name="currency" id="currency-select">
      <option value="euro">euro</option>
      <option value="dollar">dollar</option>
    </select> -->
    <br/>
    <input class="input" v-model="category" type="text" name="category"  placeholder="Enter a category" />
    <!-- <label for="category-select">Choose a category:</label>
    <br/>
    <select name="category" id="category-select">
      <option value="shopping">shopping</option>
      <option value="food">food</option>
      <option value="income">income</option>
      <option value="other">other</option>
    </select> -->
    <br/>
    <button class="submit-button" @click="addTransfer">Add Transfer</button>
  </form>

</template>

<script>
import { useGlobalConfig } from 'vuestic-ui'
import api from '@/services/api';

export default {
  name: 'DashboardInfoBlock',
  data () {
    return {
      accountEmail: "",
      amount:"",
      date : "",
      description:"",
      title:"",
      type:"",
      currency:"",
      category: "",
      transfers: [],
      sumExp: [],

      infoTiles: [{
        color: 'success',
        value: '803',
        text: 'entries of the month',
        icon: '',
      }, {
        color: 'danger',
        value: '57',
        text: 'expenses of the month',
        icon: '',
      }, {
        color: 'info',
        value: '5',
        text: 'available',
        icon: '',
      }],
      modal: false,
      currentImageIndex: 0,
      images: [
        'https://i.imgur.com/qSykGko.jpg',
        'https://i.imgur.com/jYwT08D.png',
        'https://i.imgur.com/9930myH.jpg',
        'https://i.imgur.com/2JxhWD6.jpg',
        'https://i.imgur.com/MpiOWbM.jpg',
      ],
    }
  },
  async mounted(){
    // console.log("Value " + this.infoTiles[1].value)
    // const res = await this.getTransfersByEmail()
    // console.log("in DBInfo getTransferByEmail: ")
    // res.data.forEach((item)=>{
    //   console.log(item)
    // })

    // const res = await this.getDatasetExpEnt()
    // console.log("in DBInfo getdatasetExpEnt: ")
    // console.log(res)

    const sum = await this.sumExpEnt()
    console.log(sum)

    this.infoTiles[0].value = sum['entries']
    this.infoTiles[1].value = sum['expenses']
    this.infoTiles[2].value = sum['current']
  },
  methods: {
    async addTransfer(e) {
      e.preventDefault();
      const response = await api().post("transfer/add", {
        accountEmail: this.accountEmail,
        amount: this.amount,
        date : this.date,
        description: this.description,
        title: this.title,
        type: this.type,
        currency: this.currency,
        category: this.category,
      });
      this.transfers.push(response.data);
      this.accountEmail ="";
      this.amount="";
      this.date="";
      this.description="";
      this.title="";
      this.type="";
      this.currency="";
      this.category="";
    },

    async removeTransfer(item, i) {
      await api().delete("transfer/delete" + item.accountEmail);
      this.transfers.splice(i, 1);
    },
    
    async getTransfersByEmail(){
      try{
        const res = await api().get("transfer/" + 'a.a@a.fr')
        return res
      }
      catch(error){
        console.log("getTransfersByEmail Error")
      }
    },
    
    async sumExpEnt(){
    const trSumResp = await api().get("transfer/" + 'a.a@a.fr')
    const result = {
      "expenses" : 0,
      "entries" : 0,
      "current" : 0
    }
      trSumResp.data.forEach( (item) => {
        if(item['type'] === "expense"){
          result['expenses'] += item['amount']
        }
        else if(item['type'] === "entry"){
          result['entries'] += item['amount']
        }

        result['current'] = result['entries'] - result['expenses']
    })
    console.log("[DBInfo] In sumExpEnt : " + result)
    return result
  },

    showModal () {
      this.modal = true
    },
    showPrevImage () {
      this.currentImageIndex = !this.currentImageIndex ? this.images.length - 1 : this.currentImageIndex - 1
    },
    showNextImage () {
      this.currentImageIndex = this.currentImageIndex === this.images.length - 1 ? 0 : this.currentImageIndex + 1
    },
  },
  computed: {
    theme() {
      return useGlobalConfig().getGlobalConfig().colors || {}
    }
  }
}
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
