import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link"
import Image from "next/image";

const Login = () => {

  return (

    <div className = "bg-[#cee2ff] ">
      <Link href = "/">
        <Image
        className = "m-auto"
        src={chitchatLogo}
        alt = "Company Logo"
        height = {200}
        width = {200}
        />
      </Link>

      <div className = "bg-white mx-52 mb-20 p-20">
        <div>
          <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">Login to your account</h2>
          <div>
            <input 
            className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
            type = "email"
            placeholder = "Email: "
            />
          </div>
          <div>
            <input 
              className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
              type = "password"
              placeholder = "Password: "
            />
          </div>

          <div className =" flex flex-col p-4 content-center">
            <div >
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/6 my-1">
              Log in
              </button>
            </div>
            <div >
              <button className=" bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/6 my-1">
              Sign Up
              </button>
            </div>
          </div>
          <p>Don't have an account? Sign Up</p>
        </div>
      </div>

    </div>
  )
  
}

export default Login;