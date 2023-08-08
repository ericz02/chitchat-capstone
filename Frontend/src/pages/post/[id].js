import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

const ViewPost = () => {
  const router = useRouter();
  //const { id } = router.query;
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [postId, setPostId] = useState(null);

  /* useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received:", data);
          setPost(data);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]); */

  useEffect(() => {
    if (postId) {
      // Fetch the post details using the postId
      fetch(`/api/posts/${postId}`)
        .then((response) => response.json())
        .then((data) => {
          setPost(data);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [postId]);

  useEffect(() => {
    // Fetch the postId from the router query
    const { id } = router.query;
    setPostId(id);
  }, [router.query]);

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
        <div className="w-2/3 h-[1100px] flex flex-col">
          {post.comments.map((comment) => (
            <CommentSection
              key={comment.id}
              comment={comment}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              postId={post.id} // Pass the postId prop here for comments to a post
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
