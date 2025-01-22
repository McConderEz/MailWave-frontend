import { AppBar, Avatar, Box } from "@mui/material";
import { Header } from "../../app/Navigation";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";

export function ProfilePage() {
  const accessToken = useContext(AuthContext)?.accessToken;
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Header />
      </AppBar>
      <div
        className="grid grid-row"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Box sx={{ marginTop: "64px", marginLeft: "20px" }}>
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            className="grid grid-row"
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <h1 style={{ marginLeft: "20px" }}>Имя пользователя</h1>
      </div>
    </Box>
  );
}
