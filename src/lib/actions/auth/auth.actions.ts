// web/actions/auth.actions.ts
"use server";

import { AuthService } from "@/core/auth/auth.service";
import { revalidatePath } from "next/cache";

export async function registerUserAction(data: unknown) {
  try {
    const user = await AuthService.register(data);

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function loginUserAction(data: { email: string; password: string }) {
  try {
    const user = await AuthService.login(data.email, data.password);
    
    // Revalidar para que Next.js actualice el cache
    revalidatePath("/");

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// export async function logoutUserAction() {
//   try {
//     await AuthService.logout();
    
//     revalidatePath("/");

//     return {
//       success: true,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// }