import authPhoto from "@/assets/auth-photo.webp";
import bigLogo from "@/assets/biglogo.webp";
import LoginSkeleton from "@/components/skeleton/LoginSkeleton";
import Image from "next/image";
import { Suspense } from "react";
import ForgetPasswordForm from "./_components/ForgetPasswordForm";

const ForgetPasswordPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="relative hidden xl:block">
          <Image
            src={authPhoto}
            priority={true}
            alt={"Login photo"}
            className="z-[999] relative"
          />
          <Image
            src={bigLogo}
            alt={"Big Logo"}
            priority={true}
            className="absolute top-5 left-0 z-10"
          />
        </div>
        <div className="w-[450px] sm:w-[550px] xl:w-full">
          <Suspense fallback={<LoginSkeleton />}>
            <ForgetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
