import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
<<<<<<< HEAD
 //this is my comment function
export const Comment = ({ comment,replyContent, setReplyContent }) => {
  //the user who made the comment
  const [user, setUser] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);


  useEffect(() => {
    fetch(`/api/user/${comment.UserId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [comment.UserId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };
  const handleReplySubmit = (replyContent, commentId) => {
    // Fetch the backend API route to create a reply comment
    fetch(`/api/posts/${commentId}/replyComments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Clear the reply input
        setReplyContent("");
        // Hide the reply input after submitting the reply
        setShowReplyInput(false);

      })
      .catch((error) => console.error("Error creating reply:", error));
  };
  return (
    <div className="ml-4 border-l-2 pl-4 mt-4">
      <div className="flex items-center mb-1">
        {user && user.profilePicture ? (
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={user.profilePicture}
            alt={`Avatar of ${user.userName}`}
          />
        ) : (
          <FaUserCircle className="w-8 h-8 mr-2 text-gray-500" />//first statement will always be true.
        )}
        <div>
          {user && <span className="font-semibold text-sm ">{user.userName}</span>}
        </div>
      </div>
      <p className="text-gray-600">{comment.content}</p>
      {comment.createdAt && (
        <span className="text-gray-500 text-xs">
          {formatDate(comment.createdAt)}
        </span>
      )}
      {/* Show the reply input when the button is clicked */}
      {showReplyInput && (
        <div>
          <textarea
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            rows={3}
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md"
            onClick={() => handleReplySubmit(replyContent, comment.id)}
          >
            Submit Reply
          </button>
        </div>
      )}
      {/* Show the button to reveal the reply input */}
      { !showReplyInput &&   (
        <button
          className="px-2 py-1 m-2 bg-gray-200 rounded-md text-xs"
          onClick={() => setShowReplyInput(true)}
        >
          Reply
        </button>
      )}
      {comment.replies && comment.replies.length > 0 && (//base case
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} replyContent={replyContent} setReplyContent={setReplyContent}/>//recursive call
          ))}
        </div>
      )}
    </div>
  );
};
 //this is my viewpost function
=======
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

>>>>>>> 400456d9ec5947ccb222e4af0363778f36ba2ec3
const ViewPost = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the post ID from the URL
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch post from the server based on the post ID
      fetch(`/api/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received:", data);
          setPost(data);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id,replyContent]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <RootLayout>
      <PostCard post={post} />
      {post.comments && post.comments.length > 0 && (
        <div className="w-2/3 flex flex-col">
          {post.comments.map((comment) => (
            <CommentSection key={comment.id} comment={comment} />
          ))}
        </div>
<<<<<<< HEAD
        <p className="text-gray-600">{post.content}</p>
        <div className="flex items-center mt-4">
          {/* Render the comments */}
          {post.comments && post.comments.length > 0 && (
            <div>{ console.log(post.comments)}
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} replyContent={replyContent} setReplyContent={setReplyContent} />
              ))}
            </div>
          )}
        </div>
      </div>
=======
      )}
>>>>>>> 400456d9ec5947ccb222e4af0363778f36ba2ec3
    </RootLayout>
  );
};

export default ViewPost;
