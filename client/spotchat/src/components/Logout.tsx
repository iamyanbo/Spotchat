export const Logout = () => {
    //redirect to login page
    window.location.href = '/login';
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('user');
    localStorage.removeItem('relatedUsers');
    localStorage.setItem('userDetails', 'false');
    return null;

}