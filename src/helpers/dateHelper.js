const convertTwoDigits = (n) => { 
  return (n < 10) ? '0' + n : n; 
}

export const getTodayDate = () => {
  const date = new Date();
  // Today's date in Format : yyyy-MM-dd
  return [date.getFullYear(), convertTwoDigits(date.getMonth() + 1), convertTwoDigits(date.getDate())].join('-');
}

export const getCurrentTime = () => {

}

export const formatDate = (mysqlDate) => {
  // 2021-02-08
  const arr = mysqlDate.split('-');
  return arr.reverse().join('-');
}

export const convertToDate = (str) => {
  // 2021-02-08
  const arr = str.split('-');
  const year = parseInt(arr[0]);
  const mth = parseInt(arr[1]);
  const day = parseInt(arr[2]);
  return new Date(year, mth, day);
}

export const convertUTCDateToLocalDate = (date) => {
  if(!date){
    return;
  }
  var newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));

  // var offset = date.getTimezoneOffset() / 60;
  // var hours = date.getHours();

  // newDate.setHours(hours - offset);

  // return newDate;
  return newDate.toISOString();
}