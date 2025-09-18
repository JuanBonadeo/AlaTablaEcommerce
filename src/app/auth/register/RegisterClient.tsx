"use client";


import { RegisterForm } from "src/components/auth/RegisterForm";



export function RegisterClient() {
  // const { register, loading, error } = useAuth();
 

  
  
  // const handleRegister = async (formData: {
  //   name: string;
  //   email: string;
  //   password: string;
  //   birth_date: string;
  // }) => {
  //   await register(formData);
  // };


  return (
    <div className="min-h flex items-center justify-center bg rounded-xl py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full ">
        <div>
          <h2 className=" text-center text-3xl font-extrabold ">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para comenzar
          </p>
        </div>

        {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )} */}

        <RegisterForm  />
      </div>
    </div>
  );
}