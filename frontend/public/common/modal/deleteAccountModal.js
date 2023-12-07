import { getAccount, putAccount, deleteAccount } from "../../api/userapi.js";

export function deleteAccountModal() {
    const modalTemplate = `
    <div id="deleteAccountModal" class="modal is-active">
        <div class="modal-background" id="modalBackground"></div>
        <div class="modal-content">
            <div class="box" id="box">
                정망 탈퇴하시겠습니다?
                <div class="buttons">
                    <button class="button mt-5 is-danger is-light" id="confirmDeleteAccount" aria-label="close">
                        네
                    </button>
                    <button class="button mt-5 is-primary is-light" id="cancelDelete" aria-label="close">
                        아니오
                    </button>
                </div>
            </div>
            <button class="modal-close is-large" id="deleteCloseButton" aria-label="close"></button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalTemplate);

    const confirmDeleteBtn = document.getElementById("confirmDeleteAccount");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    const closeBtn = document.getElementById("deleteCloseButton");
    const modal = document.getElementById("deleteAccountModal");

    cancelDeleteBtn.addEventListener("click", () => {
        modal.remove(); //모달을 DOM에서 삭제
    });
    //     window.history.replaceState(
    //         {},
    //         document.title,
    //         window.location.pathname
    //     );

    closeBtn.addEventListener("click", () => {
        modal.remove();
    });

    document.body.addEventListener("click", (event) => {
        if (event.target === confirmDeleteBtn) {
            deleteAccountConfirm();
        }
    });
}

//회원탈퇴 확인 버튼 클릭시 서버에 delete 요청
export async function deleteAccountConfirm() {
    confirmDeleteAccount.disabled = true; //중복 요청 방지하기 위함 > 처리되는 동안 버튼 disabled 처리함

    try {
        await deleteAccount("/account");
        alert("계정이 삭제되었습니다.");
        
        localStorage.removeItem("accessToken"); // JWT token

        location.href = "../main/index.html";
    } catch (err) {
        alert("계정 삭제 중 오류가 발생했습니다.");
        location.href = "../main/index.html";
    }
}
