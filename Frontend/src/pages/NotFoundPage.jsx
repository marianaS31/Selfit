import NotFound from '../components/NotFound';
import '../styles/notFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-message-container">
        <NotFound />
      </div>
    </div>
  );
}

export default NotFoundPage;
