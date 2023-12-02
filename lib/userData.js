import { getToken } from './authenticate';
let token = getToken();


async function makeRequest(method, endpoint, data = null) {
   const headers = {
     Authorization: `JWT ${token}`,
     'Content-Type': 'application/json',
   };
 
   const options = {
     method,
     headers,
   };
 
   if (data) {
     options.body = JSON.stringify(data);
   }
 
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, options);
 
   if (!res.ok) {
     return [];
   }
 
   const responseData = await res.json();
   return responseData;
 }
 

export async function addToFavourites(id) {
  return makeRequest('PUT', `/favourites/${id}`);
}

export async function removeFromFavourites(id) {
  return makeRequest('DELETE', `/favourites/${id}`);
}

export async function getFavourites() {
  return makeRequest('GET', '/favourites');
}

export async function addToHistory(id) {
  return makeRequest('PUT', `/history/${id}`);
}

export async function removeFromHistory(id) {
  return makeRequest('DELETE', `/history/${id}`);
}

export async function getHistory() {
  return makeRequest('GET', '/history');
}
