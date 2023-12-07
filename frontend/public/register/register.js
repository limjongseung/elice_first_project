import { sendPostRequest } from "../api/api.js";

const terms = document.querySelector("#terms");
const termClick = document.querySelector("#agree");

terms.addEventListener("click", () => {
	console.log("showhide");
	showHide();
});

function showHide() {
	if (termClick.style.display == "block") {
		termClick.style.display = "none";
	} else if (termClick.style.display == "none") {
		termClick.style.display = "block";
	}
}

const nameInput = document.querySelector("#name");
const mobileInput = document.querySelector("#mobile");
const phoneInput = document.querySelector("#phone");

const zipcodeInput = document.querySelector("#zipcode");
const addressInput = document.querySelector("#address");

const emailInput = document.querySelector("#email");
const nicknameInput = document.querySelector("#nickname");
const passwordInput = document.querySelector("#password1");
const password2Input = document.querySelector("#password2");

const infoCheckInput = document.querySelector("#info-ok");
const trdCheckInput = document.querySelector("#third-ok");

const button = document.getElementById("buttonId");
button.addEventListener("click", register);

// function sendPostRequest(url, data) {
// 	return fetch(url, {
// 		method: "POST",
// 		headers: {
// 			authorization: `bearer ${localStorage.getItem("accessToken")}`,
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(data),
// 	  })
//   	.then((response) => {
      
// 			if (!response.ok) {
//         

// 				throw new Error("err", err);
// 			}
// 			return response.json();
// 		})
// 		.catch((error) => {
      
//       alert(`문제가 발생했습니다. 다시 시도해주세요`);
// 			throw new Error(
// 				"There was a problem with the POST request:",
// 				error
// 			);
// 		});
// }

async function register(e) {
	e.preventDefault();

	const name = nameInput.value;
  const mobile = mobileInput.value;
	const phone = phoneInput.value;

	const zipcode = zipcodeInput.value;
	const address = addressInput.value;

	const email = emailInput.value;
	const nickname = nicknameInput.value;
	const password = passwordInput.value;
	const password2 = password2Input.value;

	const infoCheck = infoCheckInput;
	const trdCheck = trdCheckInput;

	if (!name) {
		return alert("이름을 입력해주세요");
	}

	if (!/^\d{3}\d{4}\d{4}$/.test(mobile)) {
		return alert("휴대폰 번호는 11자리입니다.");
	}

	if (!/^\d{2,3}\d{3,4}\d{4}$/.test(phone)) {
		return alert("전화번호는 9-11자리로 해 주세요.");
	}

	if (zipcode.length !== 5) {
		return alert("우편번호는 5자리 숫자입니다.");
	}

	if (!address) {
		return alert("주소를 입력해주세요");
	}

	if (!/^\S+@\S+\.\S+$/.test(email)) {
		return alert("이메일 형식이 올바르지 않습니다.");
	}

	if (nickname.length < 2 || nickname.length > 9) {
		return alert("닉네임은 2~8글자로만 설정이 가능합니다");
	}

	if (password.length < 4) {
		return alert("최소 4자리 이상의 비밀번호를 설정 해 주세요");
	}

	if (password != password2) {
		return alert("비밀번호 확인이 일치하지 않습니다");
	}

	if (!infoCheck.checked) {
		return alert("약관에 동의해주세요.");
	}

	if (!trdCheck.checked) {
		return alert("약관에 동의해주세요.");
	}
	try {
		const data = {
			email,
			name,
			nickname,
			password,
			address,
			zipcode,
			mobile, 
			phone,
		};
		await sendPostRequest(
			`http://kdt-sw-6-team04.elicecoding.com:3000/account`,
			data
		);

		alert("회원가입이 완료되었습니다.");

		window.location.href = "../login/login.html";
	} catch (e) {
		alert(
			`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
		);
		console.log();
	}
}
