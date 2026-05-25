import { LoadingScreen } from "../../layout/LoadingScreen";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Carregando reuniões..." }: LoadingSpinnerProps) {
  return <LoadingScreen message={message} role="admin" />;
}
