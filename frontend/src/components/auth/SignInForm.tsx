import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios from "axios";

interface LoginFormState {
  email: string;
  password: string;
}

export default function SignInForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Try different endpoints - use the correct one
      const endpoints = [
        "http://localhost:5000/api/auth/login",
        "http://localhost:5000/api/login",
        "http://localhost:5000/auth/login",
        "http://localhost:5000/api/users/login"
      ];

      let response;
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          response = await axios.post(endpoint, {
            email: formData.email.trim(),
            password: formData.password.trim(),
          });
          console.log("Success with endpoint:", endpoint);
          success = true;
          break;
        } catch (err) {
          console.log("Failed with endpoint:", endpoint);
        }
      }

      if (!success) {
        setErrorMessage("Cannot connect to server. Please check if backend is running.");
        return;
      }

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/");
      } else {
        setErrorMessage(response?.data?.message || "Login failed.");
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
            Sign In
          </h1>

          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 text-gray-500" />
                  ) : (
                    <EyeCloseIcon className="size-5 text-gray-500" />
                  )}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}