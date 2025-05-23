import React from "react";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface DecodedToken {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: unknown;
}

interface GoogleLoginButtonProps {
  clientId: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ clientId }) => {
  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Login Raw Response:", credentialResponse);
    if (credentialResponse.credential) {
      try {
        const decodedToken: DecodedToken = jwtDecode(credentialResponse.credential);
        console.log("Decoded Token:", decodedToken);
        const userEmail = decodedToken.email;
        const userName = decodedToken.name || `${decodedToken.given_name} ${decodedToken.family_name}`;

        if (userEmail) {
          toast.success(`Google User Email: ${userEmail}`);
          console.log("Google User Email:", userEmail);
        } else {
          console.log("Email not found in token");
        }

        if (userName && userName.trim() !== "undefined undefined") {
          console.log("Google User Name:", userName);
        } else {
          console.log("Name not found in token");
        }
        // You might want to call a prop function here to pass login data to the parent
        // e.g., onLoginSuccess(decodedToken);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        toast.error("Failed to process Google login. Invalid token.");
      }
    } else {
      console.log("Google Login Success, but no credential received.");
      toast.error("Google Login did not return a credential.");
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Google Login Failed");
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;