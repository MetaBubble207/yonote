"use client";

import { useRouter } from "next/compat/router";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const LoginCallback = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get("code"));
  });

  return (
    <div>
      <h1>LoginCallback</h1>
    </div>
  );
};
export default function Page() {
  return (
    <Suspense>
      <LoginCallback></LoginCallback>
    </Suspense>
  );
}
