import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import TransferService from '@/services/transferService';
import { store } from '@/store/store'
// const storedUser = localStorage.getItem('email');
@Module({ dynamic: true, store, name: "transferStore" })
class Transfer extends VuexModule {
  // make an array of dictionaries of transfers
  public transfers: any[] = [];

  @Mutation
  public setTransfers(transfers: any[]) {
    this.transfers = transfers;
  }

  @Action({ rawError: true })
  getTransfersByEmail(email: string): Promise<any> {
    return TransferService.getTransfersByEmail(email).then(
      response => {
        this.context.commit('setTransfers', response.data);
        return Promise.resolve("Successfully fetched transfers");
      },
      error => {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return Promise.reject(message);
      }
    );
  }

  @Action({ rawError: true })
  addTransferByEmail(transfer: 
    { 
      accountEmail: string; 
      amount: string; 
      date: string; 
      description: string; 
      title: string; 
      type: string; 
      currency: string; 
      category: string; 
    }): Promise<any> {
    // console.log("in addTransferByEmail module");
    return TransferService.addTransferByEmail(transfer).then(
      response => {
        // this.context.commit('setTransfers', response.data);
        return Promise.resolve("Successfully added transfer");
      },
      (error: any) => {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return Promise.reject(message);
      }
    );
  }


}


export default Transfer;
