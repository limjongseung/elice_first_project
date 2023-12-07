export function isLoginModal() {
    const modalTemplate = `
    <div id="isLoggedIn" class="modal is-active">
        <div class="modal-background" id="modalBackground"></div>
        <div class="modal-content">
            <div class="box has-text-centered" id="box">
                로그인 후 이용해 주세요.
                <div class="buttons is-centered">
                    <button class="button mt-5 is-info is-light has-text-centered" id="confirmButton" aria-label="close">
                        확인
                    </button>
                </div>
            </div>
            <button class="modal-close is-large" id="closeButton" aria-label="close"></button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalTemplate);

    const confirmBtn = document.getElementById("confirmButton");
    const closeBtn = document.getElementById("closeButton");
    const modal = document.getElementById("deleteAccountModal");

    confirmBtn.addEventListener("click", () => {
        window.location.href = "../main/index.html";
    });

    closeBtn.addEventListener("click", () => {
        window.location.href = "../main/index.html";
    });

}
