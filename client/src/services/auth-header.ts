export default function authHeader() {
    const accessToken = localStorage.getItem('accessToken');
    // let user = JSON.parse(storedUser ? storedUser : "");
    // if (user && user.accessToken) {
    if(accessToken) {
      return { 'x-access-token': accessToken };
    } else {
      return {};
    }
  }
  