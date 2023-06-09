import { signOut } from 'next-auth/react';
import Style from './ProfilePage.module.css';

type Props = {
	userName: string;
};

export default function ProfilePage({ userName }: Props) {
	return (
		<div className={Style.container}>
			<h2>{userName}</h2>
			<button onClick={() => signOut()}>Sair</button>
		</div>
	);
}
