import { Button, TextField } from "@mui/material";
import { ContentBlock } from "../../components/ContentBlock";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFields = {
  email: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const onSubmit = (data: LoginFields) => {};

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col h-full px-2 sm:px-8 py-2 sm:py-5">
        <div className="flex-1 flex">
          <ContentBlock>
            <div className="h-screen flex justify-center items-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center gap-7"
              >
                <TextField
                  variant="standard"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  {...register("email", {
                    required: "Это поле обязательно для заполнения",
                    validate: (value) => {
                      if (!value.includes("@")) {
                        return "Некорректный формат почты";
                      }
                    },
                  })}
                />
                <TextField
                  variant="standard"
                  type="password"
                  label="Пароль"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  {...register("password", {
                    required: "Это поле обязательно для заполнения",
                    validate: (value) => {
                      if (value.length < 6) {
                        return "Некорректный формат пароля";
                      }
                    },
                  })}
                />
                <Button type="submit" className="mt-4">
                  Войти
                </Button>
              </form>
            </div>
          </ContentBlock>
        </div>
      </main>
    </div>
  );
}
