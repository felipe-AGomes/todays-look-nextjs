import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type UserSession = {
	session: {
		user: {
			email: string;
			user: string;
			id: number;
		};
	};
};

export default function Home({ session }: UserSession) {
	const [clothes, setClothes] = useState(null);
	console.log(session.user);
	async function getAllClothes() {
		const response = await fetch(
			`http://localhost:3000/api/protected/user/${11}/clothe/all`
		);
		const data = await response.json();
		console.log(data);
		return data;
	}

	useEffect(() => {
		setClothes(getAllClothes());
	}, []);
	return (
		<ul>
			{clothes && clothes.length > 1 &&
				clothes.map((element) => {
					return <li>element.key</li>;
				})}
		</ul>
	);
}

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}
