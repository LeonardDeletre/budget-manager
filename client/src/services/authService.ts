import {instance} from '@/services/api';

class AuthService {
  async login(email: string, password: string) {
    return instance
      .post('account/login', {
        email: email,
        password: password
      })
      .then(response => {
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('email', email);
        }
        return response.data;
      });
  }
  async logout() {
    return instance
      .post('account/logout', {
        refreshToken: localStorage.getItem('refreshToken'),
      })
      .then(response => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email');
        instance.defaults.headers.common["x-access-token"] = ''
        return response.data;
      },
      error => {
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // localStorage.removeItem('email');
        return error
      }
        );
      
    
  }
  async register(firstName: string, lastName: string, email: string, password: string) {
    return instance.post('account/register', {
      firstName,
      lastName,
      email,
      password
    });
  }
}
export default new AuthService();
