const baseUrl = 'https://localhost:53460/api/v1/identities';
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const fetchApi = {
  async post(endpoint: string, body: unknown) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
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

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: true, message: 'Operation completed successfully' };
    }

    const responseText = await response.text();
    if (!responseText) {
      return { success: true, message: 'Operation completed successfully' };
    }

    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      return { success: true, message: 'Operation completed successfully' };
    }
  },

  async get(endpoint: string) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async put(endpoint: string, body: unknown) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

export default fetchApi;