import { AccountCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MailService } from "../api/mails";

export const SendFriendRequestModal: React.FC<{
  open: boolean;
  onClose: () => void;
  result: string | null;
}> = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    if (validateEmail(value)) {
      setEmailError("");
    } else {
      setEmailError("Некорректный адрес электронной почты");
    }
  };

  const sendFriendRequestClick = async () => {
    await MailService.sendFriendRequest(email);
    console.log(`Отправлен запрос в друзья к ${email}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          className="flex flex-row justify-center"
          variant="h6"
          component="h2"
        >
          Отправка заявки в друзья
        </Typography>
        <div className="mt-6 flex flex-row justify-center">
          <TextField
            id="input-with-icon-textfield"
            label="Email"
            sx={{ width: 450 }}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
            variant="standard"
          />
        </div>
        <div className="flex flex-row justify-between">
          <Button onClick={sendFriendRequestClick} sx={{ mt: 2, width: 100 }}>
            Отправить
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, width: 100 }}>
            Закрыть
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
