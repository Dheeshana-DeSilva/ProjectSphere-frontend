function PlaceholderPage({ role, title }) {
  return (
    <section className="page-section">
      <div className="container">
        <div className="panel placeholder-panel">
          <p className="eyebrow">{role} workspace</p>
          <h1 className="section-title">{title}</h1>
          <p className="page-copy">
            This workspace is ready for the next feature view. Navigation and access control are already in place.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PlaceholderPage;
