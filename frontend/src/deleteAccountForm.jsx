import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

// form dialog for the delete account feature
export default function DeleteAccountForm() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const passwordRef = useRef(null);

  const handleClickOpen = () => {
    setPassword("");
    setSuccessMessage("");
    setPasswordError("");
    setGeneralError("");
    setDeleteModalOpen(true);
  };

  const handleClose = () => {
    setPassword("");
    setSuccessMessage("");
    setPasswordError("");
    setGeneralError("");
    setDeleteModalOpen(false);
  };

  // function to handle the delete account action
  const handleDelete = async (e) => {
    e.preventDefault();

    // clear previous errors and success messages
    setPasswordError("");
    setGeneralError("");
    setSuccessMessage("");

   // perform input validation
    if (password === "") {
      setPasswordError("Password is required.");
      passwordRef.current.focus();
      return;
    }
    // get the current users user_id from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in local storage.");
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
        setSuccessMessage("Successfuly deleted account! You will be redirected shortly.");
        // clear success message and redirect to landing page after 3 sec
        setTimeout(() => {
          setSuccessMessage("");
          handleNavigate('/');
        }, 3000);
      } else {
        setPassword("");
        setSuccessMessage("");
        passwordRef.current.focus();
        setGeneralError("Failed to delete user account. Please try again.");
        console.error("Failed to delete user account:", response.statusText);
      }
    } catch (error) {
      setPassword("");
      setSuccessMessage("");
      passwordRef.current.focus();
      setGeneralError("Error deleting user account. Please try again.");
      console.error("Error deleting user account:", error);
    // } finally {
    //   if (!passwordError && !generalError) {
    //     handleClose(); // close the dialog after the delete action is successful
    //   }
    }
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
      >
        Delete Account
      </Button>
      {/* Delete account modal */}
      {deleteModalOpen && (
        <div>
          <h2>Delete Account</h2>
          <p>Are you sure you want to delete your account? This action cannot be undone.
             Please ensure your password to confirm.
          </p>
          <form onSubmit={handleDelete}>
            <div>
              <TextField
                label="Password"
                type='password'
                variant='outlined'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                inputRef={passwordRef}
              />
              {successMessage && (
                <Box sx={{ color: '#1dc51dff', mt: 2, textAlign: 'center' }}>
                  {successMessage}
                </Box>
              )}
              {generalError && (
                <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                  {generalError}
                </Typography>
              )}
            </div>
            <div>
              <Button
                type='button'
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type='submit'
              >
                Confirm Delete
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}