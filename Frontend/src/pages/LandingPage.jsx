import image from '../assets/images/landingpage-banner.jpg';
import '../styles/landingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <img src={image} alt="Homepage Banner" className="landing-page-image" />
      <div className="content">
        <h1 className="welcome-message">Welcome to SELFIT</h1>
        <a href="/a/register" className="register-button">
          START NOW
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
