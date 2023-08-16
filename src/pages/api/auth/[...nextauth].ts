import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AuthOptions, Session } from 'next-auth/core/types';
import { User } from '@/models/Postgre/Tables';
import userRepository from '../../../models/Postgre/UserRepository';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	secret: process.env.JWT_SECRET,
	callbacks: {
		async session({ session }: { session: any }) {
			const [user] = await userRepository.create({
				email: session.user.email,
				password: session.user.email,
				image: session.user.image,
			});
			session.user.id = user.id;
			return session;
		},
		redirect() {
			return '/home';
		},
	},
};

export default NextAuth(authOptions);
