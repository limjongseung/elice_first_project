import { getAccount, putAccount, deleteAccount } from "../api/userapi.js";
import { USER } from "../common/constants.js";
import { sideMenu } from "../common/components/mypagemenu.js";
import {
    validatePhoneNumber,
    validateMobileNumber,
} from "../common/global-function.js";
import { isLoginModal } from "../common/modal/mypageLoginCheck.js";

//회원정보 필드 및 버튼
const changeAccountInfo = document.querySelector(".changeAccountInfo"); //회원정보 변경 버튼
const nameField = document.querySelector("input[name=name]");
const emailField = document.querySelector("input[name=email]");
const phoneField = document.querySelector("input[name=phone]");
const mobileField = document.querySelector("input[name=mobile]");
const nicknameField = document.querySelector("input[name=nickname]");
const zipcodeField = document.querySelector("input[name=zipcode]");
const addressField = document.querySelector("input[name=address]");
const passwordField = document.querySelector("input[name=password]");
const emailHelpMessage = document.getElementById("emailHelpMessage"); //이메일 헬프 메시지
const phoneHelpMessage = document.getElementById("phoneHelpMessage"); //전화번호 헬프 메시지
const mobileHelpMessage = document.getElementById("mobileHelpMessage"); //휴대폰번호 헬프 메시지
const zipcodeHelpMessage = document.getElementById("zipcodeHelpMessage"); //우편번호 헬프 메시지

//기타 버튼 elements
const form = document.querySelector(".user_info");
const cancelBtn = document.querySelector(".cancelBtn");
const confirmBtn = document.querySelector(".confirmBtn");

isLoggedIn();
loadProfile();
sideMenu();

//사용자 데이터를 서버에서 받아 화면에 보여주기
async function loadProfile() {
    const userData = await getAccount("/account");
    console.log("유저 데이터", userData);

    //유저 DB를 전역으로 사용하기 위해 Class 생성 (유저ID 사용하기 위함)
    USER.setUser(userData);

    nameField.value = userData.name;
    emailField.value = userData.email;
    phoneField.value = userData.phone;
    zipcodeField.value = userData.zipcode;
    mobileField.value = userData.mobile;
    addressField.value = userData.address;
    nicknameField.value = userData.nickname;
}

//회원정보 벼경 버튼 클릭시 모든 input 요소에서 'disabled' 속성 제거
function modifyAccount() {
    document.querySelectorAll("input:not(.email)").forEach((el) => {
        el.removeAttribute("disabled");
        emailField.classList.add("custom_disabled");
        emailHelpMessage.style.display = "block";
    });

    //수정 버튼 숨기고 확인/취소 버튼 표시
    confirmBtn.classList.remove("is-hidden");
    cancelBtn.classList.remove("is-hidden");
    changeAccountInfo.classList.add("is-hidden");
    passwordField.classList.remove("is-hidden"); //비밀번호 인풋 필드 표시
}

//유저 이메일은 변경할 수 없다는 메시지 표시
emailField.addEventListener("click", function () {
    emailHelpMessage.style.display = "block";
});

//휴대폰번호 충족조건 메시지 표시
phoneField.addEventListener("click", function () {
    phoneHelpMessage.style.display = "block";
});

//전화번호 충족조건 메시지 표시
mobileField.addEventListener("click", function () {
    mobileHelpMessage.style.display = "block";
});

//우편번호 충족조건 메시지 표시
zipcodeField.addEventListener("click", function () {
    zipcodeHelpMessage.style.display = "block";
});

//회원정보 수정 요청
async function handleSubmit(e) {
    e.preventDefault();
    console.log("USER CLASS", USER);

    try {
        //DB스키마에 맞게 입력됐는지 전화번호, 휴대폰번호 검증
        if (!validateMobileNumber(mobileField.value)) {
            alert("휴대폰 번호는 11자리입니다.");
            return;
        }
        if (!validatePhoneNumber(phoneField.value)) {
            alert("전화번호는 9-11자리로 해 주세요.");
            return;
        }

        const updatedData = {
            //id: USER.id, //유저 아이디는 USER 클래스에서 가져오기
            nickname: nicknameField.value,
            mobile: validateMobileNumber(mobileField.value),
            name: nameField.value,
            phone: validatePhoneNumber(phoneField.value),
            zipcode: parseInt(zipcodeField.value),
            address: addressField.value,
            password: passwordField.value, //서버로 PUT 요청할 때 비밀번호 필요 > 비밀번호를 같이 안보내면 알수없는 오류가 발생함
        };
        console.log(updatedData);

        //변경내용이 없으면 알럿 띄우고 함수 종료
        if (!isUpdated(updatedData)) {
            alert("변경된 정보가 없습니다.");
            location.reload();
            return;
        }

        USER.setUser(updatedData); //USER 전역변수 업데이트

        //유저정보 수정 api
        await putAccount("/account", updatedData);

        alert(`정상적으로 수정이 완료되었습니다.`);
        location.reload();
    } catch (err) {
        console.log(err);
        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요`);
        location.reload();
    }
}

//사용자가 수정한 항목이 있는지 확인하는 함수 > USER class에 저장된 정보와 비교하여 변경내용이 없다면 false 반환
function isUpdated(userData) {
    for (const key in userData) {
        if (USER.hasOwnProperty(key)) {
            if (USER[key] !== userData[key]) {
                return true;
            }
        }
    }
    return false;
}

//수정 취소 버튼
cancelBtn.addEventListener("click", () => {
    location.reload();
});

//비회원 확인
function isLoggedIn() {
    const token = localStorage.getItem("accessToken"); // JWT token
    if (!token) {
        isLoginModal();
    }
}

changeAccountInfo.addEventListener("click", modifyAccount); //회원정보 변경 버튼
form.addEventListener("submit", handleSubmit); //회원정보 변경 진행
