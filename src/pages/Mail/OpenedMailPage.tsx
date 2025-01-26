import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelectedFolder } from "../../contexts/mail/useSelectedFolder";
import { useParams } from "react-router-dom";
import { Letter } from "../../models/Letter";
import { useEffect, useState } from "react";
import { MailService } from "../../api/mails";
import DOMPurify from "dompurify";

const maxFileNameLength = 20;

export function OpenedMailPage() {
  const { selectedIndex } = useSelectedFolder();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<string>();
  const [letter, setLetter] = useState<Letter | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      try {
        if (id) {
          console.log(id);
          const response = await MailService.getMessageFromFolderById(
            Number(id),
            selectedIndex
          );
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
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, selectedIndex]);

  const handleDownload = (fileName: string) => {
    console.log(`Downloading file: ${fileName}`);
    // Implement your download logic here
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
          <h1 className="pl-6 pt-4 text-[26px]">{letter?.subject}</h1>
          <div className="flex flex-row justify-between">
            <h1 className="pl-6 pt-4 font-bold">{letter?.from}</h1>
            <h1 className="pr-6 pt-4 font-bold">
              {letter?.date?.toLocaleString()}
            </h1>
          </div>
          <p className="pl-6 font-mono text-gray-300">кому: {letter?.to}</p>
          <Divider />
          <Typography
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
        </>
      )}
    </div>
  );
}
