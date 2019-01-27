const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";

//создаем заголовки
let headers = new Headers();
headers.append('Content-Type','application/json');
headers.append('Accept','application/json');
headers.append('Authorization','Token a2639964797e03890cdc59333699c7b3b4d70c6d');

//Функция запроса к API dadata
export function getCompanyInfo(ITN) {
    return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: headers,
        body: JSON.stringify({query: ITN, branch_type: "MAIN"})
    })
}