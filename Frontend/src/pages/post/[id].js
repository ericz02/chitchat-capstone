import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";

const ViewPost = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    // Fetch the postId from the router query
    const { id } = router.query;
    setPostId(id);
  }, [router.query]);

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

  const handlePostContentUpdate = (newContent) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: newContent,
    }));
  };

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

  const handleCreateComment = (newComment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment],
    }));
    router.reload();
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <RootLayout>
      <PostCard
        post={post}
        onUpdate={handlePostContentUpdate}
        onUpdateComments={handleCreateComment}
      />
      {post.comments && post.comments.length > 0 && (
        <div className="w-2/3 h-[2100px] flex flex-col">
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
