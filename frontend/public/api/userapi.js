const BASE = "http://kdt-sw-6-team04.elicecoding.com:3000";

// 로그인한 사용자 데이터 api > JWT 토큰을 헤더에 담아 서버에 보냄
export async function getAccount(URL) {
    try {
        const res = await fetch(BASE + URL, {
            method: "GET",
            headers: {
                authorization: `bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const serverResponse = await res.json();
            const errorMessage = serverResponse.message;
            throw new Error(`${errorMessage}`); //서버 응답 메시지
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// 사용자 데이터 변경 api > JWT 토큰을 헤더에 담아 서버에 보냄
export async function putAccount(URL, data) {
    const res = await fetch(BASE + URL, {
        method: "PUT",
        headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const serverResponse = await res.json();
        const errorMessage = serverResponse.message;
        throw new Error(`${errorMessage}`); //서버 응답 메시지
    }

    const serverRes = await res.json();
    if (serverRes) {
        return serverRes;
    }
}

// 사용자 계정 삭제 api > JWT 토큰을 헤더에 담아 서버에 보냄
export async function deleteAccount(URL, data) {
    console.log(data);
    const res = await fetch(BASE + URL, {
        method: "DELETE",
        headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const serverResponse = await res.json();
        const errorMessage = serverResponse.message;
        console.log(errorMessage);
        throw new Error(`${errorMessage}`); //서버 응답 메시지
    }
}

// POST
export async function post(URL, data) {
    try {
        const res = await fetch(BASE + URL, {
            method: "POST",
            headers: {
                authorization: `bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const data = await res.json();
            console.log(data);
            throw new Error(`문제발생: ${data.message}`);
        }
    } catch (err) {
        console.log(err)
        console.error("Error stack:", err.stack);
    }
}