export const Logout = () => {
    //redirect to login page
    window.location.href = '/login';
    localStorage.setItem('loggedIn', 'false');
    return null;

}