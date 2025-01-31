import { Paper, CircularProgress, Box, Snackbar } from "@mui/material";
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
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "from", headerName: "Отправитель", width: 200 },
  { field: "to", headerName: "Получатель", width: 200 },
  { field: "date", headerName: "Дата", width: 180 },
  { field: "subject", headerName: "Тема", width: 120 },
  {
    field: "isCrypted",
    headerName: "Шифр",
    width: 30,
    renderCell: (params) => (params.value ? "+" : "-"),
  },
  {
    field: "isSigned",
    headerName: "Подпись",
    width: 30,
    renderCell: (params) => (params.value ? "+" : "-"),
  },
  { field: "body", headerName: "Содержимое", flex: 1 },
];

export function MailPage() {
  const { selectedIndex } = useSelectedFolder();
  const [rows, setRows] = useState<Letter[]>([]);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageSize: 15,
    page: 1,
  });

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
    const { id, isCrypted, isSigned, subject } = params.row;
    const subjectString: string = subject.toString();
    let isFriendRequest: boolean = false;

    if (subjectString.includes("#@FriendRequest")) isFriendRequest = true;

    navigation(
      `/opened-mail/${id}?isCrypted=${isCrypted}&isSigned=${isSigned}&isFriendRequest=${isFriendRequest}`
    );
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
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
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
    </Paper>
  );
}
