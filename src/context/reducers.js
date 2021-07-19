export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_EMPLOYEE_ID = 'SET_EMPLOYEE_ID';
export const RESET = 'RESET';

export const initialAuthState = {
  isLoggedIn: false,
  username: '',
  token: '',
  role: '',
  employeeId: '',
  gender: '',
  emailId: '',
  profilePicture: ''
};

export const authReducer = (prevState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...prevState,
        isLoggedIn: true,
        ...action.payload
      };
    case LOGOUT:
      return initialAuthState;
    case SET_EMPLOYEE_ID:
      return {
        ...prevState,
        employeeId: action.payload
      }
    case RESET:
      return initialAuthState;
    default:
      return prevState;
  }
}