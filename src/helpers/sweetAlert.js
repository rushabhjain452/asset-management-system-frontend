import Swal from 'sweetalert2';

export const showSweetAlert = (status, title, msg) => {
  Swal.fire({
    title: title,
    text: msg,
    icon: status,
    confirmButtonColor: '#3085d6'
  });
};

export const showConfirmAlert = (title, msg) => {
  return Swal.fire({
    title: title,
    text: msg,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ok'
  });
};

export const showToast = (status, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  Toast.fire({
    icon: status,
    title: title
  });
};

export const showToastWithProgress = (status, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  Toast.fire({
    icon: status,
    title: title
  });
};