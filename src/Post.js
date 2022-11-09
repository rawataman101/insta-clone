import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import db from "./firebase";
import { serverTimestamp } from "@firebase/firestore";

const Post = ({ user, username, caption, imgUrl, postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId)
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });

    return () => {
      unsubscribe();
    };
  }, [postId]);
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__headerAvatar" alt="Aman" src="" />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imgUrl} alt="" />
      <h4 className="post__text">
        <strong>{username} </strong> {caption}
      </h4>
      {/* comments */}
      <div className="post__comment">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment} // hide when no comments
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}

      {/* header -> avatar + name */}
      {/* image */}
      {/* username + caption */}
    </div>
  );
};

export default Post;
