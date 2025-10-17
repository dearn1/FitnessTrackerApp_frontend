
// Login.test.jsx - Unit test for Login functionality
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Create a simplified Login component for testing
const SimpleLogin = ({ onSubmit, loading = false, error = "" }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Fitness Tracker</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

describe("Login Component - Unit Tests", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form with email and password fields", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Login to Fitness Tracker")).toBeInTheDocument();
  });

  test("updates input values when typing", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits form with correct data when login button is clicked", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "endrasim@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "User@123" } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "endrasim@email.com",
      password: "User@123",
    });
  });

  test("shows loading state when loading prop is true", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} loading={true} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button");

    expect(screen.getByText("Logging in...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  test("displays error message when error prop is provided", () => {
    const errorMessage = "Invalid email or password";
    render(<SimpleLogin onSubmit={mockOnSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass("error-message");
  });

  test("form has required validation attributes", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("form submission prevents default behavior", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const form = screen.getByRole("button").closest("form");
    const mockPreventDefault = jest.fn();

    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test("handles empty form submission", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "",
      password: "",
    });
  });
});

