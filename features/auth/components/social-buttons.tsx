"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const SocialButtons = ({ isPending }: { isPending: boolean }) => {
  const router = useRouter();

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      const data = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (data.error) {
        toast.error(data.error.message);
        return;
      }

      toast.success("Account created successfully");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        disabled={isPending}
        onClick={() => handleSocialAuth("google")}
        variant="outline"
        className="w-full text-foreground"
      >
        <FcGoogle className="size-5 mr-1" />
        Continue with Google
      </Button>
    </div>
  );
};
