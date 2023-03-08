import { AlertTriangle } from "lucide-react";

const ErrorScreen = ({ error }: { error?: unknown }) => {
  return (
    <div className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4">
      <AlertTriangle className="h-16 w-16 text-red-400" />
      <h1 className="mt-4 text-2xl font-semibold text-red-400 line-clamp-1">
        {error instanceof Error ? error.message : "Something went wrong."}
      </h1>
    </div>
  );
};

export default ErrorScreen;
