import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page-section">
      <div className="container text-center">
        <p className="eyebrow">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-copy">The page you are looking for does not exist.</p>
        <div className="actions center-actions">
          <Link className="button button-primary" to="/">Go home</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
