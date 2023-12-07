import { deleteAccountModal } from "../modal/deleteAccountModal.js";

export function sideMenu() {
    const template = `
    <aside class="menu">
        <h1 class="title is-4 has-text-grey-darker has-text-underlined">마이페이지</h1>
        <ul class="menu-list">
            <li>
                <a class="myProfile has-text-grey"
                    onmouseover="this.classList.add('has-background-info-light')"
                    onmouseout="this.classList.remove('has-background-info-light')">
                    <span class="icon">
                        <i class="fas fa-user"></i>
                    </span>
                    회원정보
                </a>
            </li>
            <li>
                <a class="deleteAccount has-text-grey"
                    onmouseover="this.classList.add('has-background-info-light')"
                    onmouseout="this.classList.remove('has-background-info-light')">
                    <span class="icon">
                        <i class="fas fa-user-slash"></i>
                    </span>
                    회원탈퇴
                </a>
            </li>
            <li>
                <a class="myOrders has-text-grey"
                    onmouseover="this.classList.add('has-background-info-light')"
                    onmouseout="this.classList.remove('has-background-info-light')">
                    <span class="icon">
                        <i class="fas fa-file-alt"></i>
                    </span>
                    주문정보
                </a>
            </li>

        </ul>
    </aside>
    `;

    document
        .querySelector(".side_menu")
        .insertAdjacentHTML("afterbegin", template);

    //사이드 메뉴 elements
    const myProfileTab = document.querySelector(".myProfile");
    const myOrdersTab = document.querySelector(".myOrders");
    const deleteAccountTab = document.querySelector(".deleteAccount");

    //회원정보 페이지
    myProfileTab.addEventListener("click", () => {
        window.location.href = "../mypage/mypage.html"
    });

    //주문조회 tab > 주문조회 페이지로 이동
    myOrdersTab.addEventListener("click", () => {
        window.location.href =
            "../mypage_orderlist/myorders.html";
    });

    //회원탈퇴 tab 클릭시 마이페이지의 탈퇴 모달 링크로 이동
    deleteAccountTab.addEventListener("click", () => {
        deleteAccountModal();
    });
}
