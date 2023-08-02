import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="bg-[#cee2ff] p-2 ">
      <Link href="/">
        <Image
          className="m-auto"
          src={chitchatLogo}
          alt="Company Logo"
          height={140}
          width={140}
        />
      </Link>

      <div className="bg-white mx-52 mb-20 px-24 py-10 ">
        <div>
          <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">
            Login to your account
          </h2>
          <div>
            <input
              className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
              type="email"
              placeholder="Email: "
            />
          </div>
          <div>
            <input
              className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
              type="password"
              placeholder="Password: "
            />
          </div>
          <Link href="/forgotPassword" className="text-blue-600">
            <p className="flex justify-end m-2">Forgot Password?</p>
          </Link>

          <div className=" flex flex-col p-4 ">
            <div className="flex justify-center">
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                Log in
              </button>
            </div>
            <Link href="/signup" className="flex justify-center">
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                Sign Up
              </button>
            </Link>
          </div>
          <p className="flex justify-center">
            Don't have an account?
          </p>
          <Link href="/signup" className="text-blue-600 flex justify-center">
              Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
