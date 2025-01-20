import { Button, TextField } from "@mui/material";
import { ContentBlock } from "../../components/ContentBlock";

export function LoginPage() {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col h-full px-2 sm:px-8 py-2 sm:py-5">
        <div className="flex-1 flex">
          <ContentBlock>
            <div className="h-screen flex justify-center items-center">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  console.log("submit");
                }}
                className="flex flex-col items-center gap-7"
              >
                <TextField variant="standard" label="Email" fullWidth />
                <TextField variant="standard" label="Пароль" fullWidth />
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
