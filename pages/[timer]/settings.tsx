import { CircularProgress } from "@material-ui/core";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const { timer } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/read"
      : "https://timerr.vercel.app/api/read",
    {
      method: "POST",
      body: JSON.stringify({
        uuid: timer,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }
  );

  const body = await res.json();

  return {
    props: body.prisma,
  };
}

export default function Settings(props) {
  // const [progress, setProgressState] = useState(newDate(props.time))

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
        {props.timerUUID}
      </p>
      <main className="absolute w-full h-full flex justify-center items-center">
        <section className="w-96 flex flex-row justify-between border border-gray-300 p-4 rounded-lg shadow-lg">
          <header className="flex flex-col">
            <h1 className="text-3xl font-bold">{props.name}</h1>
            <p className="text-sm">
              Created on: {new Date(props.createdAt).toLocaleDateString()}
            </p>
          </header>
          <section className="flex flex-row justify-center items-center">
            <p>{props.timeLeft}</p>
            <CircularProgress variant="determinate" value={55} />
          </section>
        </section>
      </main>
    </>
  );
}
