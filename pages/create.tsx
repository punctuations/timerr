import Head from "next/head";
import { useRouter } from "next/router";
import * as crypto from "crypto";
import { useState, ChangeEvent } from "react";
import { useKeyPressEvent } from "react-use";
import { motion } from "framer-motion";
import { TextField, Checkbox } from "@material-ui/core";

export default function Home() {
	const router = useRouter();

	const [stage, setStage] = useState(0);
	const [name, setName] = useState("My timer");
	const [time, setTime] = useState(Date.now());
	const [checked, setChecked] = useState(false);
	const [notifyPref, setNotifyPref] = useState(true);

	fetch("/api/hello").then((r) => console.log(r));

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
	useKeyPressEvent("ArrowRight", increment);

	function submitTimer() {
		fetch("/api/hello", {
			method: "POST",
			body: JSON.stringify({
				name: name,
				time: time,
				childLock: checked,
				notifyPref: notifyPref,
			}),
		});

		createTimer.then((data) => router.push(`/dashboard/${data}`));
	}

	const createTimer = new Promise<String>((resolve, reject) => {
		resolve(crypto.randomBytes(20).toString("hex"));
	}).catch((err) => {
		console.log(err);
	});

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
				<title>Timerr - Create</title>
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
							href="/"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="inline-flex w-5"
							>
								<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
							</svg>
						</a>{" "}
						<p>/</p>
						<a
							className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
							href="/create"
						>
							Create
						</a>{" "}
						<p>/</p>
						<a
							href="#"
							className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
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
									className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
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
									className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
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
									className="text-gray-400 font-medium transition-all duration-500 hover:text-opacity-75"
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

								<motion.form
									variants={item}
									className="flex flex-wrap"
									noValidate
								>
									<TextField
										id="time"
										label="Duration"
										type="time"
										defaultValue="07:30"
										className="w-32"
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{
											step: 300, // 5 min
										}}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											console.log(e.target.valueAsNumber)
										}
									/>
								</motion.form>
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
