import React from "react";
import { Input, Button, Link } from "@nextui-org/react";
import useSignupForm from "@/hooks/useSignupForm";
import { useRouter } from "next/router";

const SignUP = () => {
  const { formData, handleChange, handleSubmit, setMessage } = useSignupForm();
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { success, message } = await handleSubmit(e);
      setMessage(message);

      // Redirect to login page if registration is successful
      if (success) {
        setTimeout(() => router.push("/ToLogin"), 2000);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center p-8 mx-auto rounded-2xl overflow-hidden">
      {/* Enhanced glassmorphic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow delay-1000" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-6" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 tracking-tight">
            Gym Transformation
          </h2>
          <p className="text-white/60 mt-2 text-sm tracking-wider uppercase">
            Begin Your Journey
          </p>
        </div>

        {/* Feedback Message */}
        {formData.message && (
          <div
            className={`p-4 mb-6 text-center rounded-lg ${
              formData.message.toLowerCase().includes("success")
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {formData.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-7 w-full items-center"
        >
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            radius="sm"
            classNames={{
              label: "text-white/90 font-medium mb-1 text-sm tracking-wide",
              input: [
                "bg-white/5",
                "text-white",
                "placeholder:text-white/40",
                "border-white/10",
              ],
            }}
            size="lg"
            className="w-full"
            variant="bordered"
            onChange={handleChange}
          />

          <div className="flex gap-4 w-full">
            <Input
              type="number"
              name="currentWeight"
              label="Current Weight"
             
              radius="sm"
              endContent={<p className="text-white">kg</p>}
              classNames={{
                label: "text-white/90 font-medium mb-1 text-sm tracking-wide",
                input: [
                  "bg-white/5",
                  "text-white",
                  "placeholder:text-white/40",
                  "border-white/10",
                ],
              }}
              size="lg"
              className="w-1/2"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="targetWeight"
              label="Target Weight"
              radius="sm"
              endContent={<p className="text-white">kg</p>}
              classNames={{
                label: "text-white/90 font-medium mb-1 text-sm tracking-wide",
                input: [
                  "bg-white/5",
                  "text-white",
                  "placeholder:text-white/40",
                  "border-white/10",
                ],
              }}
              size="lg"
              className="w-1/2"
              variant="bordered"
              onChange={handleChange}
            />
          </div>

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            radius="sm"
            classNames={{
              label: "text-white/90 font-medium mb-1 text-sm tracking-wide",
              input: [
                "bg-white/5",
                "text-white",
                "placeholder:text-white/40",
                "border-white/10",
              ],
            }}
            size="lg"
            className="w-full"
            variant="bordered"
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-purple-500/25 rounded-lg py-6 text-lg tracking-wide"
            size="lg"
          >
            Start Your Journey
          </Button>

          <p className="text-white/60 text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/ToLogin"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Add these to your global CSS
const styles = `
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.4; }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1000ms;
}
`;

export default SignUP;
