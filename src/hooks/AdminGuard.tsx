import { Navigate, Outlet } from "react-router-dom";
import type User from "../models/userModule";

interface AdminGuardProps {
  user: User | null;
  isLoading?: boolean;
}

export default function AdminGuard({ user, isLoading }: AdminGuardProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
