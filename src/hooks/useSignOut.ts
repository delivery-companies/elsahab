import { signOutService } from "@/services/signOut";
import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

export const useSignOut = () => {
    const { logout } = useAuth();
    return useMutation({
        mutationFn: () => signOutService(),
        onSuccess: () => {
            logout();
        }
    });
};
