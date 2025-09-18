"use client";

import { LoginForm } from "src/components/auth/LoginForm";

// import { useAuth } from "@/hooks/useAuth";




export function LoginClient() {
  // const { login, loading, error } = useAuth();
  
  

  return (
    <div className="min-h flex items-center justify-center bg rounded-xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold ">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta
          </p>
        </div>

        {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )} */}
        <LoginForm  />
        
      </div>
    </div>
  );
}