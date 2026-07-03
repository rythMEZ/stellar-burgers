import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector((state) => state.user.loginUserError);
  const isLoading = useSelector((state) => state.user.loginUserRequest);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isLoading) {
      return <Preloader />;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
