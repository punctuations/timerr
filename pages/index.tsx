import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    init: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.45,
      },
    },
  };

  const subContainer = {
    init: { opacity: 0, y: 5 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    init: { opacity: 0, y: 5 },
    enter: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <main className="absolute w-full h-full flex flex-col justify-center items-center select-none">
        <motion.section
          className="flex flex-col justify-center items-center space-y-10"
          variants={container}
          initial="init"
          animate="enter"
        >
          <motion.header
            variants={subContainer}
            className="flex flex-col items-center"
          >
            <motion.h1 variants={item} className="text-6xl font-semibold">
              Timerr
            </motion.h1>
            <motion.p variants={item}>
              Get started below and create a new timer!
            </motion.p>
          </motion.header>

          <motion.a
            href={"create"}
            className="w-3/4 transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-5 rounded-md flex flex-col justify-center space-y-3"
            variants={subContainer}
          >
            <motion.h3 variants={item} className="text-3xl">
              Get Started &rarr;
            </motion.h3>
            <motion.p variants={item} className="text-sm">
              Get started by creating a new timer and watch the seconds go down
              in anticipation!
            </motion.p>
          </motion.a>
        </motion.section>

        <footer className="absolute bottom-0 flex justify-center items-center border-gray-200 border-t w-full">
          <a
            href="https://vercel.com?utm_source=timer&utm_medium=default-template&utm_campaign=timer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img
              src="/vercel.svg"
              alt="Vercel Logo"
              className="inline w-16 h-16"
            />
          </a>
        </footer>
      </main>
    </>
  );
}
