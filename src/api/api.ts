const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:7290/api/v1/";


const fetchApi = {
  async post(endpoint: string, body: unknown) {
    const url = `${baseUrl}${endpoint}`;
    console.log('Making request to:', url);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
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
        const data = JSON.parse(responseText);
        console.log('Success response:', data);
        return data;
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        return { success: true, message: 'Operation completed successfully' };
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  },

  async get(endpoint: string) {
    const url = `${baseUrl}${endpoint}`;
    console.log('Making GET request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('GET Response status:', response.status);

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('PUT Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

export default fetchApi;