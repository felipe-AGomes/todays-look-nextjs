import { ClothePosition } from '@/@types';
import { Clothe, Set, User } from './Tables';

type CreateSet = {
	userId: string;
	category: string;
	clothes: ClothePosition[];
};

export type SetData = {
	id: number;
	category: string;
	favorite: boolean;
	userId: string;
	set: ClothePosition[];
	createdAt: string;
	updatedAt: string;
};

export interface ISetRepository {
	create(data: CreateSet): Promise<SetData | null>;
	getAllByUserId(data: { userId: string }): Promise<SetData[]>;
	toggleFavoriteBySetId(data: { setId: string }): Promise<SetData | null>;
	changeCategoryBySetId(data: {
		setId: string;
		category: string;
	}): Promise<SetData | null>;
	deleteBySetId(data: { setId: string }): Promise<string | null>;
}

export class SetRepositoryPostgre implements ISetRepository {
	async create({ category, clothes, userId }: CreateSet): Promise<SetData> {
		try {
			const set: any = await Set.create({ category });
			const user = await User.findByPk(userId);
			if (!user) return null;
			await set.setUser(user);
			clothes.forEach(async (clothe) => {
				const newClothe = await Clothe.findByPk(clothe.id);
				await set.addClothes(newClothe, { through: { x: clothe.x, y: clothe.y } });
			});
			return set.toJSON();
		} catch (error) {
			throw new Error('Erro ao cadastrar conjunto: ' + error.message);
		}
	}
	async getAllByUserId({ userId }: { userId: string }): Promise<SetData[]> {
		try {
			const sets = await User.findByPk(userId, {
				attributes: [],
				include: { association: 'sets' },
			});
			if (!sets) return null;
			return sets.toJSON().sets;
		} catch (error) {
			throw new Error('Erro ao encontrar conjuntos: ' + error.message);
		}
	}
	async toggleFavoriteBySetId({ setId }: { setId: string }): Promise<SetData> {
		try {
			const set: any = await Set.findByPk(setId);
			if (!set) return null;
			set.favorite = !set.favorite;
			await set.save();
			return set.toJSON();
		} catch (error) {
			throw new Error('Erro ao alterar a propriedade favorito: ' + error.message);
		}
	}
	async deleteBySetId({ setId }: { setId: string }): Promise<string> {
		try {
			const set = await Set.findByPk(setId);
			if (!set) return null;
			await set.destroy();
			return 'Sucesso ao deletar o conjunto';
		} catch (error) {
			throw new Error('Erro ao deletar conjunto: ' + error.message);
		}
	}
	async changeCategoryBySetId({
		setId,
		category,
	}: {
		setId: string;
		category: string;
	}): Promise<SetData> {
		try {
			const set: any = await Set.findByPk(setId);
			if (!set) return null;
			set.category = category;
			await set.save();
			return set.toJSON();
		} catch (error) {
			throw new Error('Erro ao alterar a propriedade categoria: ' + error.message);
		}
	}
}

const setRepository = new SetRepositoryPostgre();
export default setRepository;
