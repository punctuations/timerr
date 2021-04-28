import { useRouter } from "next/router";
import React from "react";

import { motion } from "framer-motion";

const createNew = (props: { prisma }) => {
  const router = useRouter();

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

  return (
    <motion.button
      variants={container}
      initial="init"
      animate="enter"
      className="w-1/4 transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-5 rounded-md flex items-center justify-center shadow-md focus:outline-none"
      onClick={() => router.push(`/${props.prisma[0].dash}/create`)}
    >
      Create new &rarr;
    </motion.button>
  );
};

export default createNew;
