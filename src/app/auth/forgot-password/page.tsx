import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
            <div className="max-w-md w-full bg-[#171718] border border-gray-800 rounded-2xl p-8 shadow-xl">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
