import axios from "axios";


const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '37920091-249696636902b038ed96aea04'





export async function getImage(page, query, perPage) {
    const params = {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page,
            per_page: perPage,
        }
    }

    const res = await axios.get(`${BASE_URL}`, params);
    return res.data
}

