"use client";

import { Suspense } from "react";
import { LoginPage } from "./loginPage";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
