import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-gradient mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link to="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
