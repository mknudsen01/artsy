import React from "react";
import Link from "next/link";
import Head from "../components/head";

const Home = () => (
  <div>
    <Head title="Home" />
    <h2>Computational Design experiments</h2>
    <p>
      I've never put in the effort to learn how to paint well, design well, draw
      well. But I'm still interested in making art. So, recently I've been
      learning a little bit about generative art, using code to create designs.
    </p>
    <p>
      Below are a few examples, which I'll add to as I code up new algorithms.
      Check 'em out and holler at me with any cool designs you make. ✌️
    </p>
    <h3>
      <Link href="/noise">
        <a>Perlin Noise</a>
      </Link>
    </h3>
    <h3>
      <Link href="/warpspeed">
        <a>Warpspeed</a>
      </Link>
    </h3>
  </div>
);

export default Home;
