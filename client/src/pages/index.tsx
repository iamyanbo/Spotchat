import type { NextPage } from "next";
import PostComponent from "../features/post/PostComponent";

const Home: NextPage = () => {

  
  return (
    <> 
      <h1 className="text-3xl font-bold text-white">Home Page</h1>
      <PostComponent username="McLovin" profilePath="/2357380.jpg" editAndDelete={false} authorCaption="I never lie, including about my age" song={{
        albumCoverPath: "/final1.png",
        name: "The Man Who Never Lied",
        artistName: "Maroon 5"
      }}/>
    </>
  );
};

export default Home;
