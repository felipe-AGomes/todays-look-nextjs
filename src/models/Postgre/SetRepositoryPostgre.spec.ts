import { SetRepositoryPostgre } from './SetRepositoryPostgre';
import { Clothe, Set, User } from './Tables';

const makeSut = () => {
	const setRepository = new SetRepositoryPostgre();
	return { setRepository };
};

const clothesObj = [
	{
		favorite: false,
		id: '1',
		category: 'category',
		key: 'key',
		image: 'image',
		updatedAt: new Date('2023-08-11T12:03:01.536Z'),
		createdAt: new Date('2023-08-11T12:03:01.536Z'),
		userId: '1',
	},
	{
		favorite: false,
		id: '1',
		category: 'category',
		key: 'key',
		image: 'image',
		updatedAt: new Date('2023-08-11T12:03:01.536Z'),
		createdAt: new Date('2023-08-11T12:03:01.536Z'),
		userId: '1',
	},
];

const clothesRequest = [
	{ ...clothesObj[0], x: 1, y: 11 },
	{ ...clothesObj[1], x: 11.3, y: 10.4 },
];

const setObj = {
	id: '1',
	category: 'categoria',
	favorite: false,
	clothes: clothesRequest,
};

const userObj = {
	id: '1',
	email: 'user_already_exist@teste.com',
	password: 'password',
	image: 'image',
	updatedAt: '2023-08-11T11:59:51.268Z',
	createdAt: '2023-08-11T11:59:51.268Z',
};

describe('SetRepository', () => {
	let mockSet: any;
	let mockClothe: any;
	let mockUser: any;
	beforeEach(() => {
		jest.resetAllMocks();
		mockSet = {
			...setObj,
			addClothes: jest.fn(),
			save: jest.fn(),
			setUser: jest.fn(),
			toJSON: jest.fn(function () {
				return { ...setObj, favorite: this.favorite };
			}),
			getClothes: jest
				.fn()
				.mockResolvedValue([
					{ toJSON: jest.fn().mockReturnValue({ ...clothesObj[0] }) },
					{ toJSON: jest.fn().mockReturnValue({ ...clothesObj[1] }) },
				]),
		};
		mockUser = {
			...userObj,
			toJSON: jest.fn().mockReturnValue({ ...setObj }),
		};
		mockClothe = {
			...clothesObj,
		};
		Set.findByPk = jest.fn().mockResolvedValue({ ...mockSet });
		Set.create = jest.fn().mockResolvedValue({ ...mockSet });
		User.findByPk = jest.fn().mockResolvedValue({ ...mockUser });
		Clothe.findByPk = jest
			.fn()
			.mockResolvedValueOnce({ ...mockClothe[0] })
			.mockResolvedValueOnce({ ...mockClothe[1] });
	});
	describe('create', () => {
		beforeEach(() => {});
		it('should call the Set.create() ', async () => {
			const { setRepository: sut } = makeSut();

			await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(Set.create).toHaveBeenCalledTimes(1);
			expect(Set.create).toHaveBeenCalledWith({ category: setObj.category });
		});

		it('should call the User.findByPk()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(User.findByPk).toHaveBeenCalledTimes(1);
			expect(User.findByPk).toHaveBeenCalledWith(userObj.id);
		});

		it('should call the result of set, and call the method set.setUser()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(mockSet.setUser).toHaveBeenCalledTimes(1);
		});

		it('should call the Clothe.findByPk()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(Clothe.findByPk).toHaveBeenCalledTimes(2);
		});

		it('should call the set.addClothes()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(mockSet.addClothes).toHaveBeenCalledTimes(2);
			expect(mockSet.addClothes).toHaveBeenNthCalledWith(
				1,
				{
					category: 'category',
					createdAt: new Date('2023-08-11T12:03:01.536Z'),
					favorite: false,
					id: '1',
					image: 'image',
					key: 'key',
					updatedAt: new Date('2023-08-11T12:03:01.536Z'),
					userId: '1',
				},
				{ through: { x: 1, y: 11 } },
			);
		});

		it('should return a array with all clothes of specific set', async () => {
			const { setRepository: sut } = makeSut();

			const result = await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(result).toEqual(clothesObj);
		});

		it('should throw a error', async () => {
			const { setRepository: sut } = makeSut();
			Set.create = jest.fn().mockRejectedValueOnce(new Error('Error'));

			await expect(async () => {
				await sut.create({
					userId: userObj.id,
					clothes: clothesRequest,
					category: setObj.category,
				});
			}).rejects.toThrowError('Erro ao cadastrar conjunto: Error');
		});

		it('should return null, if user is not finded', async () => {
			const { setRepository: sut } = makeSut();
			User.findByPk = jest.fn().mockResolvedValueOnce(null);

			const result = await sut.create({
				userId: userObj.id,
				clothes: clothesRequest,
				category: setObj.category,
			});

			expect(result).toBeNull();
		});
	});

	describe('getAllByUserId', () => {
		it('should call User.findByPk', async () => {
			const { setRepository: sut } = makeSut();

			await sut.getAllByUserId({ userId: userObj.id });

			expect(User.findByPk).toHaveBeenCalledTimes(1);
			expect(User.findByPk).toHaveBeenCalledWith(userObj.id, {
				attributes: [],
				include: { association: 'sets' },
			});
		});

		it('shoud call sets.toJSON()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.getAllByUserId({ userId: userObj.id });

			expect(mockUser.toJSON).toHaveBeenCalledTimes(1);
		});

		it('should return all sets of specific user', async () => {
			const { setRepository: sut } = makeSut();

			const result = await sut.getAllByUserId({ userId: userObj.id });

			expect(result).toEqual(setObj);
		});

		it('should throw a error', async () => {
			const { setRepository: sut } = makeSut();
			User.findByPk = jest.fn().mockRejectedValueOnce(new Error('Error'));

			await expect(async () => {
				await sut.getAllByUserId({ userId: userObj.id });
			}).rejects.toThrowError('Erro ao encontrar conjuntos: Error');
		});

		it('should return null if user not exists', async () => {
			const { setRepository: sut } = makeSut();
			User.findByPk = jest.fn().mockResolvedValueOnce(null);

			const result = await sut.getAllByUserId({ userId: userObj.id });

			expect(result).toBeNull();
		});
	});

	describe('toggleFavoriteBySetId', () => {
		it('should call Set.findByPk()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.toggleFavoriteBySetId({ setId: setObj.id });

			expect(Set.findByPk).toHaveBeenCalledTimes(1);
			expect(Set.findByPk).toHaveBeenCalledWith(setObj.id);
		});

		it('should call set.save()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.toggleFavoriteBySetId({ setId: setObj.id });

			expect(mockSet.save).toHaveBeenCalledTimes(1);
		});

		it('should call the set.toJSON()', async () => {
			const { setRepository: sut } = makeSut();

			await sut.toggleFavoriteBySetId({ setId: setObj.id });

			expect(mockSet.toJSON).toHaveBeenCalledTimes(1);
		});

		it('should return a set with the inverse favorite property', async () => {
			const { setRepository: sut } = makeSut();

			const result = await sut.toggleFavoriteBySetId({ setId: setObj.id });

			expect(result.favorite).toBeTruthy();
		});

		it('should throw a error', async () => {
			const { setRepository: sut } = makeSut();
			Set.findByPk = jest.fn().mockRejectedValueOnce(new Error('Error'));

			await expect(async () => {
				await sut.toggleFavoriteBySetId({ setId: setObj.id });
			}).rejects.toThrowError('Erro ao alterar a propriedade favorito: Error');
		});

		it('should return null, if setId is not exist', async () => {
			const { setRepository: sut } = makeSut();
			Set.findByPk = jest.fn().mockResolvedValueOnce(null);

			const result = await sut.toggleFavoriteBySetId({ setId: setObj.id });

			expect(result).toBeNull();
		});
	});
});
