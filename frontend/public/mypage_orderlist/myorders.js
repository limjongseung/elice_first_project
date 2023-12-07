import { getAccount, putAccount, deleteAccount } from "../api/userapi.js";
import { formatPrice, formatDate } from "../common/global-function.js";
import { sideMenu } from "../common/components/mypagemenu.js";
import {
    formatPhoneNumber,
    validatePhoneNumber,
} from "../common/global-function.js";

//주문내역 요소
const orderTable = document.querySelector("tbody");
const modal = document.querySelector(".modal");
const confirmOrderUpdate = document.getElementById("orderChangeSubmit");
const closeModalBtn = document.getElementById("orderChangeCancel");
const closeModalBtn2 = document.getElementById("modalCloseButton");

//모달 내 html element 가져오기
const nameInput = document.querySelector('input[name="username"]');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.querySelector('input[name="phone"]');
const addressInput = document.querySelector('input[name="address"]');
const orderIdInput = document.querySelector('input[name="orderId"]');
const orderDetailModal = document.querySelector(".order_detail_modal");
const totalAmount = document.querySelector(".totalAmount");

//pagination 관련 요소
const prevButton = document.getElementById("prevPageButton");
const nextButton = document.getElementById("nextPageButton");

let currentPage = 1;
const itemsPerPage = 10;
let totalPages;
let orderData = [];

renderOrderList(currentPage);
sideMenu();

//주문내역 HTML template
function generateTableRow(order) {
    const { _id: orderId, shipping_status, products, createdAt } = order;

    //총 결제금액 구하기
    let totalAmount = calculateSum(products);

    //주문한 상품
    const productList = products
        .map((product) => `${product.name} (${product.quantity})개`)
        .join("<br>");

    //배송상태 > 배송준비중이 아닌 경우 '주문변경불가' 문구 표시
    const isShipped =
        shipping_status == "배송준비중"
            ? `<button data-id-modify="${orderId}"
    class="button is-primary is-focused is-small modify_order is-focused">주문수정</button>
<button data-id-cancel="${orderId}"
    class="button is-danger is-focused is-small cancel_order is-focused">주문취소</button>`
            : `주문변경 불가`;

    return `
        <tr class="paginated-list">
        <td class="orderId">${formatDate(createdAt)}</td>
        <td class="product_detail">
            <p class="product_name">${productList}</p>
        </td>
        <td class="total_amount">${formatPrice(totalAmount)}원</td>
        <td class="shipping_status">${shipping_status}</td>
        <td class="btn">${isShipped}</td>
    </tr>
        `;
}

//전체 주문내역 렌더링
async function renderOrderList(pageNumber) {
    try {
        //전체 오더 리스트 api 요청
        orderData = await getAccount("/orderuser");
        console.log("유저 전체 주문데이터", orderData);

        if (!orderData || orderData.length === 0) {
            orderTable.insertAdjacentHTML(
                "beforeend",
                `<tr><td colspan="6" id="emptyTable">아직 주문이 없습니다</td></tr>`
            );
        } else {
            orderData.forEach((order) => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = Math.min(
                    startIndex + itemsPerPage,
                    orderData.length
                );

                orderTable.innerHTML = ""; //기존 내용 지우고 다시 채우기

                for (let i = startIndex; i < endIndex; i++) {
                    const order = orderData[i];
                    const tableRow = generateTableRow(order); //주문내역 렌더링
                    orderTable.insertAdjacentHTML("beforeend", tableRow);

                    //주문변경 버튼 이벤트 리스너 등록
                    const modifyOrderBtn = document.querySelector(
                        `[data-id-modify="${order._id}"]`
                    );
                    if (modifyOrderBtn) {
                        modifyOrderBtn.addEventListener("click", openModal);
                    }

                    //주문취소 버튼 이벤트 리스너 등록
                    const cancelOrderBtn = document.querySelector(
                        `[data-id-cancel="${order._id}"]`
                    );
                    if (cancelOrderBtn) {
                        cancelOrderBtn.addEventListener(
                            "click",
                            submitCancelOrder
                        );
                    }
                }
            });
            currentPage = pageNumber; //현재 페이지 위치 업데이트하기
            // updatePaginationControls();
            renderTotalPageCount()
        }
    } catch (error) {
        console.log(error);
    }
}

//모든 주문상품의 총 합계 금액 구하기
function calculateSum(products) {
    return products
        .map((product) => product.price * product.quantity)
        .reduce((total, subtotal) => total + subtotal, 0);
}

/*=============================
      주문수정 관련 기능
=============================*/

// 주문수정 Modal 창 열기
async function openModal() {
    modal.classList.add("is-active");
    const orderId = this.getAttribute("data-id-modify"); //주문번호
    //console.log("주문번호", orderId);

    try {
        const data = await getAccount(`/orderuser/${orderId}`);
        console.log("특정 오더데이터", data);

        nameInput.value = data.name;
        phoneInput.value = formatPhoneNumber(data.phone);
        emailInput.value = data.user_email;
        addressInput.value = data.address;
        orderIdInput.value = data._id;

        orderDetailModal.innerHTML = "";
        totalAmount.innerText = "";
        data.products.forEach(({ name, quantity, price }) => {
            orderDetailModal.insertAdjacentHTML(
                "beforeend",
                `<tr>
                <td class="product-id is-3 has-text-centered custom-text" style="vertical-align: middle;">${name}</td>
                <td class="has-text-right custom-text" style="vertical-align: middle;">${quantity}</td>
                <td class="has-text-left custom-text pl-0" style="vertical-align: middle;">개</td>
            </tr>`
            );
        });
        totalAmount.innerText = formatPrice(calculateSum(data.products));
    } catch (err) {
        console.log(err);
    }
}

//주문변경 api 요청
async function submitUpdatedOrder(e) {
    e.preventDefault();
    //console.log(this);
    const orderId = orderIdInput.value;

    if (!validatePhoneNumber(phoneInput.value)) {
        alert("번호 11자리를 입력해주세요");
        return;
    }

    const data = {
        address: addressInput.value,
        phone: formatPhoneNumber(phoneInput.value),
        shipping_status: "배송준비중",
    };
    console.log("변경된 배송지", data);

    try {
        await putAccount(`/orderuser/${orderId}`, data);
        alert(`주문 정보가 변경되었습니다`);
    } catch (err) {
        console.log(err);
        alert(`문제가 발생하였습니다`);
    }
    closeModal();
    location.reload();
}

/*=============================
      주문취소 관련 기능
=============================*/

//주문취소 진행
async function submitCancelOrder() {
    const orderId = this.getAttribute("data-id-cancel");
    console.log("주문번호", orderId);

    const confirm = window.confirm("주문을 취소하시겠습니까?");

    if (confirm) {
        try {
            //delete api 요청하기
            await deleteAccount(`/orderuser/${orderId}`);
            this.closest("tr").remove();
            alert(`주문이 취소되었습니다`);
            location.reload();
        } catch (err) {
            console.log(err);
            alert(`문제가 발생하였습니다`);
        }
    } else {
        closeModal();
    }
}

// 주문변경 Modal 창 닫기
function closeModal() {
    modal.classList.remove("is-active");
}

/*=============================
      페이지네이션 관련 기능
=============================*/

function renderTotalPageCount() {
    totalPages = Math.ceil(orderData.length / itemsPerPage); //총 페이지 수
    const pageList = document.getElementById("pagination-numbers");

    //지우고 다시 페이지 개수 보여주기
    while (pageList.firstChild) {
        pageList.removeChild(pageList.firstChild);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageNum = document.createElement("a");
        pageNum.innerText = `${i}`;

        pageNum.addEventListener("click", () => {
            currentPage = i;
            renderOrderList(currentPage);
        });

        pageList.appendChild(pageNum);
    }
}

//pagination 이전, 다음 버튼
nextButton.addEventListener("click", () => {
    console.log("click");
    if (currentPage < totalPages) {
        currentPage++;
        renderOrderList(currentPage);
    }
});

prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderOrderList(currentPage);
    }
});

closeModalBtn2.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
confirmOrderUpdate.addEventListener("click", submitUpdatedOrder);
