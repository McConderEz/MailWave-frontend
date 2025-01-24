import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MailService } from "../../api/mails";
import { useEffect, useState } from "react";
import { Letter } from "../../models/Letter";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "from", headerName: "Отправитель", width: 200 },
  { field: "to", headerName: "Получатель", width: 200 },
  { field: "date", headerName: "Дата", width: 150 },
  { field: "body", headerName: "Содержимое", flex: 1 },
];

export function MailPage() {
  const [rows, setRows] = useState<Letter[]>([]);
  const paginationModel = { page: 1, pageSize: 15 };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await MailService.getMessagesFromFolderWithPagination(
          0,
          paginationModel.page,
          paginationModel.pageSize
        );
        setRows(response.data.result!);
        console.log(response.data.result!);
      } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
      }
    };

    fetchMessages();
  }, [paginationModel.page, paginationModel.pageSize]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
