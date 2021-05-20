import Head from "next/head";
import { useRouter } from "next/router";
import * as crypto from "crypto";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import { useKeyPressEvent } from "react-use";
import { motion } from "framer-motion";
import { TextField, Checkbox, Select, MenuItem } from "@material-ui/core";
import NumberFormat from "react-number-format";

import moment, { DurationInputArg1, DurationInputArg2 } from "moment";

export default function CreateNew() {
  const router = useRouter();
  const timeRef = useRef(null);
  const unitsRef = useRef(null);

  const { dash } = router.query;

  const [stage, setStage] = useState<number>(0);
  const [name, setName] = useState<string>("My timer");
  const [time, setTime] = useState<null | string>(null);
  const [previewTime, setPreviewTime] = useState<string>("Minutes");
  const [checked, setChecked] = useState<boolean>(false);
  const [notifyPref, setNotifyPref] = useState<boolean>(true);

  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    handleDateChange(timeRef?.current?.value, unitsRef?.current?.value);
  }, [timeRef, unitsRef]);

  const handleDateChange = (time?: number | null, units?: String | null) => {
    if (time && units) {
      setTime(
        moment(
          moment().add(
            time as DurationInputArg1,
            units.toLowerCase() as DurationInputArg2
          )
        ).format()
      );
    } else if (time && !units) {
      setTime(moment(moment().add(time, "minutes")).format());
    } else {
      setTime(moment(moment().add(5, "minutes")).format());
    }
  };

  const decrement = () => {
    if (stage > 0) {
      setStage((count) => --count);
    }
  };

  const increment = () => {
    if (stage < 3) {
      setStage((count) => ++count);
    }
  };

  useKeyPressEvent("ArrowLeft", decrement);
  useKeyPressEvent("Escape", decrement);
  useKeyPressEvent("ArrowRight", increment);
  useKeyPressEvent("Enter", increment);

  function submitTimer() {
    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/create" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/create",
      {
        method: "POST",
        body: JSON.stringify({
          dashUUID: dash,
          uuid: crypto.randomBytes(32).toString("hex"),
          name: name,
          time: time,
          childLock: checked,
          notifyPref: notifyPref,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((body) => router.push(`/dashboard/${body.uuid}`));
  }

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

  const item = {
    init: { opacity: 0, y: 5 },
    enter: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Timerr - Create New</title>
      </Head>
      <main className="absolute w-full h-full flex flex-col justify-center items-center select-none">
        <motion.nav
          className="flex absolute top-5 left-5 text-gray-300"
          variants={container}
          initial="init"
          animate="enter"
        >
          <section className="flex space-x-3 justify-center items-center">
            <a
              className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
              href={`/dashboard/${dash}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="inline-flex 2xl:w-5 xl:w-5 lg:w-5 md:w-5 w-3"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </a>{" "}
            <p>/</p>
            <a
              href={"create"}
              className="text-gray-400 2xl:text-base xl:text-base lg:text-base md:text-base text-sm font-medium transition-all duration-500 hover:text-opacity-7"
            >
              Create
            </a>{" "}
            <p>/</p>
            <a
              href="#"
              className="text-gray-400 2xl:text-base xl:text-base lg:text-base md:text-base text-sm  font-medium transition-all duration-500 hover:text-opacity-75"
              onClick={() => {
                setStage(0);
              }}
            >
              Name
            </a>
            {stage >= 1 ? (
              <>
                <p>/</p>{" "}
                <a
                  href="#"
                  className="text-gray-400 2xl:text-base xl:text-base lg:text-base md:text-base text-sm  font-medium transition-all duration-500 hover:text-opacity-75"
                  onClick={() => {
                    setStage(1);
                  }}
                >
                  Time
                </a>
              </>
            ) : null}
            {stage >= 2 ? (
              <>
                <p>/</p>{" "}
                <a
                  href="#"
                  className="text-gray-400 2xl:text-base xl:text-base lg:text-base md:text-base text-xs font-medium transition-all duration-500 hover:text-opacity-75"
                  onClick={() => {
                    setStage(2);
                  }}
                >
                  Child-lock
                </a>
              </>
            ) : null}
            {stage >= 3 ? (
              <>
                <p>/</p>{" "}
                <a
                  href="#"
                  className="text-gray-400 2xl:text-base xl:text-base lg:text-base md:text-base text-sm  font-medium transition-all duration-500 hover:text-opacity-75"
                  onClick={() => {
                    setStage(3);
                  }}
                >
                  Notify
                </a>
              </>
            ) : null}
          </section>
        </motion.nav>
        <motion.section
          className="flex flex-col justify-center items-center space-y-10"
          variants={container}
          initial="init"
          animate="enter"
        >
          <motion.h1 variants={item} className="text-6xl font-semibold">
            Timerr
          </motion.h1>

          <motion.section
            variants={item}
            className="flex justify-center items-center space-x-5"
          >
            {stage == 0 ? (
              <>
                <motion.h3 variants={item} className="text-xl">
                  What do you want to call this timer?
                </motion.h3>

                <motion.form
                  variants={item}
                  className="flex flex-wrap"
                  noValidate
                >
                  <TextField
                    id="name"
                    label="Name"
                    type="text"
                    defaultValue="My Timer"
                    className="w-32"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                </motion.form>
              </>
            ) : null}

            {stage == 1 ? (
              <>
                <motion.h3 variants={item} className="text-xl">
                  When does this timer end?
                </motion.h3>

                <div className="w-40">
                  <NumberFormat
                    className="w-10"
                    customInput={TextField}
                    format="###"
                    ref={timeRef}
                    onChange={(date: ChangeEvent<HTMLInputElement>) =>
                      handleDateChange(parseInt(date.target.value))
                    }
                  />
                  <Select
                    className="w-30"
                    value={previewTime}
                    ref={unitsRef}
                    onChange={(e: ChangeEvent<{ value: unknown }>) =>
                      setPreviewTime(e.target.value as string)
                    }
                  >
                    <MenuItem value={10}>Seconds</MenuItem>
                    <MenuItem value={20}>Minutes</MenuItem>
                    <MenuItem value={30}>Hours</MenuItem>
                  </Select>
                  {/*<KeyboardTimePicker*/}
                  {/*  label="Masked timepicker"*/}
                  {/*  className="w-40"*/}
                  {/*  placeholder="08:00 AM"*/}
                  {/*  mask="__:__ _M"*/}
                  {/*  value={previewTime}*/}
                  {/*  onChange={(date) => handleDateChange(moment(date).format())}*/}
                  {/*/>*/}
                </div>
              </>
            ) : null}

            {stage == 2 ? (
              <>
                <motion.h3 variants={item} className="text-xl">
                  Does this timer have a child-lock?
                </motion.h3>

                <motion.div variants={item}>
                  <Checkbox
                    checked={checked}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setChecked(e.target.checked)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </motion.div>
              </>
            ) : null}

            {stage == 3 ? (
              <>
                <motion.h3 variants={item} className="text-xl">
                  Do you want to be notified when this timer is done?
                </motion.h3>

                <motion.div variants={item}>
                  <Checkbox
                    checked={notifyPref}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNotifyPref(e.target.checked)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </motion.div>
              </>
            ) : null}
          </motion.section>

          {stage >= 3 ? (
            <motion.button
              onClick={() => {
                submitTimer();
              }}
              className="focus:outline-none transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-3 rounded-md"
            >
              Done &rarr;
            </motion.button>
          ) : (
            <motion.button
              className="focus:outline-none transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-3 rounded-md"
              onClick={() => {
                setStage(stage + 1);
              }}
            >
              Next &rarr;
            </motion.button>
          )}
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
