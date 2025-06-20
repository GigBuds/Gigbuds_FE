/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchApi from '@/api/api';

export interface Profile {
  companyEmail: string;
  companyName: string;
  companyAddress: string;
  taxNumber: string;
  businessLicense: string;
  companyLogo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class ProfileService {
  private handleApiResponse<T>(response: any): ApiResponse<T> {
    try {
      if (response.success !== undefined) {
        return response;
      }
      
      // If response doesn't have success field, assume it's successful data
      return {
        success: true,
        data: response,
        message: 'Operation completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get employer profile by ID
   */
  async getEmployerProfileById(id: number): Promise<ApiResponse<Profile>> {
    try {
      const response = await fetchApi.get(`employer-profiles/${id}`);
      return this.handleApiResponse<Profile>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch employer profile',
      };
    }
  }

  /**
   * Update employer profile - handles both regular data and file uploads
   */
  async updateEmployerProfile(
    id: number, 
    profileData: Profile | FormData
  ): Promise<ApiResponse<Profile>> {
    try {
      let response;
      
      if (profileData instanceof FormData) {
        // Handle file uploads with FormData - use direct fetch for file uploads
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gigbuds-c3fagtfwe2brewha.eastasia-01.azurewebsites.net/api/v1/";
        const url = `${baseUrl}employer-profiles/${id}`;
        
        // Get auth token
        const accessToken = typeof window !== 'undefined' 
          ? document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]
          : null;

        const headers: HeadersInit = {
          'ngrok-skip-browser-warning': 'true',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        };
        // Don't set Content-Type for FormData - let browser set it with boundary

        const fetchResponse = await fetch(url, {
          method: 'PUT',
          headers,
          body: profileData,
        });

        if (!fetchResponse.ok) {
          throw new Error(`Error: ${fetchResponse.status} ${fetchResponse.statusText}`);
        }

        // Handle response based on content
        const responseText = await fetchResponse.text();
        if (responseText) {
          try {
            response = JSON.parse(responseText);
          } catch {
            response = { success: true, message: 'Profile updated successfully' };
          }
        } else {
          response = { success: true, message: 'Profile updated successfully' };
        }
      } else {
        // Handle regular JSON data using existing fetchApi
        const putResponse = await fetchApi.put(`employer-profiles/${id}`, profileData);
        
        // Handle the response properly
        if (putResponse instanceof Response) {
          const responseText = await putResponse.text();
          if (responseText) {
            try {
              response = JSON.parse(responseText);
            } catch {
              response = { success: true, message: 'Profile updated successfully' };
            }
          } else {
            response = { success: true, message: 'Profile updated successfully' };
          }
        } else {
          response = putResponse;
        }
      }
      
      return this.handleApiResponse<Profile>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update employer profile',
      };
    }
  }
}

// Export a singleton instance
const profileService = new ProfileService();
export default profileService;