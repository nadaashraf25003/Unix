/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import { setToken, clearToken } from "@/API/token";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  departmentId: number;
  sectionId: number;
  stage: number;
  role: "Student" | "Instructor" | "Admin";
}


export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

/* =======================
   Hook
======================= */

const useAuth = () => {
  /* -------- Register -------- */
 const registerMutation = useMutation({
  mutationFn: async (data: RegisterData) => {
    const res = await api.post(Urls.AUTH.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
      departmentId: data.departmentId,
      sectionId: data.sectionId,
      stage: data.stage,
      role: data.role,
    });
    return res.data;
  },
  onSuccess: (data) => {
    toast.success(data?.message || "Verification email sent");
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message || "Registration failed");
  },
});


  /* -------- Verify Email -------- */
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailData) => {
      const res = await api.post(Urls.AUTH.VERIFY_EMAIL, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Email verified. Waiting for admin approval"
      );
    },
  });

  /* -------- Resend Verification -------- */
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(Urls.AUTH.RESEND_VERIFICATION, { email });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Verification email resent");
    },
  });

  /* -------- Login -------- */
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await api.post(Urls.AUTH.LOGIN, data);
      return res.data;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      toast.success("Login successful");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });

  /* -------- Refresh Token -------- */
  const refreshTokenMutation = useMutation({
    mutationFn: async (data: RefreshTokenData) => {
      const res = await api.post(Urls.AUTH.REFRESH_TOKEN, data);
      return res.data;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
    },
  });

  /* -------- Forgot Password -------- */
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(Urls.AUTH.FORGOT_PASSWORD, { email });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Reset code sent");
    },
  });

  /* -------- Reset Password -------- */
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const res = await api.post(Urls.AUTH.RESET_PASSWORD, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully");
    },
  });

  /* -------- Approve User (Admin) -------- */
  const approveUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.put(`${Urls.AUTH.APPROVE_USER}/${userId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "User approved");
    },
  });

  /* -------- Logout -------- */
const logout = () => {
  clearToken();              // يمسح التوكن
  toast.success("Logged out successfully");
};


  return {
    registerMutation,
    verifyEmailMutation,
    resendVerificationMutation,
    loginMutation,
    refreshTokenMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    approveUserMutation,
    logout,
  };
};

export default useAuth;