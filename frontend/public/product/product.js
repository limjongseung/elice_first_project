import { formatPrice } from "/frontend/public/common/global-function.js";
//params가져오기
const url =
	"https://port-0-elice-first-project-backend-12fhqa2llo78zgu7.sel5.cloudtype.app/";
const url_local = "http://localhost:3000/";
function getQueryParam(name) {
	const urlSearchParams = new URLSearchParams(window.location.search);
	return urlSearchParams.get(name);
}


const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", function (event) {
    const targetProduct = event.target.closest(".product_wrap");
    if (targetProduct) {
        const shortId = targetProduct.dataset.shortid;
		const productUrl = `/frontend/public/product_detail/product_detail.html?shortid=${shortId}`;
		window.location.href = productUrl;
    }
});
async function renderProduct(productData) {
	const productContainer = document.getElementById("productContainer");
	productData.map((item) => {
		item.price = formatPrice(item.price);
		productContainer.innerHTML += `
        <div data-shortid=${item.shortId} class="product_wrap" >
        <img src="${url_local}product/imgs/${item.img}" alt="${item.name}">
        <h4 class="product_name">${item.name}</h4>
  <p class="product_name"> ${item.price}원</p>
`;
	});
}
async function getProduct(productId) {
	try {
		let res;

		if (productId == "전체") {
            res = await fetch(`${url_local}product`);
        } else {
            res = await fetch(`${url_local}product?categoryShortId=${productId}`);
        }

		const data = await res.json();
		console.log(data);
		await renderProduct(data);
	} catch (error) {
		console.error(`Error fetching product data: ${error}`);
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

$(".ad_section").slick({
	infinite: true,
	autoplay: true,
	autoplaySpeed: 2000,
	fade: true,
	speed: 500,
	cssEase: "linear",
});
