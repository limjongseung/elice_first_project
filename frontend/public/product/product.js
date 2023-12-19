//params가져오기
function getQueryParam(name) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
}
async  function renderProduct(productData) {
    const productContainer = document.getElementById('productContainer');

    // Create HTML elements for each product property
    productContainer.innerHTML = `
        <h1>${productData[0].name}</h1>
        <p>Category: ${productData[0].category}</p>
        <p>Price: ${productData[0].price}</p>
        <p>Description: ${productData[0].description}</p>
        <!-- Add more properties as needed -->

        <img src="http://localhost:3000/product/imgs/${productData[0].img}" alt="${productData[0].name}">

        <p>Company: ${productData[0].company}</p>
    `;
}
async function getProduct(productId){
    try{
         const res =await  fetch(`http://localhost:3000/product?categoryShortId=${productId}`)
         const data =await  res.json();
         console.log(data);
          await renderProduct(data);

    }catch(e){
        console.error(`Error fetching product data: ${error}`);
    }
}
// Function to render product information

// DOM이 완전히 로드된 후에 실행되도록 설정
document.addEventListener("DOMContentLoaded", function () {
    // URL에서 상품 ID를 가져오기
    const productId = getQueryParam("id");

    // 상품 데이터 가져오기 및 렌더링
    getProduct(productId);
});



