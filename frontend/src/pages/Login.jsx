
import LoginForm from '../components/auth/LoginForm';
import Container from '../components/Container';

/**
 * Login Page
 * Wraps the LoginForm component in the standard layout container
 */
const Login = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 lg:py-24">
      <Container>
        <div className="w-full flex justify-center">
          <LoginForm />
        </div>
      </Container>
    </div>
  );
};

export default Login;
