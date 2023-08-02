import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";

const SignUp = () => {
  return (
    <div className="bg-[#cee2ff] p-10">
      <Link href="/">
        <Image
          className="m-auto"
          src={chitchatLogo}
          alt="Company Logo"
          height={200}
          width={200}
        />
      </Link>

      <div className="bg-white mx-56 mb-20 px-24 py-10 ">
        <div>
          <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">
            Sign Up
          </h2>
          <div className = "flex justify-between">
            <input
                className = "w-64 h-10 bg-[#E6E6E6] boarder rounded p-2"
                type = "text"
                placeholder="First Name:"
            />
            <input
                className = "w-64 h-10 bg-[#E6E6E6] boarder rounded p-2"
                type = "text"
                placeholder = "Last Name:"
            />
          </div>
          <div >
            <input
              className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
              type="text"
              placeholder="Username: "
            />
          </div>
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

          <div className=" flex flex-col p-4 ">
            <div className="flex justify-center">
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                Sign Up
              </button>
            </div>
            <Link href="/login" className="flex justify-center">
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                Log In
              </button>
            </Link>
          </div>

          <p className="flex justify-center">
            Already have an account?
          </p>
          <Link href="/login" className="text-blue-600 flex justify-center">
              Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;