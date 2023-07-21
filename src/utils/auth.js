export const BASE_URL = 'https://auth.nomoreparties.co/';
export  {register};

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
