import { NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function GET() {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
