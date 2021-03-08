import { useRouter } from "next/router";

const Settings = () => {
	const router = useRouter();
	const { timer } = router.query;

	return <p>The Timerr settings ID is: {timer}</p>;
};

export default Settings;
