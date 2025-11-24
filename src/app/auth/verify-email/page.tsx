"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("Token de verificación no encontrado");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });
        
        if (response.ok) {
          setStatus("success");
          setMessage("¡Email verificado exitosamente!");
          
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Error al verificar el email. El token puede haber expirado.");
        }
      } catch {
        setStatus("error");
        setMessage("Error al verificar el email. El token puede haber expirado.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Verificando email...</h2>
              <p className="text-gray-600">Por favor espera un momento</p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">{message}</h2>
              <p className="text-gray-600 mb-4">Serás redirigido al login...</p>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error de verificación</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <Link 
                href="/auth/login" 
                className="text-primary hover:underline"
              >
                Ir al login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
