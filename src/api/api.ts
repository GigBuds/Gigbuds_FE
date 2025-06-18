// const baseUrl = process.env.BASE_URL ?? "https://localhost:50876/api/v1/";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/api/v1/";
const getAuthHeaders = (): HeadersInit => {
  const accessToken = typeof window !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    : null;

  return {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };
};

const fetchApi = {
  async post(endpoint: string, body: unknown) {
    const url = `${baseUrl}${endpoint}`;
    console.log('Making request to:', url);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Get the response text first
      const responseText = await response.text();
      if (!responseText) {
        return { success: true, message: 'Operation completed successfully' };
      }

      // Check if response has JSON content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = JSON.parse(responseText);
          console.log('Success response (JSON):', data);
          return data;
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          return { success: true, message: 'Operation completed successfully' };
        }
      } else {
        // For non-JSON responses (like JWT tokens), return the raw text
        console.log('Success response (text):', responseText);
        return responseText;
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  },

  async get(endpoint: string) {
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async put(endpoint: string, body: unknown) {
    const url = `${baseUrl}${endpoint}`;
    console.log('Making PUT request to:', url);
    console.log('PUT Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    console.log('PUT Response status:', response.status);

    if (!response.ok && response.status !== 204) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response;
  },

  async delete(endpoint: string) {
    const url = `${baseUrl}${endpoint}`;
    console.log('Making DELETE request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      console.log('DELETE Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('DELETE Error response body:', errorText);
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { success: true, message: 'Deleted successfully' };
      }

      const responseText = await response.text();
      if (!responseText) {
        return { success: true, message: 'Deleted successfully' };
      }

      try {
        const data = JSON.parse(responseText);
        console.log('DELETE Success response:', data);
        return data;
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        return { success: true, message: 'Deleted successfully' };
      }
    } catch (fetchError) {
      console.error('DELETE Fetch error:', fetchError);
      throw fetchError;
    }
  },
};

export default fetchApi;