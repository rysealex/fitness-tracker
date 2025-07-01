import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// form dialog for the delete account feature
export default function FormDialog() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
  };

  // function to handle the delete account action
  const handleDelete = async () => {
    // get the current users user_id from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }
    // check if the password is provided
    if (!password) {
      console.error("Password is required to delete the account.");
      return;
    }
    try {
      // try to delete the user account
      const response = await fetch(`http://localhost:5000/auth/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId, 
          password: password 
        }),
      });
      // chceck if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log("User account deleted successfully:", data);
        // clear the userId, password, and username from local storage
        localStorage.removeItem('userId');
        localStorage.removeItem('password');
        localStorage.removeItem('username');
        handleNavigate('/');
      } else {
        console.error("Failed to delete user account:", response.statusText);
        return;
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      return;
    } finally {
      handleClose(); // close the dialog after the delete action
    }
  };

  return (
    <React.Fragment>
      <Button 
				variant='contained'
				style={{
					backgroundColor: '#C51D34'
				}}
    		onClick={handleClickOpen}>
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Delete Account Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? 
						If so, please enter your current password.
          </DialogContentText>
          <TextField
            autoFocus
            required={true}
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="button" onClick={handleDelete}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}