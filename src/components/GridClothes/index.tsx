import Image from 'next/image';
import Style from './GridClothes.module.css';
import { Clothes } from '@/@types';

type Props = {
	clothes?: Clothes[];
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
	children: JSX.Element;
};

export default function GridClothes({
	children,
	clothes,
	openOrCloseModal,
}: Props) {
	return (
		<ul className={Style.boxList}>
			{children}
			{clothes &&
				clothes.map((clothe) => {
					return (
						<li
							className={Style.list}
							key={clothe.id}
						>
							<Image
								style={{ cursor: 'pointer' }}
								width={128}
								height={128}
								src={clothe.image}
								alt='Roupa'
								onClick={() => {
									openOrCloseModal(
										{ whichModal: 'clotheModal', operation: 'open' },
										clothe.id
									);
								}}
							/>
						</li>
					);
				})}
		</ul>
	);
}
