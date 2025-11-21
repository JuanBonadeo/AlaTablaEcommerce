import { db } from "@/db/client";
import { Role } from "@prisma/client";

export const userService = {
  async getAllUsers() {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          role: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  },

  async getUserById(id: string) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          addresses: true,
          orders: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  },

  async updateUserRole(id: string, role: Role) {
    try {
      const user = await db.user.update({
        where: { id },
        data: { role },
      });

      return user;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Failed to update user role");
    }
  },

  async deleteUser(id: string) {
    try {
      await db.user.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  },
};
