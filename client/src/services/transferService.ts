import {instance} from '@/services/api';

class TransferService {
  async getTransfersByEmail(email: string) {
    console.log("in getTransfersByEmail service: "+email);
    return instance
      .get('transfer/'+email)
      .then(response => {
        // console.log("in getTransfersByEmail service success: "+email);
        return response;
      },
      error => {
        // console.log("in getTransfersByEmail service failed: "+error);
        return error;
      });
  }

  async addTransferByEmail(transfer: 
    { 
      accountEmail: string; 
      amount: string; 
      date: string; 
      description: string; 
      title: string; 
      type: string; 
      currency: string; 
      category: string; 
    } ) 
    {
    // console.log("in addTransferByEmail service");
    return instance
    .post('transfer/add', transfer)
    .then(response => {
      // console.log("add successfull")
      return response;
    },
    error => {
      // console.log("add failed: "+error)
      return error;
    });
  }
}
export default new TransferService();
