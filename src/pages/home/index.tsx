/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { NextApiRequest } from 'next';

import { AddIcon } from '@chakra-ui/icons';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';

import {
	ClothesProps,
	ExtendedSession,
	FetcherOptions,
	ModalState,
	OpenOrCloseModalProps,
	SessionProps,
	SetsProps,
} from '@/@types';
import AddClothe from '@/components/AddClothe';
import GridClothes from '@/components/GridClothes';

import ProfilePage from '@/components/ProfilePage';

import style from './home.module.css';
import WorkbenchSet from '@/components/WorkbenchSet';
import GridSets from '@/components/GridSets';
import ContainerPage from '@/components/ContainerPage';
import Header from '@/components/Header';
import Head from 'next/head';
import useAppContext from '@/hooks/useAppContext';

type Props = {
	serverSession: SessionProps;
};

export default function Home({ serverSession }: Props) {
	const { clothes, setClothes, setSets, workbench, setWorkbench } =
		useAppContext();

	async function updateClothesAndSets() {
		const dataClothes = (await fetcher(
			`/api/protected/user/${serverSession.user.id}/clothe/all`,
		)) as ClothesProps[] | ClothesProps;
		const dataSets = (await fetcher(
			`/api/protected/user/${serverSession.user.id}/clothe/allSets`,
		)) as SetsProps[] | SetsProps;

		if (Array.isArray(dataClothes)) {
			setClothes(dataClothes);
		}
		if (Array.isArray(dataSets)) {
			setSets(dataSets);
		}
	}

	useEffect(() => {
		updateClothesAndSets();
	}, [serverSession]);

	async function fetcher(
		url: string,
		options?: FetcherOptions,
	): Promise<
		SetsProps | SetsProps[] | ClothesProps | ClothesProps[] | undefined
	> {
		const response = await fetch(
			url,
			options?.method
				? {
						method: options.method,
						body: options.body,
						headers: { 'Content-Type': 'application/json' },
				  }
				: undefined,
		);

		const data: any = await response.json();

		let clotheOrSet =
			(data.clothe as ClothesProps[]) || (data.set as SetsProps[]);

		if (data.error) {
			console.error('Erro: ', data.message);
			return;
		}

		if (options?.update) {
			await updateClothesAndSets();
		}

		return clotheOrSet;
	}

	function addToWorkbench(clotheId: string) {
		const alreadyExists = workbench.find((clothe) => clothe.id === clotheId);

		if (alreadyExists) return;

		const newWorkbench = [
			...workbench,
			{ ...clothes.filter((clothe) => clothe.id === clotheId)[0], x: 0, y: 0 },
		];
		setWorkbench(newWorkbench);
	}

	function resetWorkbench() {
		setWorkbench([]);
	}

	function removeItemWorkbench(clotheId: string) {
		const newWorkbench = workbench.filter((clothe) => clothe.id !== clotheId);
		setWorkbench(newWorkbench);
	}

	return (
		<>
			<Head>
				<title>{"Today's Look"}</title>
				<link
					rel='icon'
					href='/favIcon.ico'
				/>
			</Head>
			<div className={style.homePage}>
				<Tabs align='center'>
					<main>
						<TabPanels>
							<TabPanel className={style.page}>
								<Header
									title='Conjuntos'
								/>
								<ContainerPage>
									<GridSets fetcher={fetcher} />
								</ContainerPage>
							</TabPanel>
							<TabPanel className={style.page}>
								<Header
									title='Roupas'
									isClothe
								/>
								<ContainerPage>
									<GridClothes
										addToWorkbench={addToWorkbench}
										fetcher={fetcher}
										removeItemWorkbench={removeItemWorkbench}
									/>
								</ContainerPage>
							</TabPanel>
							<TabPanel className={style.page}>
								<Header title='Adicionar Roupa' />
								<ContainerPage>
									<AddClothe
										userId={serverSession.user.id}
										updateClothesAndSets={updateClothesAndSets}
									/>
								</ContainerPage>
							</TabPanel>
							<TabPanel className={style.page}>
								<Header title='Criar Conjunto' />
								<ContainerPage>
									<WorkbenchSet
										resetWorkbench={resetWorkbench}
										fetcher={fetcher}
									/>
								</ContainerPage>
							</TabPanel>
							<TabPanel className={style.page}>
								<Header title='Perfil' />
								<ContainerPage>
									<ProfilePage userName={serverSession.user.name} />
								</ContainerPage>
							</TabPanel>
						</TabPanels>
					</main>

					<TabList className={style.footerPage}>
						<Tab height={10}>
							<img
								src='/wedding.png'
								alt='Conjunto'
							/>
						</Tab>
						<Tab height={10}>
							<img
								src='/tshirt.png'
								alt='Roupas'
							/>
						</Tab>
						<Tab height={10}>
							<div className={style.boxAddIcon}>
								<div className={style.addIcon}>
									<AddIcon
										borderRadius={'full'}
										width={5}
										height={5}
										color={'white'}
									></AddIcon>
								</div>
								<p>Adicionar</p>
							</div>
						</Tab>
						<Tab height={10}>
							<img
								src='/fashion.png'
								alt='Novo conjunto'
							/>
						</Tab>
						<Tab height={10}>
							<Avatar
								size={'sm'}
								name={serverSession.user.name}
								src={serverSession.user.image}
							/>
						</Tab>
					</TabList>
				</Tabs>
			</div>
		</>
	);
}

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
	const serverSession = (await getSession({ req })) as ExtendedSession | null;

	if (!serverSession) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return {
		props: {
			serverSession,
		},
	};
}
