import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import api from '../services/config.services';
import { useNavigate } from 'react-router';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import { SignContainer, CardForSignContainer } from '../components/styled/Sytled_AuthForms';

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    profilePicture: ''
  });
  const navigate = useNavigate();

  const passwordServerValidationRules = "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character"

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validatePassword = (password: string) => {
    // Use rules and regex from server to validate password in form
    const passwordServerRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !passwordServerRegex.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage(passwordServerValidationRules);
      return false
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
      return true
    }
  }

  const validateEmail = (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
      return true
    }
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    let isValid = true;


    isValid = validateEmail(email.value) && isValid
    isValid = validatePassword(password.value) && isValid

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'email') validateEmail(value);
    if (name === 'password') validatePassword(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return; //todo: Is this a good idea? preventing the request send if validation fails, but it might be incorrect if server updates validation rules and they are not longer in sync with the frontend.
    const newUser = {
      name: formData.name,
      username: formData.name + '_username',
      email: formData.email,
      password: formData.password,
      profilePicture: formData.profilePicture,
    };

    try {
      const response = await api.post('/auth/signup', newUser);
      console.log(response);
      navigate('/sign-in');

    } catch (error: any) {
      if (error.response && (error.response.status >= 400 || error.response.status <= 500)) {
        console.log('4** error:', error.response.data.errorMessage)
        setServerErrorMessage(error.response.data.errorMessage)
      } else {
        console.log(error?.response)
        navigate("/error")
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignContainer direction="column" justifyContent="space-between">
        <CardForSignContainer variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Your name"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
                value={formData.name}
                onChange={handleOnChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
                value={formData.email}
                onChange={handleOnChange}
              />
            </FormControl>
            <FormControl error={passwordError}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <OutlinedInput
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type={showPassword ? 'text' : 'password'}
                id="password"
                // autoComplete="new-password"
                // variant="outlined"
                // error={passwordError}
                // helperText={passwordValidationRules}
                color={passwordError ? 'error' : 'primary'}
                value={formData.password}
                onChange={handleOnChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={showPassword ? 'hide the password' : 'display the password'}
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                aria-describedby='password-helper-text'
              />
              <FormHelperText id={"password-helper-text"}> {passwordErrorMessage !== '' ? passwordErrorMessage : passwordServerValidationRules} </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign up
            </Button>
          </Box>
          {serverErrorMessage !== ''
            ? <Alert severity="error"> {serverErrorMessage}  </Alert>
            : null
          }
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              disabled
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              disabled
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/sign-in')}
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardForSignContainer>
      </SignContainer>
    </AppTheme>
  );
}
