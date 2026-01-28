import { Suspense } from "react";
import VerifyOtpPage from "./VerifyOTP";
const page = () => {
  return (
    <div>
      <Suspense>
        <VerifyOtpPage />
      </Suspense>
    </div>
  );
};

export default page;
