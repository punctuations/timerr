export default function Home() {
	return (
		<main className="absolute w-full h-full flex flex-col justify-center items-center select-none">
			<section className="flex flex-col justify-center items-center space-y-10">
				<header className="flex flex-col items-center">
					<h1 className="text-6xl font-semibold">Timer</h1>
					<p>Get started below and create a new timer!</p>
				</header>

				<a
					href="#"
					className="w-3/4 transition-colors duration-300 border-gray-500 hover:border-blue-500 hover:text-blue-500 border p-5 rounded-md flex flex-col justify-center space-y-3"
				>
					<h3 className="text-3xl">Get Started &rarr;</h3>
					<p className="text-sm">
						Get started by creating a new timer and watch the seconds go down in
						anticipation!
					</p>
				</a>
			</section>

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
	);
}
