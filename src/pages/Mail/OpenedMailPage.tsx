import { Chip, Divider, Tooltip, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export function OpenedMailPage() {
  const maxFileNameLength = 20;
  const attachedFiles = [
    { name: "very_long_file_name_that_exceeds_the_limit.pdf", size: "2.5 MB" },
    { name: "image.jpg", size: "1.2 MB" },
    { name: "document_with_a_long_name.docx", size: "3.1 MB" },
  ];

  const handleDownload = (fileName: string) => {
    console.log(`Downloading file: ${fileName}`);
    // Implement your download logic here
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="pl-6 pt-4 font-bold">minoddein.ezz@gmail.com</h1>
        <h1 className="pr-6 pt-4 font-bold">26.01.2024</h1>
      </div>
      <p className="pl-6 font-mono text-gray-300">
        кому: rustamov.vladislav@mail.ru
      </p>
      <Divider />
      <Typography className="pl-6 pt-2 pr-6">
        Заходит поручик Ржевский и говорит: - Господа! У меня для вас две
        новости! Одна плохая, другая очень плохая! Все: - Давай плохую! Поручик:
        - Вселенная расширяется! Все: - А очень плохая? Поручик: - Мы еще
        трезвые!
      </Typography>
      <Divider />
      <h1 className="pl-6 pt-4 font-bold">Прикрепленные файлы</h1>
      <div className="pl-6 pt-2 flex flex-wrap gap-2">
        {attachedFiles.map((file, index) => (
          <Chip
            key={index}
            icon={
              <Tooltip title="Скачать файл" arrow>
                <DownloadIcon
                  onClick={() => handleDownload(file.name)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            }
            label={`${
              file.name.length > maxFileNameLength
                ? `${file.name.slice(0, maxFileNameLength - 3)}...`
                : file.name
            } (${file.size})`}
            variant="outlined"
          />
        ))}
      </div>
    </div>
  );
}
