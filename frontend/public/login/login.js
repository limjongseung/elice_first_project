import { sendPostRequest } from "../api/api.js";

const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const buttonSubmit = document.getElementById('buttonId')

buttonSubmit.addEventListener('click', login)

function validCheck() {
  if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
    return alert('이메일 형식이 올바르지 않습니다.');
  }

  if (passwordInput.value.length < 4) {
    return alert("최소 4자리 이상의 비밀번호를 설정 해 주세요");
  }
}

async function login(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  console.log(email)

  validCheck();

  const data = {
    email,
    password,
  };

try {
  
  const returnToken = await sendPostRequest(`http://kdt-sw-6-team04.elicecoding.com:3000/account/login`, data)
  const { accessToken, refreshToken } = returnToken;

  localStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);

  alert('로그인 완료');
  window.location.href = "../main/";

  } catch (e) {
    console.log(e);
    alert('이메일이나 비밀번호가 틀렸습니다')
  }
}

//const url = '/account/login'
//const formData = new FormData();
//formData.append('email', email);
//formData.append('password', password);

//axios.post(url, JSON.stringify(formdata))
//  .then((response) => {
//    console.log(response);
//  })
//  .catch((error) => {
//    console.log(error);
//  });

//function fetpost(url,data){
//  fetch(url, {
//    method: 'POST',
//    headers: {'Content-type': 'application/json'},
//    body: JSON.stringify(data)
//    })
//  .then((res)=>{
//    return res.json()
//  })
//}
