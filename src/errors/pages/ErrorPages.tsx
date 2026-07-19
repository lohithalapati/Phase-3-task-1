import React from "react";

interface ErrorPageProps {
  title: string;
  description: string;
  code: string;
}

const StaticErrorPageLayout: React.FC<ErrorPageProps> = ({ title, description, code }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 select-none">
      <div className="w-full max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-gray-200 dark:text-gray-800 leading-none mb-4">
          {code}
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {description}
        </p>
        <button
          onClick={() => { window.location.href = "/"; }}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg text-sm shadow-sm transition-colors"
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};

export const Unauthorized401: React.FC = () => (
  <StaticErrorPageLayout
    code="401"
    title="Authentication Required"
    description="Your verification sequence has expired or is invalid. Please sign back in to continue access."
  />
);

export const Forbidden403: React.FC = () => (
  <StaticErrorPageLayout
    code="403"
    title="Access Prohibited"
    description="Your security scope credentials do not grant access clearance for this action interface."
  />
);

export const NotFound404: React.FC = () => (
  <StaticErrorPageLayout
    code="404"
    title="Address Not Found"
    description="The queried system route is absent or has transitioned permanently to a new schema."
  />
);

export const ServerError500: React.FC = () => (
  <StaticErrorPageLayout
    code="500"
    title="Internal Crash"
    description="The platform cluster encountered a runtime execution trap. The systems team has been flagged."
  />
);