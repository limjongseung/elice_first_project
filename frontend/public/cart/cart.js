import {
    formatPrice,
    getCartLocalStorage,
    updateCartLocalStorage,
} from "../common/global-function.js";

//HTML element
const cartList = document.querySelector(".cart_table>tbody");
const productAmount = document.querySelector(".product_amount");
const totalPrice = document.querySelector("#total_price");
const deleteButton = document.querySelector(".delete_item_button");
const orderButton = document.querySelector(".order_button");
const emptyCartMsg = document.querySelector(".empty-cart-message");

// 로컬에서 상품정보 받아와서 카트 리스트 업데이트 하기
let CART_ITEMS = getCartLocalStorage();

renderCartList();
updateEmptyCartMessage(); //장바구니가 비어있으면 담긴 상품이 없다는 문구 표시

function renderCartList() {
    CART_ITEMS.map((item) => {
        const { name, img, price, totalQuantity, company, shortId: id } = item;
        const priceSum = formatPrice(totalQuantity * price); //상품별 총 합계금액
        const imgURL =
            "http://kdt-sw-6-team04.elicecoding.com:3000/product/imgs/";

        //!각 체크박스의 id 속성에 상품 shortID 설정
        cartList.insertAdjacentHTML(
            "beforeend",
            `<tr data-product-id="${id}">
                <td class="checkbox"><input id="${id}" type="checkbox" class="productCheckbox checkbox"></td>
                <td class="product_detail" id="product_detail">
                   
                        <img class="product_image "
                            src="${imgURL}${img}"
                            alt="상품이미지">
                    
                </td>
                <td class="product_name">
                    <p class="product_name">${name}</p>
                </td>
                <td class="product_count">
                    <i class="minusBtn fas fa-less-than"
                        onclick="import('./cart.js').then(module => module.minus(event, '${id}'))"></i>
                    <span id="${id}" class="product_count_value">${totalQuantity}</span>
                    <i class="plusBtn fas fa-greater-than"
                        onclick="import('./cart.js').then(module => module.plus(event, '${id}'))" ></i>
                </td>
                <td class="price">${formatPrice(price)}</td>
                <td class="shipping_fee">0</td>
                <td class="price_sum">${formatPrice(priceSum)}</td>
            </tr>`
        );
    });
    renderTotalPrice();
}

//결제정보(결제금액 합계) 업데이트하는 함수
export function renderTotalPrice() {
    const selectedCheckboxes = document.querySelectorAll(
        ".checkbox input:checked"
    ); //체크된 체크박스만 가져오기

    let sum = 0;

    //로컬에 저장된 상품정보를 사용해 총 합계금액을 계산하고 표시
    selectedCheckboxes.forEach((checkbox) => {
        const product = CART_ITEMS.find((item) => item.shortId == checkbox.id); //체크박스 id 속성으로 지정된 상품 shortID값 사용
        sum += product.price * product.totalQuantity;
    });

    productAmount.innerText = `${formatPrice(sum)} 원`; //총 상품금액
    totalPrice.innerText = `${formatPrice(sum)} 원`; //총 결제금액
}

// 장바구니 상품 수량 줄이기
export function minus(event, id) {
    let itemToUpdate = CART_ITEMS.find((item) => item.shortId == id);

    //로컬에 선택한 상품이 존재하지 않거나 수량이 1개인 경우 함수 종료
    if (!itemToUpdate || itemToUpdate.totalQuantity == 1) return;

    //상품 수량 1개 줄이기
    itemToUpdate.totalQuantity -= 1;

    //로컬 스토리지 업데이트
    updateCartLocalStorage(itemToUpdate);
    updateTotalSum(event, id);
}

//장바구니 상품 수량 증가시키기
export function plus(event, id) {
    let itemToUpdate = CART_ITEMS.find((item) => item.shortId == id);

    itemToUpdate.totalQuantity += 1;

    updateCartLocalStorage(itemToUpdate);
    updateTotalSum(event, id);
}

//수량 증감/감소에 따라 카트 리스트 업데이트
function updateTotalSum(event, id) {
    const product = CART_ITEMS.find((item) => item.shortId == id); //상품 shortID를 사용해 업데이트할 상품을 카트에서 찾기
    const targetElement = event.target.parentElement;
    console.log(targetElement);

    //총 수량 업데이트
    const totalCount = targetElement.querySelector(".product_count_value");
    totalCount.innerHTML = product.totalQuantity;

    //총 상품금액 업데이트
    const subTotal = targetElement.closest("tr").querySelector(".price_sum");
    subTotal.innerHTML = formatPrice(product.totalQuantity * product.price);

    //결제금액 합계 업데이트
    renderTotalPrice();
}

//장바구니 삭제 함수
function deleteItemFromCart() {
    const selectedCheckboxes = document.querySelectorAll(
        ".checkbox input:checked"
    );
    //console.log(selectedCheckboxes); //체크박스 nodelist

    //삭제할 상품 ID를 빈 배열에 담기
    const productsToDelete = [];
    selectedCheckboxes.forEach((checkbox) => {
        productsToDelete.push(checkbox.id);
        checkbox.closest("tr").remove(); //삭제상품 화면에서 없애기
    });

    // 삭제할 상품을 제외한 상품정보를 local storage에 저장
    CART_ITEMS = CART_ITEMS.filter(
        (item) => !productsToDelete.includes(item.shortId) //productsToDelete 배열에 담긴 id와 일치한 id가 없다면 true 반환
    );

    localStorage.setItem("cart", JSON.stringify(CART_ITEMS));
    updateEmptyCartMessage();

    checkboxes.forEach((checkbox) => {  //모든 체크박스를 true로 변환함 > 결제정보 업데이트를 위해
        checkbox.checked = true;
    });
    renderTotalPrice(); //결제정보 업데이트
}

//장바구니 상품수량 확인하는 함수 > 비어있으면 담긴 상품이 없다는 문구 표시
function updateEmptyCartMessage() {
    if (CART_ITEMS.length === 0) {
        emptyCartMsg.classList.remove("hidden");
    } else {
        emptyCartMsg.classList.add("hidden");
    }
}

//주문 진행
function submitOrder() {
    const selectedCheckboxes = document.querySelectorAll(
        ".checkbox input:checked"
    );

    //주문상품을 카트(local storage)에서 찾아와 빈 배열에 담기
    const orderItems = [];
    selectedCheckboxes.forEach((checkbox) => {
        const item = CART_ITEMS.find((item) => item.shortId == checkbox.id);
        if (item) orderItems.push(item);
    });

    if (orderItems.length == 0) {
        alert("결제할 상품이 없습니다");
        return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인해주세요");
        return;
    }

    localStorage.setItem("pendingOrder", JSON.stringify(orderItems)); //주문상품을 새로운 로컬에 저장

    //! 주문 페이지로 이동
    window.location.href = "../order/order.html";
}

//====== 체크박스 기능 ======//
const masterCheckbox = document.querySelector(".masterCheckbox");
const checkboxes = document.querySelectorAll(".productCheckbox");
//console.log(checkboxes); //nodelist

//전체 선택 기능 > 마스터가 checked된 상태라면 모든 체크박스를 checked 상태로 변경
function masterCheckboxToggle() {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = masterCheckbox.checked;
    });
    renderTotalPrice();
}

//마스터 체크박스 상태변경 함수 > 모든 체크박스가 checked된 경우 마스터도 checked 상태로 표시
function updateMasterCheckbox() {
    const allChecked = [...checkboxes].every((checkbox) => checkbox.checked); //모든 체크박스가 checked일 때 true 반환
    masterCheckbox.checked = allChecked;
    renderTotalPrice();
}

//모든 체크박스에 이벤트 리스너 달기 > 마스터 체크박스 상태값이 바뀌어야하는지 확인하기 위함
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", updateMasterCheckbox);
});

//페이지에 처음 진입시 모든 체크박스를 checked로 표시
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".productCheckbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
    });
    updateMasterCheckbox();
});

masterCheckbox.addEventListener("click", masterCheckboxToggle); //전체선택 체크박스
orderButton.addEventListener("click", submitOrder); //주문하기 버튼
deleteButton.addEventListener("click", deleteItemFromCart); //상품삭제 버튼
