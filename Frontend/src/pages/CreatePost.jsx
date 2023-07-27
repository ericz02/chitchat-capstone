const CreatePost = () => {
  return (
    <div className="bg-[#FFFFFF] p-4 flex flex-col justify-center ml-64 mt-20">
      <h1 className="flex justify-center text-2xl font-bold mb-4 mt-3">
        Create a New Post
      </h1>

      <div className="mb-4 mx-auto w-3/4">
        <input
          className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
          type="text"
          id="postName"
          placeholder="Title:"
        />
      </div>
      <div className="mb-4 mx-auto w-3/4">
        <textarea
          className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
          id="postDescription"
          rows="4"
          placeholder="Description:"
        />
      </div>
      <div className="mb-4 mx-auto w-3/4">
        <textarea
          className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
          id="postRoom"
          rows="4"
          placeholder="ChitChat Room:"
        />
      </div>
      <button className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-auto w-1/6 ml-[835px]">
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
