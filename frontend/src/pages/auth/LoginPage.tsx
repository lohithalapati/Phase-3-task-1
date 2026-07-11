import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-dark-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 text-2xl font-bold">N</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-900">Sign In</h1>
          <p className="text-dark-600 mt-2">Welcome back to NeuralHandoff V5</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-dark-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
              />
              Remember me
            </label>

            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-600">
          New here?{' '}
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to showcase
          </Link>
        </p>
      </div>
    </div>
  );
}