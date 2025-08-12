"use client";

import { FormFieldInput } from "@/components/shared/form-inputs/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { resetPassword } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import resetPasswordValidation from "@/validations/resetPassword.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { PulseLoader } from "react-spinners";

interface ResetPasswordFormProps {
  token: string;
  id: string;
}

const ResetPasswordForm = ({ token, id }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!token || !id) {
      return showErrorToast("Invalid or missing token or user ID.");
    }

    startTransition(async () => {
      const response = await resetPassword({
        token,
        id,
        password: data.password,
      });

      if (response.statusCode === 201) {
        form.reset();
        showSuccessToast(response.message || "Password reset successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        showErrorToast(response.message || "Something went wrong.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="border-2 h-full w-full max-w-md rounded-md bg-white px-10 pt-16 pb-10">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">Welcome Back!</p>
          <h2 className="text-2xl font-bold text-black mt-2">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-1">Nessa Foundation</p>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 space-y-6"
            >
              <FormFieldInput
                name="password"
                label="New Password"
                placeholder="Enter new password"
                type="password"
              />

              <FormFieldInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                type="password"
              />

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
              >
                {isPending ? <PulseLoader color="#ffffff" /> : "Reset Password"}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
