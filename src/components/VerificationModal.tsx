import { Modal, Box, Typography, Button } from "@mui/material";

export const VerificationModal: React.FC<{
  open: boolean;
  onClose: () => void;
  result: string | null;
}> = ({ open, onClose, result }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Проверка подписи
        </Typography>
        <Typography sx={{ mt: 2 }}>{result || "Loading..."}</Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};
