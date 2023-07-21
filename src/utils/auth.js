export const BASE_URL = 'https://auth.nomoreparties.co/';
export  { register, authorize, checkToken };

function checkResult(res) {
    if (res.ok) {
        return res.json();
    }
    else {
        return Promise.reject(`Ошибка: ${res.status}`);
    }
}

function register (email, password) {
    return fetch(`${BASE_URL}signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, email }),
    })
    .then((res) => checkResult(res))
}

function authorize (email, password) {
    return fetch(`${BASE_URL}signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, email }),
    })
    .then((res) => checkResult(res))
}

function checkToken(token) {
    return fetch(`${BASE_URL}users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
    })
    .then((res) => checkResult(res))
}
