export default function Page() {
  return (
    <div className="fade-in">
      <h1 className="section-title">Welcome to BirdiAgro</h1>

      <div className="card">
        <div className="card-header">
          <span>🏠 Getting Started</span>
        </div>
        <div className="card-body">
          <p className="mb-4">
            Welcome to your poultry farm inventory management system!
          </p>
          <p className="mb-4">
            Use the sidebar to navigate to different sections:
          </p>
          <ul style={{ listStyle: "disc", marginLeft: "2rem" }}>
            <li className="mb-2">
              <strong>Dashboard</strong> - View overall statistics and recent
              activity
            </li>
            <li className="mb-2">
              <strong>Feeds</strong> - Manage feed inventory and purchases
            </li>
            <li className="mb-2">
              <strong>Kukhura</strong> - Track poultry batches and health
            </li>
            <li className="mb-2">
              <strong>Sales</strong> - Monitor sales and customer orders
            </li>
            <li className="mb-2">
              <strong>Settings</strong> - Configure system preferences
            </li>
          </ul>
          <div className="mt-6">
            <a href="/dashboard">
              <button className="btn-green">Go to Dashboard →</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
