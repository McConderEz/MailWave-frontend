import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "Sender", headerName: "Отправитель", width: 130 },
  { field: "Reciever", headerName: "Получатель", width: 130 },
  { field: "Date", headerName: "Дата", width: 130 },
];

const rows = [];

const paginationModel = { page: 0, pageSize: 15 };

export function MailPage() {
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
