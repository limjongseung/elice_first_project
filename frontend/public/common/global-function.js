//가격표시에 콤마 찍기
export function formatPrice(number) {
    return number.toLocaleString("ko-KR");
}

//가격에 콤마 제거
export function removeFormatPrice(number) {
    return parseFloat(number.replace(",", ""));
}

//DB createdAt 날짜를
export function formatDate(DBCreatedAt) {
    const date = new Date(DBCreatedAt);
    return date.toLocaleDateString("ko-KR").slice(0, -1);
}

// 로컬에서 장바구니 데이터 불러오기
export function getCartLocalStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

//장바구니 상품 수량 변경될 때마다 업데이트된 데이터를 받아와 local storage 업데이트
export function updateCartLocalStorage(updatedData) {
    console.log(updatedData);
    const cartItems = getCartLocalStorage();
    const index = cartItems.findIndex((item) => item.id == updatedData.id);
    //로컬에서 업데이트할 상품의 인덱스를 찾기
    //인덱스가 -1이 아니라면, 즉 상품을 찾았다면 해당 인덱스에 있는 상품 데이터 업데이트하기
    if (index !== -1) {
        cartItems[index] = updatedData;
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
}

export function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
}

//휴대폰 번호는 11자리인지 검증하고 format해서 리턴한다 > 유효하지 않으면 false 반환 (alert 띄우기 위함)
export function validateMobileNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if ((numericPhoneNumber.length == 11)) {
        const formattedPhoneNumber = numericPhoneNumber.replace(
            /(\d{3})(\d{4})(\d{4})/,
            "$1-$2-$3"
        );
        return formattedPhoneNumber;
    } else {
        return false;
    }
}

//전화번호는 9~11자리만 입력받을 수 있고 format해서 리턴한다
export function validatePhoneNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (numericPhoneNumber.length == 9) {
        return numericPhoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (numericPhoneNumber.length == 10) {
        return numericPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (numericPhoneNumber.length == 11) {
        return numericPhoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
        return false;
    }
}
