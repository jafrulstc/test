// ~/features/auth/components/LoginForm.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { login, selectAuthLoading, selectAuthError, clearError } from '~/features/auth/store/authSlice';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { tPath } from '~/shared/utils/translateType';
import { loginSchema } from '~/features/auth/schemas/authSchema';

type LoginFormData = {
  username: string;
  password: string;
  module: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();



  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      module: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(clearError());
      await dispatch(login(data)).unwrap();
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(t(tPath.auth.login.errors.loginFailed), err);
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((s) => !s);

  // অপশন লেবেলগুলোও i18n
  const MODULE_OPTIONS = [
    { value: 'hostel', label: t(tPath.auth.login.module.options.hostel) },
    { value: 'education', label: t(tPath.auth.login.module.options.education) },
    { value: 'accounts', label: t(tPath.auth.login.module.options.accounts) },
    { value: 'library', label: t(tPath.auth.login.module.options.library) },
    { value: 'boarding', label: t(tPath.auth.login.module.options.boarding) },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {t(tPath.auth.login.title)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(tPath.auth.login.subtitle)}
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Username Field */}
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t(tPath.auth.login.username.label)}
                      placeholder={t(tPath.auth.login.username.placeholder)}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                {/* Password Field */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label={t(tPath.auth.login.password.label)}
                      placeholder={t(tPath.auth.login.password.placeholder)}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              disabled={loading}
                              aria-label={t(tPath.auth.login.password.label)}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                {/* Module Selection Field */}
                <Controller
                  name="module"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.module} disabled={loading}>
                      <InputLabel>{t(tPath.auth.login.module.label)}</InputLabel>
                      <Select
                        {...field}
                        label={t(tPath.auth.login.module.label)}
                        startAdornment={
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">
                          <em>{t(tPath.auth.login.module.placeholder)}</em>
                        </MenuItem>
                        {MODULE_OPTIONS.map((m) => (
                          <MenuItem key={m.value} value={m.value}>
                            {m.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.module && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                          {errors.module.message}
                        </Box>
                      )}
                    </FormControl>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: '2px solid transparent',
                          borderTopColor: 'inherit',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      {t(tPath.auth.login.button.signingIn)}
                    </Box>
                  ) : (
                    t(tPath.auth.login.button.signIn)
                  )}
                </Button>
              </Box>
            </Box>

            {/* Demo Credentials (commented out) */}
            {/* keep as is */}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
