"use client";

import { FormFieldInput } from "@/components/shared/form-inputs/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { login } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import loginValidation from "@/validations/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { PulseLoader } from "react-spinners";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    startTransition(async () => {
      const response = await login(data);

      if (response.statusCode === 200) {
        form.reset();
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push("/dashboard");
        }
        showSuccessToast(response.message);
      } else {
        showErrorToast(response.message);
      }
    });
  };
  
  return (
    <div className="border-2 h-full max-w-xl rounded-md bg-white px-10 pt-20 pb-10">
      <div>
        <h4 className="text-2xl text-gray-600">Welcome !</h4>
        <div className="my-7 flex flex-col gap-1">
          <h2 className="text-4xl font-semibold">Sign In</h2>
          <p className="text-gray-600 text-lg">Nessa Foundation</p>
        </div>
      </div>
      <div>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-9">
                <FormFieldInput
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <FormFieldInput
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm">
                      Remember me
                    </label>
                  </div>
                  <div>
                    <Link
                      className="text-gray-600 hover:text-gray-700"
                      href="/forget-password"
                    >
                      Forget password?
                    </Link>
                  </div>
                </div>

                <Button
                  size={"lg"}
                  className="py-8 text-xl cursor-pointer"
                  type="submit"
                >
                  {isPending ? <PulseLoader color="#ffffff" /> : "Login"}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;
