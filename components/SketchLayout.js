import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Head from "../components/head";

const P5Wrapper = dynamic(import("react-p5-wrapper"), {
  ssr: false,
});

const SketchLayout = ({ sketch, title }) => {
  return (
    <div className="content">
      <Head title={title} />
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <span>→ {title}</span>
      </nav>
      <section className="sketch">
        <P5Wrapper sketch={sketch} />
      </section>
      <footer>
        Made by <a href="https://matthewknudsen.com"> Matthew</a> ✌️
      </footer>
    </div>
  );
};

export default SketchLayout;
