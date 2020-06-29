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
        I've never put in the effort to learn how to paint well, design well,
        draw well. But I'm still interested in making art. So, recently I've
        been learning a little bit about generative art, using code to create
        designs.
      </p>
      <p>
        Below are a few examples, which I'll add to as I code up new algorithms.
        Check 'em out and holler at me with any cool designs you make. ✌️
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
