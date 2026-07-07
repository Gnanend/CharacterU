
import PledgeForm from '../components/pledge/PledgeForm';
import Container from '../components/Container';

/**
 * Pledge Page
 * Renders the protected Pledge submission view.
 */
const Pledge = () => {
  return (
    <div className="min-h-[80vh] py-12 lg:py-16">
      <Container>
        <div className="w-full flex justify-center">
          <PledgeForm />
        </div>
      </Container>
    </div>
  );
};

export default Pledge;
