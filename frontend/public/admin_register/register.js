import { sendPostRequest } from "/shopping_project_4team/frontend/public/api/api.js";

const nameInput = document.querySelector('#name')
const phoneInput = document.querySelector('#phone')
const mobileInput = document.querySelector('#mobile')


const emailInput = document.querySelector('#email')
const nicknameInput = document.querySelector('#nickname')
const passwordInput = document.querySelector('#password1')
const password2Input = document.querySelector('#password2')
const name = nameInput.value;
const phone = phoneInput.value;
const mobile = mobileInput.value;

const email = emailInput.value;
const nickname = nicknameInput.value;
const password = passwordInput.value;
const password2 = password2Input.value;

const button = document.getElementById('buttonId');
const url = 'http://kdt-sw-6-team04.elicecoding.com:3000/'
// 유효성 검사 함수
function Validcheck() {
  if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
    alert("전화번호를 확인해 주세요.");
    return false;
  }

  if (!/^\d{3}-\d{3,4}-\d{4}$/.test(mobile)) {
    alert("휴대폰 번호를 확인해 주세요.");
    return false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert('이메일 형식이 올바르지 않습니다.');
    return false;
  }

  if (password.length < 4) {
      alert("최소 4자리 이상의 비밀번호를 설정 해 주세요");
      return false;
    }
  

  if(nickname.length<2 || nickname.length<9){
    alert('닉네임은 2~8글자로만 설정이 가능합니다')
    return false;
  }

  if (password != password2) {
    alert('비밀번호 확인이 일치하지 않습니다');
    return false;
  }
  return true;
}

function existCheck(){



  if (!password || !password2) {
    alert('비밀번호를 입력해주세요.');
    return false;
  }

  if (!nickname) { 
    alert('닉네임을을 입력해주세요') ;
    return false;
  }
}


async function register(e) {

  e.preventDefault
  // existCheck()
  // Validcheck()
  const data = JSON.stringify({ email, name, nickname, password, mobile, phone });
  try{
      await sendPostRequest(`${url}admin`, data)
      alert('회원가입이 완료되었습니다.')
      window.location.href = "/account/login";
  }catch(error){
    console.log(error)
    // alert('다시 시도해 주세요');
  }
}

  
  button.addEventListener('click', register)


