import { useRouter } from "next/router";
import Head from "next/head";

const Settings = () => {
  const { query } = useRouter();
  let timer: string | string[] | undefined;
  ({ timer } = query);

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <main>The Timerr settings ID is: {timer}</main>
    </>
  );
};

export default Settings;
