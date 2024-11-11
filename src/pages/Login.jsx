import { LockOutlined, UserOutlined, WarningTwoTone } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MOHLogo from "../assets/nav-logo.png";
import { login } from "../redux/slices/userSlice";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    setLoginError(false);
    try {
      await dispatch(login(values));
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = () =>
    loginError && (
      <div className="flex flex-col items-center bg-red-100 py-2 px-4 rounded-md max-w-full mb-5">
        <WarningTwoTone twoToneColor="red" className="text-black text-6xl" />
        <span className="ml-2 text-sm">
          You have entered the wrong user ID or password. Please try again.
        </span>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 md:mt-32">
      <div className="mx-auto max-w-3xl">
        <img src={MOHLogo} alt="Ministry of Health" className="h-24 mx-auto" />
        <h1 className="text-4xl text-[#163C94] text-center">Login to your account</h1>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="mt-10 px-10"
          autoComplete="off"
        >
          {renderErrorMessage()}

          <Form.Item
            name="idNumber"
            rules={[
              { required: true, message: "Please enter ID number" },
              { min: 5, message: "ID Number is too short" },
            ]}
          >
            <Input
              placeholder="ID or Passport Number"
              prefix={<UserOutlined />}
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 8, message: "Password must be at least 8 characters long" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <div className="text-right">
            <Link to="/auth/reset-password" className="text-primary">
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            className="w-full mt-5"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center mt-3 mb-5">
            Don't have an account?{" "}
            <Link to="/user-auth/registration" className="text-[#163C94]">
              Sign up here
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
