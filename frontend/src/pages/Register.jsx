
import RegisterForm from '../components/auth/RegisterForm';
import Container from '../components/Container';

/**
 * Register Page
 * Wraps the RegisterForm component in the standard layout container
 */
const Register = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 lg:py-24">
      <Container>
        <div className="w-full flex justify-center">
          <RegisterForm />
        </div>
      </Container>
    </div>
  );
};

export default Register;
