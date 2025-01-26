import { Paper, CircularProgress, Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { MailService } from "../../api/mails";
import { useCallback, useEffect, useState } from "react";
import { Letter } from "../../models/Letter";
import { useSelectedFolder } from "../../contexts/mail/useSelectedFolder";
import { useNavigate } from "react-router-dom";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "from", headerName: "Отправитель", width: 200 },
  { field: "to", headerName: "Получатель", width: 200 },
  { field: "date", headerName: "Дата", width: 180 },
  { field: "subject", headerName: "Тема", width: 150 },
  { field: "body", headerName: "Содержимое", flex: 1 },
];

export function MailPage() {
  const { selectedIndex } = useSelectedFolder();
  const [rows, setRows] = useState<Letter[]>([]);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageSize: 15,
    page: 1,
  });

  const navigation = useNavigate();

  useEffect(() => {
    setPagination({ pageSize: 15, page: 1 });
  }, [selectedIndex]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await MailService.getMessagesFromFolderWithPagination(
          selectedIndex,
          pagination.page,
          pagination.pageSize
        );

        const rowCountResponse = await MailService.getMessagesCountFromFolder(
          selectedIndex
        );

        setRowsCount(rowCountResponse.data.result!);
        setRows(response.data.result!);
      } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedIndex, pagination.page, pagination.pageSize]);

  const handlePaginationChange = useCallback(
    (newModel: GridPaginationModel) => {
      setPagination((old) => ({
        ...old,
        page: newModel.page,
      }));
    },
    []
  );

  const handleRowClick = (params: GridRowParams) => {
    navigation(`/opened-mail/${params.id}`);
  };

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      {loading ? (
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
          rowCount={rowsCount}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={handlePaginationChange}
          onRowClick={handleRowClick}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      )}
    </Paper>
  );
}
