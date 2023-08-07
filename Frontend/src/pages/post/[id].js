import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

const ViewPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received:", data);
          setPost(data);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  const handlePostContentUpdate = (newContent) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: newContent,
    }));
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  const handleCommentRepliesUpdate = (commentId, updatedReplies) => {
    setPost((prevPost) => {
      // Find the comment in the post and update its replies
      const updatedComments = prevPost.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      });

      return {
        ...prevPost,
        comments: updatedComments,
      };
    });
  };

  return (
    <RootLayout>
      <PostCard post={post} onUpdate={handlePostContentUpdate} />
      {post.comments && post.comments.length > 0 && (
        <div className="w-2/3 flex flex-col">
          {post.comments.map((comment) => (
            <CommentSection
              key={comment.id}
              comment={comment}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onUpdateReplies={(updatedReplies) =>
                handleCommentRepliesUpdate(comment.id, updatedReplies)
              }
            />
          ))}
        </div>
      )}
    </RootLayout>
  );
};

export default ViewPost;
