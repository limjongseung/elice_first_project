// api.js 모듈

// GET 요청을 수행하는 함수
export async function sendGetRequest(url) {
	return await fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.catch((error) => {
			throw new Error("There was a problem with the GET request:", error);
		});
}

// POST 요청을 수행하는 함수
export async function sendPostRequest(url, data) {
	return await fetch(url, {
		method: "POST",
		headers: {
				authorization: `bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.catch((error) => {
			throw new Error(
				"There was a problem with the POST request:",
				error
			);
		});
};

//  POST 요청을 수행하는 함수
// 카테고리 수정 api의 경우에는 body에  ok라는 응답만 하고 있기때문에 새로운 api함수를 만들었음
export async function sendPostCategoryModiRequest(url, data={}) {
	return await fetch(url, {
		method: "POST",
		headers: {
			authorization: `bearer ${localStorage.getItem("accessToken")}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return null;
		})
		.catch((error) => {
			throw new Error(
				"There was a problem with the POST request:",
				error
			);
		});
}
// Delete 요청을 수행하는 함수
export async function sendDeleteRequest(url, data) {
	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				authorization: `bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return null; // 응답을 JSON으로 파싱하지 않음
	} catch (error) {
		throw new Error(
			"There was a problem with the DELETE request: " + error.message
		);
	}
}

// PUT 요청을 수행하는 함수
export async function sendPutRequest(url, data={}) {
	return await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((response) => {
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
    return null;
	});
}
