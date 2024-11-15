import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import useSignupForm from '@/hooks/useSignupForm';
import { useRouter } from 'next/navigation';

function Login() {
  const { formData, handleChange} = useSignupForm();
const router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login successful")
    // setMessage(data.message);
  };

  return (
    <div className=" flex flex-col items-center p-6 mx-auto bg-black bg-opacity-50 backdrop-blur-md backdrop-filter rounded-lg shadow-lg">
  <h2 className="text-xl font-bold text-center text-white mb-4">
    Gym Transformation Challenge
  </h2>
  <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-4 w-full items-center">
    <Input
      type="email"
      label="Email"
      name="email"
      labelPlacement="outside"
      radius="sm"
      color="white"
      size="lg"
      className="w-[80%] text-white"
      variant="bordered"
    />
    <Input
      type="password"
      label="Password"
      name="password"
      labelPlacement="outside"
      className="w-[80%] text-white"
      radius="sm"
      color="white"
      variant="bordered"
      size="lg"
    />
    <Button
      type="submit"
      variant="solid"
      className="w-[40%] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
      size="lg"
      onClick={() => router.push("/MainPage")}
    >
      Sign In
    </Button>
    <p className="text-white mt-4">
      Don't have an account?{" "}
      <Link href="#" className="text-indigo-400 hover:text-indigo-500">
        Sign up
      </Link>
    </p>
  </form>
</div>
  );
}

export default Login;
