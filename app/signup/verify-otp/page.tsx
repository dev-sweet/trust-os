import { Suspense } from "react";
import VerifyOtpPage from "./VerifyOTP";
const page = () => {
  return (
    <div>
      <Suspense fallback={<>Loading...</>}>
        <VerifyOtpPage />
      </Suspense>
    </div>
  );
};

export default page;
