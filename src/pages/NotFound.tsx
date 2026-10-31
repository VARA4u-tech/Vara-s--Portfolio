import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = '404: Page Not Found | Pappuri Durga Vara Prasad';

    // Inject noindex meta tag for error route
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalRobots = metaRobots ? metaRobots.content : 'index, follow';

    if (metaRobots) {
      metaRobots.content = 'noindex, nofollow';
    } else {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      metaRobots.content = 'noindex, nofollow';
      document.head.appendChild(metaRobots);
    }

    console.warn(
      '404 Page Not Found: Route requested does not exist ->',
      location.pathname,
    );

    return () => {
      document.title = 'Pappuri Durga Vara Prasad | Full Stack Developer & AI Engineer';
      if (metaRobots) {
        metaRobots.content = originalRobots;
      }
    };
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="border-4 border-black bg-white p-8 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
        <h1 className="mb-2 text-6xl md:text-7xl font-black text-foreground">404</h1>
        <h2 className="mb-4 text-xl font-mono uppercase tracking-widest text-foreground/80 font-bold">
          Page Not Found
        </h2>
        <p className="mb-8 font-mono text-xs text-foreground/60 leading-relaxed">
          The requested URL <code className="bg-black/5 px-1 py-0.5">{location.pathname}</code> does not exist on this server.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 border-2 border-black bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
        >
          Return to Portfolio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
