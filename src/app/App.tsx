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
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

export function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default function Header() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <div className="flex flex-row items-center justify-between py-2 px-3">
          <NavLink to="/" className="text-2xl">MailWave</NavLink>
          <Button color="inherit">Войти</Button>
        </div>
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
