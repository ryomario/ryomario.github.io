'use client';

import MuiCard from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import { loginWithPassword } from "@/utils/auth";
import { useAuthContext } from "@/auth/AuthProvider";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { SplashScreen } from "@/components/loadingScreen/SplashScreen";
import { AdminRoute } from "@/types/EnumAdminRoute";

type FormValuesType = {
  password: string;
}

export function ViewLogin() {
  const { checkUserSession, authenticated, authenticating } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValuesType>({
    defaultValues: {
      password: '',
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = handleSubmit(async (values: FormValuesType) => {
    try {
      await loginWithPassword(values.password);
      await checkUserSession?.();

      router.replace(searchParams.get('returnTo') ?? AdminRoute.DASHBOARD);
    } catch (error: any) {
      const message = error.message || error || 'Unknown error';
      setError('password', { type: 'validate', message, }, { shouldFocus: true });
    }
  });

  if(authenticating) {
    return <SplashScreen/>;
  }

  if(authenticated) {
    return redirect(searchParams.get('returnTo') ?? AdminRoute.DASHBOARD);
  }

  return <>
    <SignInContainer direction="column" justifyContent="space-between">
      <Card>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}
        >Log in</Typography>
        <Typography textAlign="center">
          Welcome to admin side, please enter password to continue
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <TextField
            {...register('password', { required: true })}
            error={!!errors.password}
            helperText={errors.password?.message}
            color={!!errors.password ? 'error' : 'primary'}
            label="Password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in' : 'Log in with password'}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  </>
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));
