import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff"); // default role

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isChecked) return; // Safety check

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        name: (fname + " " + lname).trim(),
        email: email.trim(),
        password,
        role,
      });

      alert(response.data.message);
      navigate("/signin");

    } catch (error: any) {
      console.log(error.response?.data);
      setErrorMessage(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-6 text-xl font-semibold">Sign Up</h1>

        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={fname}
                  onChange={(e: any) => setFname(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={lname}
                  onChange={(e: any) => setLname(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isChecked}
                onChange={setIsChecked}
              />
              <span>I agree to terms</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isChecked || loading}
              className={`w-full py-3 text-white rounded-lg ${
                isChecked ? "bg-brand-500 hover:bg-brand-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

          </div>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-brand-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
