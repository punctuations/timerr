import { useRouter } from "next/router";

const Settings = () => {
	const router = useRouter();
	const { timer } = router.query;

	return <p>The Timer settings ID is: {timer}</p>;
};

export default Settings;
