import { useRouter } from "next/router";

const Timer = () => {
	const router = useRouter();
	const { tid } = router.query;

	return <p>Your Timerr ID is: {tid}</p>;
};

export default Timer;
