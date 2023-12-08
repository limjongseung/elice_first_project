import {
	sendGetRequest,
	sendPostRequest,
	sendDeleteRequest,
} from "../api/api.js";
import{
    formatPrice
} from '../common/global-function.js'
const url = "http://localhost:3000/";
// url로 가기
const moveToPath=(path)=>{
    window.location.href = `../product_detail/product_detail.html?shortid=${path}`
}
//상품목록 랜더링 함수
const productGetFunction = async (id) => {
    if(!id){
          const data = await sendGetRequest(`${url}product`);
    const contentSectionBody = document.getElementById('contentSectionBody');
    contentSectionBody.innerHTML = '';

    data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'content_shoes';
        const itemPrice = formatPrice(item.price)
        itemElement.innerHTML = `
        <div data-shortid='${item.shortId}' class='content_shoes_detail'>
            <img
                src="${url}product/imgs/${item.img}"
                alt="${item.description}"
            />
        </div>
        <p class="shoes_title">${item.name}</p>
        <p class="shoes_price">${itemPrice} 원</p>`;

        contentSectionBody.appendChild(itemElement);

        // 각 항목에 클릭 이벤트 리스너 추가
        itemElement.addEventListener('click', function () {
            moveToPath(item.shortId);
        });
    });
    }
    const data = await sendGetRequest(`${url}product?categoryShortId=${id}`);
    const contentSectionBody = document.getElementById('contentSectionBody');
    contentSectionBody.innerHTML = '';

    data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'content_shoes';
        const itemPrice = formatPrice(item.price)
        itemElement.innerHTML = `
        <div data-shortid='${item.shortId}' class='content_shoes_detail'>
            <img
                src="${url}product/imgs/${item.img}"
                alt="${item.description}"
            />
        </div>
        <p class="shoes_title">${item.name}</p>
        <p class="shoes_price">${itemPrice} 원</p>`;

        contentSectionBody.appendChild(itemElement);

        // 각 항목에 클릭 이벤트 리스너 추가
        itemElement.addEventListener('click', function () {
            moveToPath(item.shortId);
        });
    });
};


// 카테고리 랜더링
// 관련한 상품 랜더링
async function categoryRendering() {
    try {
        const data = await sendGetRequest(`${url}category`);
        const categoryList = document.getElementById("category_list");
        let currentFocusedItem = null; // 현재 초점이 맞춰진 항목을 추적하는 변수

        // "전체" 항목을 만듭니다.
        const allCategoryElement = document.createElement("div");
        allCategoryElement.className = "category_list_item";
        allCategoryElement.innerText = "전체";
        categoryList.appendChild(allCategoryElement);
        allCategoryElement.addEventListener('click',()=>{
            productGetFunction();
        })


        data.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "category_list_item";
            itemElement.innerText = item.name;
            itemElement.setAttribute("data-shortid", item.shortId);
            categoryList.appendChild(itemElement);

            itemElement.addEventListener("click", () => {
                // 이전에 초점이 맞춰진 항목에서 'focus' 클래스를 제거합니다.
                if (currentFocusedItem) {
                    currentFocusedItem.classList.remove('focus');
                }

                // 클릭한 항목에 'focus' 클래스를 추가
                itemElement.classList.add('focus');
                currentFocusedItem = itemElement; // 현재 초점이 맞춰진 항목을 업데이트합니다.

                productGetFunction(item.shortId);
            });
        });
    } catch (error) {
        console.error(error);
    }
}


categoryRendering();
// slick slider script 
$(".ad_section").slick({
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
});
// 이미지 애니메이션
const imageContainer = document.querySelector('.image-container');

window.addEventListener('scroll', () => {
    const scrollValue = window.scrollY;
    imageContainer.style.transform = `translateX(-${scrollValue}px)`;
});




