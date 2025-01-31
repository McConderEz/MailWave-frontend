import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelectedFolder } from "../../contexts/mail/useSelectedFolder";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Letter } from "../../models/Letter";
import { useEffect, useState } from "react";
import { MailService } from "../../api/mails";
import DOMPurify from "dompurify";
import {
  Delete,
  DomainVerification,
  PersonAddAlt,
  Save,
} from "@mui/icons-material";
import { VerificationModal } from "../../components/VerificationModal";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const maxFileNameLength = 20;

export function OpenedMailPage() {
  const { selectedIndex } = useSelectedFolder();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<string>();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  );

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

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isCrypted = queryParams.get("isCrypted");
  const isSigned = queryParams.get("isSigned");
  const isFriendRequest = queryParams.get("isFriendRequest");

  console.log(isCrypted);
  console.log(isSigned);

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      try {
        if (id) {
          console.log(id);

          let response;

          if (isCrypted || isSigned) {
            response =
              await MailService.getCryptedAndSignedMessageFromFolderById(
                Number(id),
                selectedIndex
              );
          } else if (isFriendRequest) {
            response = await MailService.getMessageFromFolderById(
              Number(id),
              selectedIndex
            );
          } else {
            response = await MailService.getMessageFromFolderById(
              Number(id),
              selectedIndex
            );
          }

          console.log(response.data.result!);
          if (response.data && response.data.result) {
            const result = response.data.result;

            const fetchedLetter: Letter = {
              id: result.id,
              from: result.from,
              to: result.to,
              body: result.body,
              attachmentNames: result.attachmentNames,
              subject: result.subject,
              folder: result.folder,
              emailPrefix: result.emailPrefix,
              date: new Date(result.date),
              isCrypted: result.isCrypted,
              isSigned: result.isSigned,
            };
            setLetter(fetchedLetter);
            console.log(fetchedLetter);
          }
        }
      } catch (error) {
        console.log(error);
        showSnackbar("Произошла ошибка при открытии письма", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, isCrypted, isFriendRequest, isSigned, selectedIndex]);

  const handleVerify = async () => {
    try {
      const response = await MailService.verificationMessage(
        parseInt(id!),
        selectedIndex
      );
      setVerificationResult(response.data.result);
      setIsModalOpen(true);
    } catch (error) {
      showSnackbar("Произошла ошибка при верификации письма", "error");
      console.error("Error verifying message:", error);
      setVerificationResult("Error verifying message");
      setIsModalOpen(true);
    }
  };

  const handleDownload = async (fileName: string) => {
    console.log(`Downloading file: ${fileName}`);
    try {
      await MailService.saveFile(
        "D:\\",
        fileName,
        parseInt(id!),
        selectedIndex
      );

      console.log(`File ${fileName} downloaded`);
    } catch (error) {
      showSnackbar("Произошла ошибка загрузке вложения", "error");
      console.error("Error downloading file:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await MailService.deleteMessage(parseInt(id!), selectedIndex);
      console.log(`message ${id} was deleted`);
      navigate("/mail");
    } catch (error) {
      console.log(error);
      showSnackbar("Произошла ошибка при удалении письма", "error");
    }
  };

  const handleSave = async () => {
    try {
      await MailService.saveMessage([parseInt(id!)], selectedIndex);
      console.log(`message ${id} was saved`);
      navigate("/mail");
    } catch (error) {
      console.log(error);
      showSnackbar("Произошла ошибка при сохранении письма", "error");
    }
  };

  const handleAcceptFriendship = async () => {
    try {
      await MailService.acceptFriendship(parseInt(id!), selectedIndex);
      console.log("accepted friendship");
    } catch (error) {
      console.log(error);
      showSnackbar("Произошла ошибка при принятия запроса в друзья", "error");
    }
  };

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="pl-6 pt-4 text-[26px]">{letter?.subject}</h1>
            <div className="pr-6 pt-4">
              <IconButton aria-label="check" onClick={handleSave}>
                <Save />
              </IconButton>
              <IconButton aria-label="check" onClick={handleDelete}>
                <Delete />
              </IconButton>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <h1 className="pl-6 pt-4 font-bold">{letter?.from}</h1>
            <h1 className="pr-6 pt-4 font-bold">
              {letter?.date?.toLocaleString()}
            </h1>
          </div>
          <p className="pl-6 font-mono text-gray-300">кому: {letter?.to}</p>
          <Divider />
          <Typography
            style={{ wordWrap: "break-word" }}
            className="pl-6 pt-2 pr-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(letter?.body ?? ""),
            }}
          />
          <Divider />
          <h1 className="pl-6 pt-4 font-bold">Прикрепленные файлы</h1>
          <div className="pl-6 pt-2 flex flex-wrap gap-2">
            {letter?.attachmentNames?.map((file, index) => (
              <Chip
                key={index}
                icon={
                  <Tooltip title="Скачать файл" arrow>
                    <DownloadIcon
                      onClick={() => handleDownload(file)}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                }
                label={`${
                  file.length > maxFileNameLength
                    ? `${file.slice(0, maxFileNameLength - 3)}...`
                    : file
                }`}
                variant="outlined"
              />
            ))}
          </div>
          {isSigned === "true" ? (
            <div className="pl-4 pt-2">
              <IconButton aria-label="check" onClick={handleVerify}>
                <DomainVerification />
              </IconButton>
            </div>
          ) : (
            <div></div>
          )}
          {isFriendRequest === "true" ? (
            <div className="pl-4 pt-2">
              <IconButton aria-label="check" onClick={handleAcceptFriendship}>
                <PersonAddAlt />
              </IconButton>
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
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
      <VerificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={verificationResult}
      />
    </div>
  );
}
