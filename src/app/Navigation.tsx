import {
  AppBar,
  Button,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";
import { useContext } from "react";
import { AccountsService } from "../api/accounts";

const drawerWidth = 240;

export function Navigation() {
  return (
    <div>
      <SlideBar />
    </div>
  );
}

export function Header() {
  const accessToken = useContext(AuthContext)?.accessToken;
  const navigate = useNavigate();

  const handleLogout = () => {
    AccountsService.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-row items-center justify-between py-2 px-3">
      <NavLink to="/" className="text-2xl">
        MailWave
      </NavLink>
      <div className="flex flex-row items-center">
        {accessToken === undefined ? (
          <NavLink to="/login" color="inherit" className="mr-4">
            Войти
          </NavLink>
        ) : (
          <>
            <NavLink to="/profile" color="inherit" className="mr-4">
              Профиль
            </NavLink>
            <Button onClick={handleLogout}>Выход</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SlideBar() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Header />
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <div className="flex flex-row items-center justify-between py-2 px-3">
            <Button color="inherit" variant="contained" endIcon={<SendIcon />}>
              Отправить
            </Button>
          </div>
          <List>
            {["Входящие", "Избранные", "Отправленные", "Черновики"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            {["Вся почта", "Корзина", "Спам"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
