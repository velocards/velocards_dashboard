"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const QRCodeSignIn = () => {
  const { theme } = useTheme();
  return (
    <div className="box p-3 md:p-4 xl:p-6 grid grid-cols-12 gap-6 items-center shadow-[0px_6px_30px_0px_rgba(0,0,0,0.04)]">
      <div className="col-span-12 lg:col-span-6">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500 text-center">
          <h3 className="h3 mb-4">Sign In With QR Code</h3>
          <p className="mb-6 lg:mb-8 bb-dashed pb-4  lg:pb-8">
            Scan this code with mobile app to Sign In Instantly
          </p>
          <div className="max-w-[400px] mx-auto bg-n0 dark:bg-bg4 rounded-xl border border-n30 dark:border-n500 p-6 lg:p-8">
            <Image
              src={
                theme == "dark"
                  ? "/images/qrcode-dark.png"
                  : "/images/qrcode.png"
              }
              width={336}
              height={349}
              alt="qrcode"
            />
          </div>
          <p className="mt-6 lg:mt-8">
            Sign in with email and password?{" "}
            <Link href="/auth/sign-in" className="text-primary font-medium">
              Click Here
            </Link>
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-start-8 lg:col-span-5">
        <Image src="/images/auth.png" alt="img" width={533} height={560} />
      </div>
    </div>
  );
};

export default QRCodeSignIn;
