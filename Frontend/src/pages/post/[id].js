import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

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
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <RootLayout>
      <PostCard post={post} />
      {post.comments && post.comments.length > 0 && (
        <div className="w-2/3 h-[1100px] flex flex-col">
          {post.comments.map((comment) => (
            <CommentSection
              key={comment.id}
              comment={comment}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
            />
          ))}
        </div>
      )}
    </RootLayout>
  );
};

export default ViewPost;
