import z from "zod";


export const createUserDTO = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    surname: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    phone: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
});

export type createUserDTO = z.infer<typeof createUserDTO>;

export const registerUserDTO = createUserDTO.extend({
    // addresses: z.array(z.object({
    //     street: z.string().min(3, "La calle debe tener al menos 3 caracteres"),
    //     city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
    //     state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
    //     zip: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
    // })).optional(),
});
export type registerUserDTO = z.infer<typeof registerUserDTO>;
// export type addressesDTO = z.infer<typeof registerUserDTO>["addresses"];