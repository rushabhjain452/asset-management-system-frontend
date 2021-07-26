const convertTwoDigits = (n) => {
  try {
    if (n) {
      return (n < 10) ? '0' + n : n;
    }
    else {
      return '';
    }
  }
  catch (err) {
    return n;
  }
}

export const getTodayDate = () => {
  try {
    const date = new Date();
    // Today's date in Format : yyyy-MM-dd
    return [date.getFullYear(), convertTwoDigits(date.getMonth() + 1), convertTwoDigits(date.getDate())].join('-');
  }
  catch (err) {
    return new Date();
  }
}

export const getCurrentTime = () => {

}

export const formatDate = (mysqlDate) => {
  try {
    if (mysqlDate) {
      // 2021-02-08
      const arr = mysqlDate.split('-');
      return arr.reverse().join('-');
    }
    else {
      return '';
    }
  }
  catch (err) {
    return '';
  }
}

export const convertToDate = (str) => {
  try {
    if (str) {
      // 2021-02-08
      const arr = str.split('-');
      const year = parseInt(arr[0]);
      const mth = parseInt(arr[1]) - 1;
      const day = parseInt(arr[2]);
      return new Date(year, mth, day);
    }
    else {
      return new Date();
    }
  }
  catch (err) {
    return new Date();
  }
}

export const calDateDiff = (startDate, endDate) => {
  try {
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let diffDays = (endDate.getTime() - startDate.getTime()) / oneDay;
    diffDays = diffDays + 1;
    // console.log(diffDays);
    if (diffDays < 0) {
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
  catch (err) {
    return '0 years 0 months 0 days';
  }
}

export const convertUTCDateToLocalDate = (date) => {
  try {
    if (!date) {
      return;
    }
    var newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));

    // var offset = date.getTimezoneOffset() / 60;
    // var hours = date.getHours();

    // newDate.setHours(hours - offset);

    // return newDate;
    return newDate.toISOString();
  }
  catch (err) {
    return new Date().toISOString();
  }
}