import { Paper, CircularProgress, Box } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { MailService } from "../../api/mails";
import { useEffect, useState } from "react";
import { Letter } from "../../models/Letter";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "from", headerName: "Отправитель", width: 200 },
  { field: "to", headerName: "Получатель", width: 200 },
  { field: "date", headerName: "Дата", width: 180 },
  { field: "body", headerName: "Содержимое", flex: 1 },
];

export function MailPage() {
  const [rows, setRows] = useState<Letter[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 15,
  });
  const [loading, setLoading] = useState<boolean>(false); // Состояние для загрузки

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Устанавливаем загрузку в true перед запросом
      try {
        const response = await MailService.getMessagesFromFolderWithPagination(
          1,
          paginationModel.page,
          paginationModel.pageSize
        );
        setRows(response.data.result!);
        console.log(paginationModel.page);
        console.log(response.data.result!);
      } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
      } finally {
        setLoading(false); // Устанавливаем загрузку в false после завершения запроса
      }
    };

    fetchMessages();
  }, [paginationModel]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      {loading ? ( // Условный рендеринг лоудера
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => {
            setPaginationModel(newModel);
          }}
          checkboxSelection
          sx={{ border: 0 }}
        />
      )}
    </Paper>
  );
}
