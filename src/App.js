import { useEffect, useState } from "react";
import "./App.css";
import db, { auth } from "./firebase";
import Post from "./Post";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import ImageUpload from "./ImageUpload";
import { IGEmbed } from "react-ig-embed";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // new modal
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleSetOpenSignIn = () => setOpenSignIn(true);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      // for persistance - keeps you logged in when you refresh
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
          // don't update username
        } else {
          // if we created new user
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup when re-fires the code detach the listener (no duplicates)
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        )
      );
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    const unsubscribe = auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    return () => {
      unsubscribe();
    };
  };

  const signIn = (e) => {
    e.preventDefault();
    const unsubscribe = auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenSignIn(false); // close the modal
    return () => {
      unsubscribe();
    };
  };

  return (
    <div className="app">
      {/* modal implementaion */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram-1.png"
                alt="insta logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </Box>
      </Modal>

      {/* modal - for login container  */}
      <Modal open={openSignIn} onClose={handleSetOpenSignIn}>
        <Box sx={style}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram-1.png"
                alt="insta logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </Box>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram-1.png"
          alt="insta logo"
        />
        {user ? (
          <Button color="inherit" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            {/* modal buttons */}
            <Button color="inherit" onClick={handleSetOpenSignIn}>
              Sign In
            </Button>

            <Button color="inherit" onClick={handleOpen}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id} // when we add a new post it won't re-render the all the post (only render the updated post)
              postId={id}
              user={user} // user who signed in for comments
              username={post.username}
              caption={post.caption}
              imgUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <IGEmbed url="https://www.instagram.com/reel/CeoWO23h2sU/?utm_source=ig_web_copy_link" />
          <IGEmbed url="https://www.instagram.com/p/CIV64qnpBZq/?utm_source=ig_web_copy_link" />
          <IGEmbed url="https://www.instagram.com/p/B62dHGegc47/?utm_source=ig_web_copy_link" />
        </div>
      </div>

      {/* upload */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <center>
          <h3>SORRY YOU NEED TO LOGIN TO UPLOAD</h3>
        </center>
      )}
      {/* Header */}
      {/* Posts */}
      {/* Posts */}
    </div>
  );
}

export default App;

// local storage test
// {
//   username: "aman",
//   caption: randomCaption,
//   imgUrl:
//     "https://randompicturegenerator.com/img/dog-generator/gd06a646a419bb8ed24b30cfc82980c102f6992c316822627648575e3a7e8b3d14002b3046b82946d8fae325cc8ecf25d_640.jpg",
// },
// {
//   username: "qazi",
//   caption: randomCaption,
//   imgUrl:
//     "https://randompicturegenerator.com/img/dog-generator/ga909edd1f3f716f9d9df2eaa451d63628c57b2fffc7921460641327ac3c345706c293664fa0fca146ee84311578a4ea9_640.jpg",
// },
// {
//   username: "sonny",
//   caption: randomCaption,
//   imgUrl:
//     "https://randompicturegenerator.com/img/cat-generator/g0d2808031377ed21c5fa2ff78c52c8d789a2d87e964c8a4aa3edc9c3ba0ca51ea12d595149313fbf31af99e29744a0f9_640.jpg",
// },
