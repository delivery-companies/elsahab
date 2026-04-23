// import Logo from "@/assets/auth-image.png";
import { getLoginMetadata, type LoginMetadata } from "@/lib/getLoginMetadata";
import type { APIError } from "@/models";
import { signInService, type SignInRequest } from "@/services/signInService";
import { useAuth } from "@/store/authStore";
import { Button, PasswordInput, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import loginBK from "@/assets/login.svg";
import logo from "@/assets/logo-light.png";

const schema = z.object({
  username: z.string().min(3, { message: "يجب ان يكون اكثر من 3 احرف" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب ان تكون اكثر من 6 احرف" }),
});

export const LoginScreen = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // const [geolocationGranted, setGeolocationGranted] = useState<boolean>(false);
  const [loginMetadata, setLoginMetadata] = useState<LoginMetadata | undefined>(
    undefined,
  );

  useEffect(() => {
    getLoginMetadata().then((data) => {
      setLoginMetadata(data);
    });
  }, []);

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ password, username, ...loginMetadata }: SignInRequest) => {
      return signInService({ password, username, ...loginMetadata });
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
      navigate("/orders");
      setAuth(data);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    const performLogin = () => {
      login({
        password: values.password,
        username: values.username,
        ...loginMetadata,
      });
    };

    performLogin();
  };

  return (
    <div className="h-screen flex login-page">
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{
          width: "400px",
          height: "100vh",
          position: "relative",
          paddingTop: "30px",
          backgroundColor: "#9F1624",
        }}
        className="flex flex-col justify-center items-center px-10  border-border">
        <div className="head">
          <img
            src={logo}
            style={{
              position: "absolute",
              top: "60px",
              left: "0",
              right: "50%",
              width: "300px",
              transform: "translateX(50%)",
            }}
          />
        </div>
        <Title order={2} ta="center" mt="md" mb={50} className="text-[#FFF6F6]">
          مرحبا بك لوحة التحكم!
        </Title>

        <TextInput
          placeholder="اسم المستخدم"
          size="md"
          className="w-full"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          placeholder="كلمه المرور"
          mt="md"
          size="md"
          className="w-full"
          {...form.getInputProps("password")}
        />
        <Button
          loading={isLoading}
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          style={{ background: "#f5b7b5ff", color: "#9F1624" }}>
          تسجيل الدخول
        </Button>
      </form>
      <div
        className="login-image flex flex-col justify-center items-center"
        style={{
          width: "calc(100% - 400px)",
          height: "100vh",
          backgroundColor: "#9f16241d",
        }}>
        <img src={loginBK} style={{ width: "80%" }} />
      </div>
    </div>
  );
};
