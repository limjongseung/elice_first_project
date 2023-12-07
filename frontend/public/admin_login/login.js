import { sendPostRequest } from "../api/api.js";

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const buttonSubmit = document.getElementById("buttonId");
const url = "http://kdt-sw-6-team04.elicecoding.com:3000/";

buttonSubmit.addEventListener("click", login);

function validCheck() {
	if (!/^\S+@\S+\.\S+$/.test(emailInput)) {
		return alert("이메일 형식이 올바르지 않습니다.");
	}

	if (passwordInput.length < 4) {
		return alert("최소 4자리 이상의 비밀번호를 설정 해 주세요");
	}
}

async function login(e) {
	e.preventDefault();

	const email = emailInput.value;
	const password = passwordInput.value;

	// validCheck();

	const data = {
		email,
		password,
	};

	await sendPostRequest(`${url}admin/login`, data)
		.then(async (res) => {
			const responseBody = await res;
			const { accessToken, refreshToken } = responseBody;

			localStorage.setItem("accessToken", accessToken);
			sessionStorage.setItem("refreshToken", refreshToken);

			alert("로그인 완료");

			window.location.href = "../admin/index.html";
		})
		.catch((e) => {
			console.log(e);
		});
}
