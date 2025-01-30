import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Обработчик открытия меню
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FormatColorTextIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        {/* Элементы меню */}
        <MenuItem onClick={handleClose}>
          <FormatItalicIcon />
          Курсив
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FormatBoldIcon />
          Жирный
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FormatColorTextIcon />
          Цвет текста
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FormatUnderlinedIcon />
          Подчеркивание
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FormatSizeIcon />
          Размер шрифта
        </MenuItem>
      </Menu>
    </div>
  );
};

/*
export function SendMailPage() {
  return (
    <div>
      <div className="flex flex-row ml-6 mt-4">
        <span>Новое сообщение</span>
      </div>
      <div className="flex flex-col ml-6 mt-2 mr-6">
        <TextField id="standard-basic" label="Получатель" variant="standard" />
        <TextField id="standard-basic" label="Тема" variant="standard" />
      </div>
      <div className="flex flex-col ml-6 mt-5 mr-6">
        <TextField
          id="outlined-multiline-static"
          label="Содержимое"
          multiline
          rows={20}
          className="flex flex-col mt-6"
        />
      </div>
      <div className="flex flex-col ml-6">
        <div className="flex flex-row">
          <FormControlLabel control={<Switch />} label="Зашифровать" />
        </div>
        <div className="flex flex-row">
          <FormControlLabel control={<Switch />} label="Подписать" />
        </div>
      </div>
      <div className="flex flex-row ml-6 mt-16 gap-2">
        <Button variant="contained">Отправить</Button>
        <IconButton aria-label="check">
          <AttachFileIcon />
        </IconButton>
        <DropdownMenu />
      </div>
    </div>
  );
}*/

export function SendMailPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSendNow = () => {
    handleMenuClose();
    // Логика для отправки сейчас
    console.log("Письмо отправлено сейчас");
  };

  const handleScheduleSend = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleScheduleConfirm = () => {
    setOpenDialog(false);
    // Логика для запланированной отправки
    console.log("Письмо запланировано на", scheduledTime);
  };

  return (
    <div>
      <div className="flex flex-row ml-6 mt-4">
        <span>Новое сообщение</span>
      </div>
      <div className="flex flex-col ml-6 mt-2 mr-6">
        <TextField id="standard-basic" label="Получатель" variant="standard" />
        <TextField id="standard-basic" label="Тема" variant="standard" />
      </div>
      <div className="flex flex-col ml-6 mt-5 mr-6">
        <TextField
          id="outlined-multiline-static"
          label="Содержимое"
          multiline
          rows={20}
          className="flex flex-col mt-6"
        />
      </div>
      <div className="flex flex-col ml-6">
        <div className="flex flex-row">
          <FormControlLabel control={<Switch />} label="Зашифровать" />
        </div>
        <div className="flex flex-row">
          <FormControlLabel control={<Switch />} label="Подписать" />
        </div>
      </div>
      <div className="flex flex-row ml-6 mt-16 gap-2">
        <Button variant="contained" onClick={handleMenuClick}>
          Отправить
        </Button>
        <IconButton aria-label="check">
          <AttachFileIcon />
        </IconButton>
        <DropdownMenu />
      </div>

      {/* Меню для кнопки "Отправить" */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSendNow}>Отправить сейчас</MenuItem>
        <MenuItem onClick={handleScheduleSend}>Запланировать отправку</MenuItem>
      </Menu>

      {/* Диалог для выбора времени отправки */}
      <Dialog open={openDialog} onClose={handleDialogClose} >
        <DialogTitle>Запланировать отправку</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Выберите дату и время"
              value={scheduledTime}
              onChange={(newValue) => setScheduledTime(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleScheduleConfirm}>Запланировать</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
