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
import { SyntheticEvent, useRef, useState } from "react";
import { MailService } from "../../api/mails";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";

interface SelectedTextRange {
  start: number | null;
  end: number | null;
}

const DropdownMenu: React.FC<{
  setBody: (newBody: string) => void;
  textFieldRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>; // Добавляем пропс
}> = ({ setBody, textFieldRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const getSelectedText = (): SelectedTextRange => {
    const textField = textFieldRef.current;
    console.log(textField?.value);
    if (textField) {
      return {
        start: textField.selectionStart,
        end: textField.selectionEnd,
      };
    }
    return { start: null, end: null };
  };

  const wrapSelectedTextWithTag = (tag: string) => {
    const { start, end } = getSelectedText();
    if (start !== null && end !== null) {
      const beforeSelectedText =
        textFieldRef.current?.value.slice(0, start) || "";
      const selectedText = textFieldRef.current?.value.slice(start, end) || "";
      const afterSelectedText = textFieldRef.current?.value.slice(end) || "";
      const newBody = `${beforeSelectedText}<${tag}>${selectedText}</${tag}>${afterSelectedText}`;
      setBody(newBody);
    }
  };

  const handleMenuItemClick = (tag: string) => {
    wrapSelectedTextWithTag(tag);
    handleClose();
  };

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
        <MenuItem onClick={() => handleMenuItemClick("i")}>
          <FormatItalicIcon />
          Курсив
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("b")}>
          <FormatBoldIcon />
          Жирный
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('span style="color: red;"')}
        >
          <FormatColorTextIcon />
          Цвет текста
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("u")}>
          <FormatUnderlinedIcon />
          Подчеркивание
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('span style="font-size: 20px;"')}
        >
          <FormatSizeIcon />
          Размер шрифта
        </MenuItem>
      </Menu>
    </div>
  );
};

export function SendMailPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const currentDateTime = new Date();

  const textFieldRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const [receivers, setReceiver] = useState<string>("");
  const [subject, setSubject] = useState<string | null>("");
  const [body, setBody] = useState<string | null>("");
  const [isCrypted, setIsCrypted] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);

  const [attachments, setAttachments] = useState<File[]>([]);
  const [openAttachmentDialog, setOpenAttachmentDialog] = useState(false);

  const handleAttachmentClick = () => {
    setOpenAttachmentDialog(true);
  };

  const handleAttachmentClose = () => {
    setOpenAttachmentDialog(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const navigation = useNavigate();

  const handleReceiverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSendNow = async () => {
    try {
      handleMenuClose();
      if (receivers) {
        const formData = new FormData();
        formData.append("subject", subject!);
        formData.append("body", body!);

        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        if (isCrypted || isSigned) {
          formData.append("isCrypted", isCrypted.toString());
          formData.append("isSigned", isSigned.toString());
          formData.append("receivers", receivers);
          await MailService.SendCryptedAndSignedMessage(formData);
        } else {
          const receiversArray = receivers.split(" ");

          for (let i = 0; i < receiversArray.length; i++) {
            formData.append(`Receivers[${i}]`, receiversArray[i]);
          }
          await MailService.SendMessage(formData);
        }
        console.log("Письмо отправлено сейчас");
        navigation("/");
      } else {
        console.log("Получатель не указан");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScheduleSend = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleScheduleConfirm = async () => {
    setOpenDialog(false);
    try {
      if (receivers) {
        const formData = new FormData();
        formData.append("subject", subject!);
        formData.append("body", body!);

        const isoScheduledTime = new Date(
          scheduledTime!.getTime() + 3 * 60 * 60 * 1000
        );

        formData.append("enqueueAt", isoScheduledTime.toISOString());

        console.log(isoScheduledTime.toISOString());
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        const receiversArray = receivers.split(" ");

        for (let i = 0; i < receiversArray.length; i++) {
          formData.append(`Receivers[${i}]`, receiversArray[i]);
        }
        await MailService.SendScheduledMessage(formData);

        console.log("Письмо отправлено сейчас");
        navigation("/");
      } else {
        console.log("Получатель не указан");
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Письмо запланировано на", scheduledTime);
  };

  function handleIsCryptedChange(
    event: SyntheticEvent<Element, Event>,
    checked: boolean
  ): void {
    console.log(checked);
    setIsCrypted(checked);
  }

  function handleIsSignedChange(
    event: SyntheticEvent<Element, Event>,
    checked: boolean
  ): void {
    console.log(checked);
    setIsSigned(checked);
  }

  return (
    <div>
      <div className="flex flex-row ml-6 mt-4">
        <span>Новое сообщение</span>
      </div>
      <div className="flex flex-col ml-6 mt-2 mr-6">
        <TextField
          id="standard-basic"
          label="Получатель"
          variant="standard"
          value={receivers}
          onChange={handleReceiverChange}
        />
        <TextField
          id="standard-basic"
          label="Тема"
          variant="standard"
          value={subject}
          onChange={handleSubjectChange}
        />
      </div>
      <div className="flex flex-col ml-6 mt-5 mr-6">
        <TextField
          id="outlined-multiline-static"
          label="Содержимое"
          multiline
          rows={20}
          className="flex flex-col mt-6"
          value={body}
          onChange={handleBodyChange}
          inputRef={textFieldRef}
        />
      </div>
      <div className="flex flex-col ml-6">
        <div className="flex flex-row">
          <FormControlLabel
            control={<Switch />}
            label="Зашифровать"
            defaultChecked={false}
            value={isCrypted}
            onChange={handleIsCryptedChange}
          />
        </div>
        <div className="flex flex-row">
          <FormControlLabel
            control={<Switch />}
            label="Подписать"
            defaultChecked={false}
            value={isSigned}
            onChange={handleIsSignedChange}
          />
        </div>
      </div>
      <div className="flex flex-row ml-6 mt-16 gap-2">
        <Button variant="contained" onClick={handleMenuClick}>
          Отправить
        </Button>
        <IconButton aria-label="check" onClick={handleAttachmentClick}>
          <AttachFileIcon />
        </IconButton>
        <DropdownMenu setBody={setBody} textFieldRef={textFieldRef} />
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Запланировать отправку</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Выберите дату и время"
              value={scheduledTime}
              onChange={(newValue) => setScheduledTime(newValue)}
              minDateTime={currentDateTime}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleScheduleConfirm}>Запланировать</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для добавления вложений */}
      <Dialog open={openAttachmentDialog} onClose={handleAttachmentClose}>
        <DialogTitle>Добавить вложения</DialogTitle>
        <DialogContent>
          <input type="file" multiple onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttachmentClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Отображение списка вложений */}
      <div className="flex flex-col ml-6 mt-4">
        {attachments.map((file, index) => (
          <div key={index} className="flex flex-row items-center gap-2">
            <span>{file.name}</span>
            <IconButton onClick={() => handleRemoveAttachment(index)}>
              <Close />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
