import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import AuthService from '@/services/authService';

const storedUser = localStorage.getItem('email');
@Module({ name: "User" })
class User extends VuexModule {
  public status = storedUser ? { loggedIn: true } : { loggedIn: false };
  public user = storedUser ? storedUser : null;
  @Mutation
  public loginSuccess(user: string): void {
    this.status.loggedIn = true;
    this.user = user;
  }
  @Mutation
  public loginFailure(): void {
    this.status.loggedIn = false;
    this.user = null;
  }
  @Mutation
  public logout(): void {
    this.status.loggedIn = false;
    this.user = null;
  }
  @Mutation
  public registerSuccess(): void {
    this.status.loggedIn = false;
  }
  @Mutation
  public registerFailure(): void {
    this.status.loggedIn = false;
  }

  get getUser(): string | null {
    return this.user;
  }

  @Action({ rawError: true })
  login(user: any): Promise<any> {
    return AuthService.login(user.email, user.password).then(
      () => {
        this.context.commit('loginSuccess', user);
        return Promise.resolve("Login successful");
      },
      error => {
        this.context.commit('loginFailure');
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return Promise.reject(message);
      }
    );
  }
  @Action
  signOut(): void {
    AuthService.logout();
    this.context.commit('logout');
  }
  @Action({ rawError: true })
  register(user: any): Promise<any> {
    return AuthService.register(user.firstName, user.lastName, user.email, user.password).then(
      response => {
        this.context.commit('registerSuccess');
        return Promise.resolve(response.data);
      },
      error => {
        this.context.commit('registerFailure');
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return Promise.reject(message);
      }
    );
  }
  get isLoggedIn(): boolean {
    return this.status.loggedIn;
  }
}


export default User;
