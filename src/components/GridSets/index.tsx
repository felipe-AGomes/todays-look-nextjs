import {
	ClothesProps,
	FetcherOptions,
	ModalState,
	OpenOrCloseModalProps,
	SetsProps,
} from '@/@types';
import Style from './GridSets.module.css';
import ModalSet from '../ModalSet';
import SetImages from '../SetImages';
import useAppContext from '@/hooks/useAppContext';
import { filterClotheOrSetByCategory } from '@/functions/filterClotheOrSetByCategory';

type Props = {
	modal: ModalState;
	fetcher: (
		url: string,
		options?: FetcherOptions,
	) => Promise<
		SetsProps | SetsProps[] | ClothesProps | ClothesProps[] | undefined
	>;
	openOrCloseModal: (
		{ whichModal, operation }: OpenOrCloseModalProps,
		clotheId?: string | null,
		setId?: string | null,
	) => void;
};

export default function GridSets({ modal, openOrCloseModal, fetcher }: Props) {
	const { sets, currentCategorySets } = useAppContext();
	const filteredSetsByCategory = filterClotheOrSetByCategory<SetsProps>(
		currentCategorySets,
		sets,
	);

	return (
		<ul className={Style.boxList}>
			{modal.setModal && (
				<ModalSet
					fetcher={fetcher}
					userId={modal.set?.userId!}
					setId={modal.set?.id!}
					modal={modal}
					openOrCloseModal={openOrCloseModal}
				/>
			)}
			{filteredSetsByCategory.map((set) => {
				return (
					<li
						style={{
							position: 'relative',
							width: '160px',
							height: '204.44px',
							cursor: 'pointer',
							overflow: 'hidden',
							background: '#fff',
						}}
						key={set.id}
						onClick={() => {
							openOrCloseModal(
								{ whichModal: 'setModal', operation: 'open' },
								null,
								set.id,
							);
						}}
					>
						<SetImages
							size={{ height: 56.88, width: 56.88 }}
							proportion={{ x: 0.44, y: 0.44 }}
							set={set}
						/>
					</li>
				);
			})}
		</ul>
	);
}
