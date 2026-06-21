import Link from "next/link";
import { PropsWithChildren } from "react";
import { RiMovie2Line } from "react-icons/ri";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10 relative"
      style={{
        backgroundImage: "url('/images/bg.png')",
      }}
    >
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <RiMovie2Line className="text-xl" />
          Movie Base
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
