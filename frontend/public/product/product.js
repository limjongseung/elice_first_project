import { formatPrice } from "/frontend/public/common/global-function.js";
//params가져오기
const url =
	"https://port-0-elice-first-project-backend-12fhqa2llo78zgu7.sel5.cloudtype.app/";
const url_local = "http://localhost:3000/";
function getQueryParam(name) {
	const urlSearchParams = new URLSearchParams(window.location.search);
	return urlSearchParams.get(name);
}
let productData;
let itemsPerPage = 8;
// 페이지 변경을 처리하는 함수
	window.changePage = function (newPage) {
		renderProduct(productData, itemsPerPage, newPage);
	
		// 현재 페이지의 버튼에 'current' 클래스 추가
		$("#paginationContainer button").removeClass("current");
		$(`#paginationContainer button:nth-child(${newPage})`).addClass("current");
	};

const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", function (event) {
	const targetProduct = event.target.closest(".product_wrap");
	if (targetProduct) {
		const shortId = targetProduct.dataset.shortid;
		const productUrl = `/frontend/public/product_detail/product_detail.html?shortid=${shortId}`;
		window.location.href = productUrl;
	}
});
async function renderProduct(productData, itemsPerPage, currentPage) {
	const productContainer = document.getElementById("productContainer");
  
	// 현재 페이지에 표시될 아이템의 시작 및 끝 인덱스를 계산합니다.
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
  
	// 현재 페이지에 표시할 데이터의 배열을 얻기 위해 productData 배열을 슬라이스합니다.
	const currentPageData = productData.slice(startIndex, endIndex);
  
	// 새로운 아이템을 렌더링하기 전에 productContainer를 지웁니다.
	productContainer.innerHTML = "";
  
	// 현재 페이지에 대한 아이템을 렌더링합니다.
	currentPageData.forEach((item) => {
	  item.price = formatPrice(item.price);
	  productContainer.innerHTML += `
		  <div data-shortid=${item.shortId} class="product_wrap" >
			<img src="${url_local}product/imgs/${item.img}" alt="${item.name}">
			<h4 class="product_name">${item.name}</h4>
			<p class="product_name">${item.price}원</p>
		  </div>
	  `;
	});
  
	// 페이지네이션 제어(다음/이전 버튼)를 추가합니다.
	const totalPages = Math.ceil(productData.length / itemsPerPage);
	renderPaginationControls(currentPage, totalPages);
  }
function renderPaginationControls(currentPage, totalPages) {
	const paginationContainer = document.getElementById("paginationContainer");

	// 새로운 제어를 렌더링하기 전에 paginationContainer를 지웁니다.
	paginationContainer.innerHTML = "";

	// 이전 버튼을 렌더링합니다.
	if (currentPage > 1) {
		paginationContainer.innerHTML += `<button onclick="changePage(${
			currentPage - 1
		})">이전</button>`;
	}

	// 페이지 번호를 렌더링합니다.
	for (let i = 1; i <= totalPages; i++) {
		paginationContainer.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
	}

	// 다음 버튼을 렌더링합니다.
	if (currentPage < totalPages) {
		paginationContainer.innerHTML += `<button onclick="changePage(${
			currentPage + 1
		})">다음</button>`;
	}
}


async function getProduct(productId) {
	try {
		let res;

		if (productId == "전체") {
			res = await fetch(`${url_local}product`);
		} else {
			res = await fetch(`${url_local}product?categoryShortId=${productId}`);
		}

		// 전역 변수인 productData에 결과를 할당
		productData = await res.json();
		await renderProduct(productData, itemsPerPage, 1);
	} catch (error) {
		console.error(`상품 데이터를 가져오는 중 오류 발생: ${error}`);
	}
}
// Function to render product information

// DOM이 완전히 로드된 후에 실행되도록 설정
document.addEventListener("DOMContentLoaded", function () {
	// URL에서 상품 ID를 가져오기
	const productId = getQueryParam("id");
	// 상품 데이터 가져오기 및 렌더링
	getProduct(productId);
});

document.addEventListener("DOMContentLoaded", function () {
	const shortId = getQueryParam("id");

	async function getCategory() {
		try {
			const data = await fetch(`${url_local}category`);
			const res = await data.json();
			// Corrected the comparison to use === for strict equality
			const filteredCategory = res.filter((item) => item.shortId === shortId);
			const productName = document.getElementById("product_name");
			productName.innerText = filteredCategory[0].name;
		} catch (e) {
			console.log(e);
		}
	}

	getCategory();
});
// $("#paginationContainer button").on("click",function(){
// 	$(this).addClass("current");
// })
$(".ad_section").slick({
	infinite: true,
	autoplay: true,
	autoplaySpeed: 2000,
	fade: true,
	speed: 500,
	cssEase: "linear",
});
