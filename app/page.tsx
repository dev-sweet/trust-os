import { cn } from "@/lib/utils";
import Link from "next/link";

const page = () => {
  return (
    <div className="max-w-8/12 mx-auto text-center py-20">
      <h3 className="text-3xl">
        Dear User, Homepage is currently in maintanance mode.{" "}
      </h3>
      <p>You can visit our dashboard it is on working</p>
      <br />
      <br />
      <Link
        href="/dashboard"
        className={cn("btn bg-emerald-600 text-white p-4")}
      >
        Go Home
      </Link>
    </div>
  );
};

export default page;
