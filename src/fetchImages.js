import axios from 'axios';

export async function fetchImages(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '29876171-467d2b4c1ee85715865faf87a',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });

  const url = `${BASE_URL}?${params}`;
  const data = await axios(url);
  return data;
}
