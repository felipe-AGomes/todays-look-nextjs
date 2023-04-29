import Style from './ChangeCategoryModal.module.css';
import { Clothes, FetcherOptions, SetsProps } from '@/@types';
import { CloseIcon } from '@chakra-ui/icons';
import ChoseCategory from '../ChoseCategory';

type Props = {
	categories: string[];
	clothe: Clothes;
	fetcher: (
		url: string,
		options?: FetcherOptions
	) => Promise<SetsProps | SetsProps[] | Clothes | Clothes[] | undefined>;
	openOrCloseModal: (
		{
			whichModal,
			operation,
		}: {
			whichModal: 'clotheModal' | 'deleteModal' | 'changeCategoryModal';
			operation: 'open' | 'close';
		},
		clotheId?: string
	) => void;
};

export default function ChangeCategoryModal({
	categories,
	clothe,
	openOrCloseModal,
	fetcher,
}: Props) {
	return (
		<div className={Style.modalContainer}>
			<CloseIcon
				onClick={() => {
					openOrCloseModal({
						whichModal: 'changeCategoryModal',
						operation: 'close',
					});
				}}
				cursor={'pointer'}
				position={'absolute'}
				right={'20px'}
				top={'20px'}
			/>
			<ChoseCategory
				fetcher={fetcher}
				openOrCloseModal={openOrCloseModal}
				categories={categories}
				clotheId={clothe.id}
				userId={clothe.userId}
			/>
		</div>
	);
}
