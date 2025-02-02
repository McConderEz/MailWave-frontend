import {
  AppBar,
  Button,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";
import { useContext, useState } from "react";
import { AccountsService } from "../api/accounts";
import { useSelectedFolder } from "../contexts/mail/useSelectedFolder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { SendFriendRequestModal } from "../components/SendFriendRequestModal";

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
  const setAccessToken = useContext(AuthContext)?.setAccessToken;
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      AccountsService.logout();
      setAccessToken(undefined);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
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
  const { setSelectedIndex } = useSelectedFolder();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sendRequestResult, setSendRequestResult] = useState<string | null>(
    null
  );

  const handleListItemClick = (index: number) => {
    console.log(index);
    setSelectedIndex(index);
    navigate("/mail");
  };

  const handleAddFriend = async () => {
    try {
      setSendRequestResult(null);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      setSendRequestResult("Error sending request message");
      setIsModalOpen(true);
    }
  };

  const handleSendButton = () => {
    navigate("/send-mail");
  };

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
            <Button
              onClick={handleSendButton}
              color="inherit"
              variant="contained"
              endIcon={<SendIcon />}
            >
              Отправить
            </Button>
            <IconButton onClick={handleAddFriend}>
              <PersonAddIcon />
            </IconButton>
          </div>
          <List>
            {["Входящие", "Отправленные", "Черновики","Спам", "Корзина"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton onClick={() => handleListItemClick(index)}>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
      <SendFriendRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={sendRequestResult}
      />
    </Box>
  );
}
