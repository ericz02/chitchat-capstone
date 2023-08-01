import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
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
      <div className="  bg-white mx-52 mb-20 px-24 py-10 ">
        <div>
            <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">
                Forgot Password?
            </h2>
            <p className="text-sm text-slate-500 text-center">No worries, we'll email you reset instructions.</p>
            <div>
                <input
                className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
                type="email"
                placeholder="Email: "
                />
            </div>
            <div className=" flex flex-col p-4 ">
            <div className="flex justify-center">
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                Submit
              </button>
            </div>
            </div>
        </div>   
      </div>
      
    </div>
  );
};

export default Login;
