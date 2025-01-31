import { Button, Skeleton, Snackbar, TextField } from "@mui/material";
import { ContentBlock } from "../../components/ContentBlock";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type LoginFields = {
  email: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<LoginFields>();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("error");

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFields) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      showSnackbar("Произошла ошибка авторизации", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <>
      {isLoading ? (
        <div>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      ) : (
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
                      sx={{ width: 350 }}
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
                      sx={{ width: 350 }}
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
                    <Button type="submit" className="mt-4" disabled={isLoading}>
                      Войти
                    </Button>
                  </form>
                </div>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                  >
                    {snackbarMessage}
                  </MuiAlert>
                </Snackbar>
              </ContentBlock>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
