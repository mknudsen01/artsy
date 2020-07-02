import React from "react";
import Link from "next/link";
import Head from "../components/head";

const SketchExample = ({ title, id }) => {
  return (
    <div className="item">
      <h3>
        <Link href={`/${id}`}>
          <a>{title}</a>
        </Link>
      </h3>
      <Link href={`/${id}`}>
        <a style={{ display: "flex" }}>
          <img src={`/images/${id}.png`} />
        </a>
      </Link>
    </div>
  );
};

const Home = () => (
  <div className="content">
    <Head title="Home" />
    <section className="column">
      <h2>Computational Design experiments</h2>
      <p>
        I currently haven't put in the necessary effort to paint or draw well,
        buuuut I'm still interested in making art. Recently, I heard about
        generative art - using code to create designs. With some math and bit of
        randomness, it's possible to make some pretty cool looking designs - no
        drawing ability required!
      </p>
      <p>
        Below are a few examples, which I'll add to as I code up new ones. Check
        'em out and holler at me with any cool designs you make.
      </p>
      <div className="examples">
        <SketchExample title="Perlin Noise" id="noise" />
        <SketchExample title="Warpspeed" id="warpspeed" />
        <SketchExample title="Doorway" id="doorway" />
      </div>
    </section>
    <footer>
      Made by <a href="https://matthewknudsen.com"> Matthew</a> ✌️
    </footer>
  </div>
);

export default Home;
