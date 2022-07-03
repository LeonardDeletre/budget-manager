import {instance} from '@/services/api';

class TransferService {
  async getTransfersByEmail(email: string) {
    return instance
      .get('transfer/'+email)
      .then(response => {
        return response;
      },
      error => {
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
    return instance
    .post('transfer/add', transfer)
    .then(response => {
      return response;
    },
    error => {
      return error;
    });
  }
}
export default new TransferService();
