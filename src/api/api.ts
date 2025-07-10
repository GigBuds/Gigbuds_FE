// const baseUrl = process.env.BASE_URL ?? "https://localhost:50876/api/v1/";
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/api/v1/";
const baseUrl = "https://sharing-ultimately-crappie.ngrok-free.app/api/v1/";


const getAuthHeaders = (): HeadersInit => {
  const accessToken = typeof window !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]
    : null;

  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };
};

const handleResponse = async (response: Response, successMessage = 'Operation completed successfully') => {
  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  // Handle successful responses
  const responseText = await response.text();
  if (!responseText) {
    return { success: true, message: successMessage };
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      return JSON.parse(responseText);
    } catch {
      return { success: true, message: successMessage };
    }
  }

  // Return raw text for non-JSON responses (like JWT tokens)
  return responseText;
};

const logRequest = (method: string, url: string, body?: unknown) => {
  console.log(`Making ${method} request to:`, url);
  if (body) {
    console.log(`${method} Request body:`, JSON.stringify(body, null, 2));
  }
};

const logResponse = (method: string, response: Response) => {
  console.log(`${method} Response status:`, response.status);
  if (method === 'POST') {
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  }
};

const fetchApi = {
  async post(endpoint: string, body: unknown) {
    const url = `${baseUrl}${endpoint}`;
    logRequest('POST', url, body);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(body),
      });

      logResponse('POST', response);
      return await handleResponse(response);
    } catch (error) {
      console.error('POST Fetch error:', error);
      throw error;
    }
  },

  async get(endpoint: string) {
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GET Fetch error:', error);
      throw error;
    }
  },

  async put(endpoint: string, body: unknown) {
    const url = `${baseUrl}${endpoint}`;
    logRequest('PUT', url, body);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(body),
      });

      logResponse('PUT', response);

      if (!response.ok && response.status !== 204) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('PUT Fetch error:', error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    const url = `${baseUrl}${endpoint}`;
    logRequest('DELETE', url);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
          'ngrok-skip-browser-warning': 'true',
        },
      });

      logResponse('DELETE', response);
      return await handleResponse(response, 'Deleted successfully');
    } catch (error) {
      console.error('DELETE Fetch error:', error);
      throw error;
    }
  },
};

export default fetchApi;