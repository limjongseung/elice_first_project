import { sendGetRequest } from "../api/api.js";
import {formatPrice} from "../common/global-function.js";

const nameTag = document.querySelector("#name");
const imgTag = document.querySelector("#productImage");
const priceTag = document.querySelector("#price");
const companyTag = document.querySelector("#company");
const descriptionTag = document.querySelector("#description");

const button_cart = document.querySelector("#button_cart");
const button_purchase = document.querySelector("#button_purchase");

async function insertItem() {
    const urlParams = new URLSearchParams(window.location.search);
    let shortid;
    if (urlParams.has("shortid")) {
        shortid = urlParams.get("shortid");
        console.log(shortid);
    } else {
        console.error("에러발생");
    }

    try {
        const data = await sendGetRequest(
            `http://kdt-sw-6-team04.elicecoding.com:3000/product/${shortid}`
        );
        console.log(data);

        nameTag.innerText = data.name;
        imgTag.src = `http://kdt-sw-6-team04.elicecoding.com:3000/product/imgs/${data.img}`;
        const dataPrice = formatPrice(data.price);
        companyTag.innerHTML = data.company;
        priceTag.innerText = `${dataPrice}원`;
        descriptionTag.innerText = data.description;

        const cartPlusOne = () => {
            const productData = {
                name: data.name,
                img: data.img,
                thumbnail: data.thumbnail,
                price: data.price,
                totalQuantity: 1,
                company: data.company,
                shortId: data.shortId, // Use the correct property name
            };

            let getCartLocalStorage =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existItem = getCartLocalStorage.findIndex((item) => {
                return item.shortId === productData.shortId;
            });

            if (existItem !== -1) {
                alert("이미 장바구니 안에 있는 상품입니다.");
            } else {
                getCartLocalStorage.push(productData);
                localStorage.setItem(
                    "cart",
                    JSON.stringify(getCartLocalStorage)
                );
                alert("장바구니에 추가되었습니다.");
            }
        };
        button_cart.addEventListener("click", async () => {
            try {
                cartPlusOne();
                console.log("장바구니에 하나 추가");
            } catch (err) {
                alert("오류가 발생하였습니다.");
            }
        });

        button_purchase.addEventListener("click", async () => {
            try {
                cartPlusOne();
                alert("구매페이지로 이동합니다.");
                window.location.href = "../cart/cart.html";
            } catch (e) {
                console.log(e);
                alert("오류가 발생하였습니다.");
            }
        });
    } catch (err) {
        console.log(err);
    }
}

insertItem();



//function moveToPath(path){
//  return function () {
//    window.location.href = path;
//  }
//}
//
//사진.addEventListener('click',moveToPath(`/product/${shortId}`))