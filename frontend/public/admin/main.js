import {
	sendGetRequest,
	sendPostRequest,
	sendDeleteRequest,
	sendPostCategoryModiRequest,
} from "../api/api.js";
// import{
// 	post,
// 	deleteAccount
// } from '/shopping_project_4team/frontend/public/api/userapi.js'
//url 설정
const url = "https://port-0-elice-first-project-backend-12fhqa2llo78zgu7.sel5.cloudtype.app/";
const url_local = "http://localhost:3000/"
// html element 가져오기

// 사이드 메뉴 html element
const categoryBtn = document.getElementById("category_manage");
const productBtn = document.getElementById("product_maange");
const deliveryBtn = document.getElementById("order_mange");
// 카테고리 추가 버튼 html element
const categoryAddBtn = document.getElementById("category_add_btn");
// 카테고리 수정 버튼
const categoryModiBtn = document.getElementById("modi_btn");
// 카테고리 수정 shortId , 수정할 text input html
// 카테고리 수정 버튼의 경우에는 전역처리되어 이벤트에서 쓰일 일이 있기 때문에 밖에서 선언
const modiInputId = document.getElementById("modi_input_id");
const modiInputName = document.getElementById("modi_input_name");

// 상품 html elements
const selectProductDelteBtn = document.getElementById(
	"select_product_delte_btn"
);

//섹센별 html element
const categorySection = document.getElementById("category_section");
const productSection = document.getElementById("product_section");
const deliverSection = document.getElementById("deliver_section");
const productListContent = document.getElementById("product_list");

//  카테고리 관리와 상품관리를 누르면 화면이 바뀌는 click event
categoryBtn.addEventListener("click", function (e) {
	productSection.classList.add("dp_none");
	categorySection.classList.remove("dp_none");
	// deliverSection.classList.add("dp_none");
});
productBtn.addEventListener("click", function (e) {
	productSection.classList.remove("dp_none");
	categorySection.classList.add("dp_none");
	// deliverSection.classList.add("dp_none");
});
deliveryBtn.addEventListener("click", function () {
	productSection.classList.add("dp_none");
	categorySection.classList.add("dp_none");
	// deliverSection.classList.remove("dp_none");
});

// fetch API를 사용하여 카테고리 GET 요청 보내기
// 삭제시 조회 랜더링 , 수정시, 추가시 필요하기에 함수로 변환
const categoryGetFunction = async () => {
	try {
		const data = await sendGetRequest(`${url}category`);
		const categoryList = document.getElementById("category_content");
		categoryList.innerHTML = ""; // 이전 내용을 지우고 다시 채우기

		const deleteRequests = data.map(async (item) => {
			const itemElement = document.createElement("div");
			itemElement.className = "dp_flex";
			itemElement.innerHTML = `
		  <div class="category_list_content_checkbox" data-shortid='${item.shortId}'>${item.name}</div> 
		  <div class="button is-danger category-delete-btn" data-shortid='${item.shortId}'>삭제</div>
		`;

			const deleteButton = itemElement.querySelector(
				".category-delete-btn"
			);
			const categoryListItem = itemElement.querySelector(
				".category_list_content_checkbox"
			);

			categoryListItem.addEventListener("click", () => {
				// 카테고리 수정 shortId , 수정할 text input html
				modiInputId.value =
					categoryListItem.getAttribute("data-shortid");
				modiInputName.value = categoryListItem.innerHTML;
			});

			deleteButton.addEventListener("click", async () => {
				const shortId = deleteButton.getAttribute("data-shortid");
				const url = `${url}category/${shortId}`;
				try {
					await sendDeleteRequest(url);
					await categoryGetFunction();
				} catch (error) {
					console.error("Error:", error);
				}
			});

			categoryList.appendChild(itemElement);
		});

		await Promise.all(deleteRequests); // 모든 삭제 요청 병렬로 처리
	} catch (error) {
		// 오류 처리
		console.error("Error", error);
	}
};

// 조회 함수 호출 (초기에 한 번만 호출)
categoryGetFunction();

//카테고리 버튼을 통한 post 요청
categoryAddBtn.addEventListener("click", async function () {
	const categoryInput = document.getElementById("category_input");
	const url_cate = `${url}category`;
	const categoryName = categoryInput.value;
	await sendPostRequest(url_cate, { name: categoryName })
		.then((responseData) => {})
		.catch((error) => {
			console.error("Error:", error);
		});
	categoryGetFunction();
	//  input창 초기화
	categoryInput.value = "";
});

// 수정 버튼을 통한 카테고리명 수정  요청
categoryModiBtn.addEventListener("click", async function () {
	const url = `${url}category/${modiInputId.value}`;

	try {
		await sendPostCategoryModiRequest(url, { name: modiInputName.value });
		await categoryGetFunction();

		// input 창 초기화
		modiInputId.value = "";
		modiInputName.value = "";

		// 카테고리 데이터 다시 불러오기
	} catch (err) {
		console.error("Error:", err);
	}
});

//상품리스트 랜더링 함수
const productGetFunction = (id) => {
	sendGetRequest(`${url}product?categoryShortId=${id}`)
		.then((data) => {
			productListContent.innerHTML = "";
			console.log(data);
			data.forEach((item) => {
				const productElement = document.createElement("div");
				productElement.className = "product_detail";
				productElement.setAttribute("data-shortid", item.shortId);
				const img_url = `${url}product/imgs/${item.img}`;
				productElement.innerHTML = `
								<div class="product_img_wrap">
									<img src="${img_url}" alt="">
								</div>
								<p class="product_name">${item.name}</p>
								<p class="product_company">${item.company}</p>
								<p class="product_price">${item.price}</p>
								<!---<button class='button is-danger'>삭제</button> -->
				`;
				productListContent.appendChild(productElement);
				//삭제를 위한 클릭 이벤트 상품을 클릭하게 되면 해당하는 shortid가 input으로 자동으로 기입
				productElement.addEventListener("click", () => {
					const productElementShortId =
						productElement.getAttribute("data-shortid");
					const deleteShortId =
						document.getElementById("delete_short_id");
					deleteShortId.value = productElementShortId;
				});
			});
		})
		.catch((error) => {
			// 오류 처리
			console.error("Error", error);
		});
};
// 상품 목록을 위한 카테고리 get요청 후 랜더링 함수 호출
const categoryListRender = async () => {
	try {
		const data = await sendGetRequest(`${url}category`);
		const productListHeaderCategory = document.querySelector(
			".product_list_header_category"
		);
		// 카테고리 get 요청한뒤 select도 함께 랜더링 되게 추가
		const categorySelect = document.getElementById("category_select");
		const categorySelectModi = document.getElementById("category_modi_select");

		data.forEach((item) => {
			const categoryElement = document.createElement("div");
			categoryElement.classList.add("product_list_category_list");
			categoryElement.setAttribute("data-shortid", item.shortId);
			categoryElement.textContent = item.name;
			// 카테고리select element 추가
			const categorySelectList = document.createElement("option");
			categorySelectList.setAttribute("data-shortid", item.shortId);
			categorySelectList.textContent = item.name;
			// 카테고리 요소에 클릭 이벤트 리스너 추가
			categoryElement.addEventListener("click", () => {
				// 클릭된 카테고리에 대한 작업 수행
				productGetFunction(item.shortId);
			});
			categorySelect.appendChild(categorySelectList);
			productListHeaderCategory.appendChild(categoryElement);
		});
	} catch (error) {
		// 오류 처리
		console.error("Error", error);
	}
};
// get한 데이터 카테고리 랜더링
categoryListRender();

// 버튼 요소와 폼 요소
// 상품 추가 form 버튼
const productFormBtn = document.getElementById("product_form_btn");
const productForm = document.getElementById("product_form"); // 폼 요소의 ID를 지정해야 합니다.

let formData = new FormData();
// FormData 객체를 생성합니다.

// 옵션 선택이 변경될 때마다 FormData를 업데이트합니다.
document
	.getElementById("category_select")
	.addEventListener("change", function () {
		const selectedOption = this.options[this.selectedIndex];
		const shortId = selectedOption.getAttribute("data-shortid");
		formData.set("categoryShortId", shortId); // 선택한 카테고리의 shortId를 업데이트합니다.
	});

// 폼데이터 전송 버튼 클릭 이벤트  상품등록을 위한 api post 요청
productFormBtn.addEventListener("click", async () => {
	// 나머지 폼 필드의 데이터를 FormData에 추가합니다.
	formData.set("name", document.getElementById("form_add_name").value);
	formData.set("price", document.getElementById("form_add_price").value);
	formData.set("company", document.getElementById("form_add_company").value);
	formData.set(
		"description",
		document.getElementById("form_add_description").value
	);
	formData.set(
		"thumbnail",
		document.getElementById("form_add_thumbnail").files[0]
	);
	formData.set("img", document.getElementById("form_add_img").files[0]);

	console.log("  formData.has(name)", formData.has("name"));
	try {
		// POST 요청
		const response = await fetch(`${url}product`, {
			method: "POST",
			headers: {
				authorization: `bearer ${localStorage.getItem("accessToken")}`
			},
			body: formData,
		});
		// const data = await response.json();
		// console.log(data);
		alert('상품추가 완료')
	} catch (error) {
		console.error(error);
	}
});

//상품삭제 api
selectProductDelteBtn.addEventListener("click", async () => {
	try {
		const deleteShortId = document.getElementById("delete_short_id");
		await sendDeleteRequest(`${url}product/${deleteShortId.value}`);
		deleteShortId.value = '';
	} catch (error) {
		console.log(error);
	}
});
