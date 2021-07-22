// export const login = (username, password) => {
//   return axios
//     .post(API_URL + "/auth", {
//       username,
//       password,
//     })
//     .then((response) => {
//       let result = response.data.result;
//       if (result.success) {
//         sessionStorage.setItem("user", JSON.stringify({ username: result.username, token: result.token }));
//       }
//       return response.data;
//     });
// };

// export const authHeader = () => {
//   const token = sessionStorage.getItem('token');
//   if (token) {
//     return { 'Authorization': 'Bearer ' + token };
//   } else {
//     return {};
//   }
// };

export const authHeader = (token) => {
  if (token) {
    return { 'Authorization': 'Bearer ' + token };
  } else {
    return {};
  }
};

// export const logout = () => {
//   // sessionStorage.removeItem('employeeId');
//   // sessionStorage.removeItem('name');
//   // sessionStorage.removeItem('emailId');
//   // sessionStorage.removeItem('role');
//   // sessionStorage.removeItem('token');
// };