import { sendPostRequest, sendGetRequest } from "./api/api.js"

const name = document.querySelector('#name').value;
const price = parseInt(document.querySelector('#price').value);
const company = document.querySelector('#company').value;
const category = document.querySelector('#category').value;
const description = document.querySelector('#description').value;
const imageInput = document.querySelector('#imageInput').files[0];
const submitButton = document.querySelector('#submitButton');

async function checkLogin() {
    const token = localStorage.getItem('accessToken');
    try {
        const res = await fetch("/account",
            {
                method: "GET",
                headers: {
                    authorization: `bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
    } catch (e) {
        console.log('에러')
        window.location.href = "/login";
    }
}

async function makeCategory() {
    const categorys = await sendGetRequest('/category');
    categorys.forEach((Category) => {
        const { _id, name, shortId, createdAt, updatedAt } = Category;
        category.insertAdjacentHTML('beforeend',
            `<option> ${name} </option>`)
    })
}

checkLogin()
makeCategory()

//-------------------------------------------------------------------

submitButton.addEventListener('click', submit);

// 랜덤 문자열을 만들어서 상품아이디로 지정 지정
function randomId() {
    return Math.random().toString(36).substring(2, 12);
}

async function submit(e) {         //버튼명 중복
    e.preventDefault();
    if (!name || !price || !company || !category || !description || imageInput) {
        return alert("모든 항목을 입력해주세요")
    }
    try {
        // ---- 받은 이미지를 링크로 변환 ?
        // const imageUrl = 이미지를 링크로 만드는 기능
        const shortId = randomId()
        const data = { shortId, name, price, company, category, description, imageUrl }

        await sendPostRequest('/product/${productShortId}', data);
        window.location.href = "/";
    } catch (e) {
        alert('오류 발생');
    }
}
