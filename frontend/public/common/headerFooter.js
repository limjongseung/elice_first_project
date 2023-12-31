// JavaScript 함수로 header를 생성
function createHeader() {
	// <header> 요소 생성
	const header = document.createElement("header");
	header.id = "header";

	// <ul> 요소 생성 (왼쪽)
	let leftUl = document.createElement("ul");
	leftUl.className = "header_left";

	// <li> 요소와 <a> 요소 생성 (두 번째 항목)
	let li2 = document.createElement("li");
	let a2 = document.createElement("a");
	a2.href = "../main/index.html";
	let img = document.createElement("img");
	img.src = "../img/hdex_logo.png";
	img.alt = "나이키 로고";
	a2.appendChild(img);
	li2.appendChild(a2);

	let centerUI = document.createElement("ul");
	centerUI.className = "center_ui";
	centerUI.id = "center_ui";

	// <ul> 요소 생성 (오른쪽)
	let rightUl = document.createElement("ul");
	rightUl.className = "header_right";

	// <li> 요소와 <a> 요소 생성 (세 번째 항목)
	let li3 = document.createElement("li");
	let a3 = document.createElement("a");
	a3.href = "../login/login.html"; //로그인 화면으로 이동
	li3.className = "signIn";
	let icon3 = document.createElement("i");
	// icon3.className = "fa-solid fa-right-to-bracket";
	a3.appendChild(icon3);
	a3.appendChild(document.createTextNode("Sign In"));
	li3.appendChild(a3);

	// <li> 요소와 <a> 요소 생성 (네 번째 항목)
	let li4 = document.createElement("li");
	let a4 = document.createElement("a");
	a4.href = "../cart/cart.html";
	let icon4 = document.createElement("i");
	// icon4.className = "fa-solid fa-cart-shopping";
	a4.appendChild(icon4);
	a4.appendChild(document.createTextNode("Cart"));
	li4.appendChild(a4);

	let li7 = document.createElement("li");
	let a7 = document.createElement("a");
	a7.href = "../mypage/mypage.html";
	let icon7 = document.createElement("i");
	// icon4.className = "fa-regular fa-user";
	a7.appendChild(icon7);
	a7.appendChild(document.createTextNode("My Page"));
	li7.appendChild(a7);
	// <li> 요소와 <a> 요소 생성 (다섯 번째 항목)
	let li5 = document.createElement("li");
	let a5 = document.createElement("a");
	a5.href = "../register/register.html";
	li5.className = "signUp";
	let icon5 = document.createElement("i");
	// icon5.className = "fa-solid fa-user";
	a5.appendChild(icon5);
	a5.appendChild(document.createTextNode("Sign Up"));
	li5.appendChild(a5);
	// <li> 요소와 <a> 요소 생성 (다섯 번째 항목)
	let li6 = document.createElement("li");
	li6.textContent = "logout";
	li6.id = "logout_btn";

	// 생성한 모든 요소들을 조합
	leftUl.appendChild(li2);
	rightUl.appendChild(li3);
	rightUl.appendChild(li4);
	rightUl.appendChild(li7);
	rightUl.appendChild(li5);
	rightUl.appendChild(li6);
	header.appendChild(leftUl);
	header.appendChild(centerUI);
	header.appendChild(rightUl);
	// 생성한 모든 요소들을 조합
	leftUl.appendChild(li2);
	// header.appendChild(centerUi)
	header.appendChild(rightUl);
	document.body.prepend(header);
}
createHeader();
//center UI 랜더링

const url_local = "http://localhost:3000/";
const url =
	"https://port-0-elice-first-project-backend-12fhqa2llo78zgu7.sel5.cloudtype.app/";
async function navigateToCategory(categoryShortId) {
	try {
		if (categoryShortId === "전체") {
			const productUrl = `/frontend/public/product/?id=${categoryShortId}`;
			window.location.href = productUrl;
			const res = await fetch(
				`${url}product`
			);
			const categoryData = await res.json();
			console.log(categoryData);
		}
		const productUrl = `/frontend/public/product/?id=${categoryShortId}`;
		window.location.href = productUrl;
		const res = await fetch(
			`${url}product?categoryShortId=${categoryShortId}`
		);
		const categoryData = await res.json();
		console.log(categoryData);
	} catch (error) {
		console.error(
			`카테고리 데이터를 불러오는 중 오류가 발생했습니다: ${error}`
		);
	}
}

async function getCategory() {
	try {
		const res = await fetch(`${url}category`);
		const data = await res.json();
		console.log(data);

		const centerUiEle = document.getElementById("center_ui");
		centerUiEle.innerHTML = `<li><a href="#" onClick="navigateToCategory('전체')">All</a></li>`;

		data.map((item) => {
			centerUiEle.innerHTML += `
            <li><a href="#" onClick="navigateToCategory('${item.shortId}')">${item.name}</a></li>`;
		});

		return data;
	} catch (e) {
		console.error(e);
	}
}

getCategory();

// JavaScript 함수로 footer를 생성
function createFooter() {
	// <footer> 요소 생성
	let footer = document.createElement("footer");
	footer.id = "footer";

	// <div> 요소 생성 (footer_container)
	let containerDiv = document.createElement("div");
	containerDiv.className = "footer_container";

	// <div> 요소와 텍스트 생성 (footer_head)
	let headDiv = document.createElement("div");
	headDiv.className = "footer_head";
	headDiv.textContent = "대한민국 2023 Nike, Inc, All Rights Reserved";

	// <div> 요소와 텍스트 생성 (footer_body)
	let bodyDiv = document.createElement("div");
	bodyDiv.className = "footer_body";
	bodyDiv.textContent =
		"(유)나이키코리아 대표 킴벌리 린 창 멘데스 | 서울 강남구 테헤란로 152 강남파이낸스 센터 30층 |";

	// 다른 <div> 요소와 텍스트들을 생성 (필요에 따라 추가)

	// 생성한 모든 요소들을 조합
	containerDiv.appendChild(headDiv);
	containerDiv.appendChild(bodyDiv);
	// 다른 <div> 요소들을 containerDiv에 추가

	footer.appendChild(containerDiv);

	// 생성한 <footer> 요소를 문서에 추가
	document.body.appendChild(footer);
}

// createFooter 함수 호출
createFooter();
function clearLocalStorageAndRedirect() {
	localStorage.clear();
	alert("로그아웃 되었습니다.");
	window.location.href = "../main/index.html";
}

const logoutBtn = document.getElementById("logout_btn");

logoutBtn.addEventListener("click", () => {
	clearLocalStorageAndRedirect();
});

function isLoggedIn() {
	const token = localStorage.getItem("accessToken"); // JWT token
	const signIn = document.querySelector(".signIn");
	const signUp = document.querySelector(".signUp");
	const logoutBtn = document.querySelector("#logout_btn");

	if (!token) {
		logoutBtn.classList.add("hidden");
		signIn.classList.remove("hidden");
		signUp.classList.remove("hidden");
	} else if (token) {
		signIn.classList.add("hidden");
		signUp.classList.add("hidden");
		logoutBtn.classList.remove("hidden");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	isLoggedIn();
});
