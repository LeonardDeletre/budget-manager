import {instance} from '@/services/api';
import authHeader from './auth-header';

class UserService {
  getPublicContent() {
    return instance.get('all');
  }
  getUserBoard() {
    return instance.get('user', { headers: authHeader() });
  }
  getModeratorBoard() {
    return instance.get('mod', { headers: authHeader() });
  }
  getAdminBoard() {
    return instance.get('admin', { headers: authHeader() });
  }
}
export default new UserService();
