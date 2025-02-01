import {
  Paper,
  CircularProgress,
  Box,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
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
import { MoreVert } from "@mui/icons-material";

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

  const folders = [
    { index: 0, name: "Входящие" },
    { index: 1, name: "Отправленные" },
    { index: 2, name: "Черновики" },
    { index: 3, name: "Корзина" },
    { index: 4, name: "Спам" },
  ];

  const getAvailableFolders = (currentFolderIndex: number) => {
    return folders.filter((folder) => folder.index !== currentFolderIndex);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "from", headerName: "Отправитель", width: 200 },
    { field: "to", headerName: "Получатель", width: 200 },
    { field: "date", headerName: "Дата", width: 180 },
    { field: "subject", headerName: "Тема", width: 160 },
    {
      field: "isCrypted",
      headerName: "Шифр",
      width: 80,
      renderCell: (params) => (params.value ? "+" : "-"),
    },
    {
      field: "isSigned",
      headerName: "Подпись",
      width: 80,
      renderCell: (params) => (params.value ? "+" : "-"),
    },
    { field: "body", headerName: "Содержимое", flex: 1 },
    {
      field: "actions",
      headerName: "Действия",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={(event) => handleActionClick(event, params.row)}
          aria-label="more"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    row: Letter
  ) => {
    event.stopPropagation();
    setContextMenu({ anchorEl: event.currentTarget, selectedRow: row });
  };

  const [contextMenu, setContextMenu] = useState<{
    anchorEl: HTMLElement | null;
    selectedRow: Letter | null;
  }>({ anchorEl: null, selectedRow: null });

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

  const handleCloseContextMenu = () => {
    setContextMenu({ anchorEl: null, selectedRow: null });
  };

  const handleMoveToFolder = async (folderIndex: number) => {
    if (contextMenu.selectedRow) {
      try {
        const formData = new FormData();
        formData.append("SelectedFolder", selectedIndex.toString());
        formData.append("TargetFolder", folderIndex.toString());

        await MailService.MoveMessage(contextMenu.selectedRow.id, formData);

        showSnackbar("Письмо успешно перемещено", "success");
        const updatedRows = rows.filter(
          (row) => row.id !== contextMenu.selectedRow!.id
        );
        setRows(updatedRows);
      } catch (error) {
        console.error("Ошибка при перемещении письма:", error);
        showSnackbar("Ошибка при перемещении письма", "error");
      } finally {
        handleCloseContextMenu();
      }
    }
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
      <Menu
        open={Boolean(contextMenu.anchorEl)}
        onClose={handleCloseContextMenu}
        anchorEl={contextMenu.anchorEl}
      >
        {getAvailableFolders(selectedIndex).map((folder) => (
          <MenuItem
            key={folder.index}
            onClick={() => handleMoveToFolder(folder.index)}
          >
            {folder.name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}
