import { BearerToken } from "@/actions/auth";
  
  export async function authenticatedFetch(url: string){
    const token = await BearerToken();
  
    if (!token) {
      throw new Error('Token d\'authentification manquant.');
    }
  
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    const response = await fetch(url, {
      headers,
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`Erreur de requête : ${response.status}`);
    }
  
    return response.json()
  }