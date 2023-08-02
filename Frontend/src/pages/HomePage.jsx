import Link from "next/link";

const HomePage = () => {

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col justify-center mb-4">
        <div className="mx-auto">
          <Link href="/create">
          <button
            className="bg-[#27374D] px-4 py-2 rounded-[10px] hover:bg-[#526D82] transition-colors duration-300 ease-in-out mt-8"
            >
            Create Post
          </button>{" "}
          </Link>
        </div>
      </div>
      {/* {postCards} */}
    </div>
  )
}

export default HomePage;