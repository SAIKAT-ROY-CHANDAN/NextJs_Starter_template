/* eslint-disable react/no-unescaped-entities */
"use client";

import { FormFieldInput } from "@/components/shared/form-inputs/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { forgetPassword } from "@/services/auth"; // make sure this service exists
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import forgetPasswordValidation from "@/validations/forgetPassword.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { PulseLoader } from "react-spinners";

const ForgetPasswordForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(forgetPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    startTransition(async () => {
      const response = await forgetPassword(data);

      // status ccode 202 will be changed to 200 in the future
      if (response.statusCode === 202) {
        form.reset();
        showSuccessToast(response.message);
        setTimeout(() => {
          router.push("/check-email");
        }, 1500);
      } else {
        showErrorToast(response.message);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="border-2 h-full w-full max-w-md rounded-md bg-white px-10 pt-16 pb-10">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">Welcome !</p>
          <h2 className="text-2xl font-bold text-black mt-2">
            Forget Password
          </h2>
          <p className="text-gray-600 text-sm mt-1">Nessa Foundation</p>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 space-y-6"
            >
              <FormFieldInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />

              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
              >
                {isPending ? (
                  <PulseLoader color="#ffffff" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </FormProvider>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
