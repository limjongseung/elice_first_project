import {
    formatPrice,
    removeFormatPrice,
    getCartLocalStorage,
} from "../common/global-function.js";
import { getAccount, post } from "../api/userapi.js";

//배송지정보 element
const userName = document.querySelector("#name");
const emailField = document.querySelector("#email");
const phoneField = document.querySelector("#phone");
const addressField = document.querySelector("#address");
const zipcodeField = document.querySelector("#zipcode");
const orderForm = document.querySelector(".order_form");
const orderButton = document.querySelector(".order_button");
const backButton = document.querySelector(".backbtn");

renderPaymentAmount();
renderShippingInfo();

//로컬에서 주문상품 데이터를 가져와 결제정보 표시
function renderPaymentAmount() {
    let pendingOrder = JSON.parse(localStorage.getItem("pendingOrder")) || []; //로컬에서 주문정보 가져오기
 
    //총 결제금액 구하기
    let totalPaymentAmount = pendingOrder.reduce(
        (total, item) => total + item.price * item.totalQuantity,
        0
    );

    document.querySelector(".product_amount").innerText = `${formatPrice(
        totalPaymentAmount
    )} 원`;
    document.querySelector("#total_price").innerText = `${formatPrice(
        totalPaymentAmount
    )} 원`;
}

//배송지정보
async function renderShippingInfo() {
    try {
        const user = await getAccount("/account");
        console.log(user);

        userName.value = user.name;
        emailField.value = user.email;
        phoneField.value = user.phone;
        zipcodeField.value = user.zipcode;
        addressField.value = user.address;
    } catch (err) {
        console.log(err.stack);
    }
}

//주문 요청
async function checkout(e) {
    e.preventDefault();

    let pendingOrder = JSON.parse(localStorage.getItem("pendingOrder")) || [];

    const orderData = {
        orderedProducts: pendingOrder.map((item) => ({
            productId: item.shortId,
            quantity: item.totalQuantity,
        })),
    };
    console.log("주문 데이터", orderData);

    try {
        //주문 api post 요청
        await post("/orderuser", orderData);

        //장바구니에서 주문상품 제거
        const CART_ITEMS = getCartLocalStorage();
        const updatedCartData = CART_ITEMS.filter(
            (item) =>
                !orderData["orderedProducts"].some(
                    (order) => order.productId == item.shortId
                )
        );
        console.log("주문한 상품", pendingOrder);
        console.log("카트에 남아있는 상품", updatedCartData);

        localStorage.setItem("cart", JSON.stringify(updatedCartData)); //장바구니에 남아있는 상품을 로컬에 저장
        localStorage.removeItem("pendingOrder"); //로컬에서 주문대기 상품 모두 삭제

        //주문 완료 페이지로 이동
        window.location.href = "../order_complete/order_complete.html";
    } catch (err) {
        console.log(err)
        window.alert("오류가 발생했습니다.");
    }
}

backButton.addEventListener("click", () => {
    window.location.href = "../cart/cart.html";
});

orderForm.addEventListener("submit", checkout);
