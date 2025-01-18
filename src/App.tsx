import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import "./index.css";

export function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MailWave
          </Typography>
          <Button color="inherit">Войти</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
