import {
  Button,
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
}
