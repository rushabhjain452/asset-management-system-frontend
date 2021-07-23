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
  const mth = parseInt(arr[1]) - 1;
  const day = parseInt(arr[2]);
  return new Date(year, mth, day);
}

export const calDateDiff = (startDate, endDate) => {
  let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  let diffDays = (endDate.getTime() - startDate.getTime()) / oneDay;
  console.log(diffDays);
  if(diffDays < 0){
    return '0 years 0 months 0 days';
  }
  // Convert days to years and months
  let years = parseInt(diffDays / 365);
  diffDays = diffDays % 365;
  let months = parseInt(diffDays / 30);
  diffDays = diffDays % 30;
  let days = diffDays;
  return years + ' years ' + months + ' months ' + days + ' days';
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