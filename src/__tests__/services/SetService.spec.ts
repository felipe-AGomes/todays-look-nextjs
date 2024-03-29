import axios from 'axios';
import {
	doDeleteSuccessDataResponse,
	doGetSuccessDataResponseString,
	errorMessage,
} from '../controllers/FrontController.spec';
import { FrontController } from '@/controllers/FrontController';
import { FetcherAxios } from '@/services/Fetcher';
import { SetInput } from '@/@types/models';
import { SetService } from '@/services/SetService';

const toggleFavoriteByIdResponse = {
	status: 'success',
	message: 'Favorito alterado com sucesso',
	data: {
		favorite: true,
	},
};

const mockLocalStorage = (() => {
	let store = {
		token: 'token'
	};
	return {
		getItem: (key) => store[key] || null,
	};
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const changeCategoryByIdRequest = {
	userId: '123',
	set: '321',
	toUpdate: { category: 'new_category' },
};

const changeCategoryByIdResponse = {
	status: 'success',
	message: 'Categoria alterada com sucesso',
	data: {
		category: 'updated_category',
	},
};

const createRequest = {
	userId: '123',
	category: 'category',
	clothes: [
		{
			category: 'category',
			favorite: false,
			id: 'id',
			image: 'image',
			key: 'key',
			userId: 'userId',
			x: 0,
			y: 0,
		},
	],
} as SetInput;

const createResponse = {
	status: 'success',
	message: 'Roupa criada com sucesso',
	data: { ...createRequest, id: '321' },
};

const makeSut = () => {
	const fetcher = new FetcherAxios();
	const frontController = new FrontController(fetcher);
	const setService = new SetService(frontController);
	return { setService, frontController, fetcher };
};

describe('SetService', () => {
	describe('getAllByUserId', () => {
		it('should call frontController.doGet()', async () => {
			const { setService: sut, frontController } = makeSut();
			const spyDoGet = jest.spyOn(frontController, 'doGet');

			await sut.getAllByUserId({ userId: '123' });

			expect(spyDoGet).toHaveBeenCalledWith({
				url: `/api/protected/user/123/set`,
			});
			expect(spyDoGet).toHaveBeenCalledTimes(1);
		});

		it('should return the data of response', async () => {
			const { setService: sut } = makeSut();
			axios.get = jest
				.fn()
				.mockResolvedValueOnce({ data: doGetSuccessDataResponseString });

			const result = await sut.getAllByUserId({ userId: '123' });

			expect(result).toEqual(doGetSuccessDataResponseString);
		});

		it('should to throw a error if fetcher throw a error', async () => {
			const { setService: sut, frontController } = makeSut();
			frontController.doGet = jest.fn().mockRejectedValueOnce(new Error('erro'));

			const result = await sut.getAllByUserId({ userId: '123' });

			expect(result).toEqual(errorMessage);
		});
	});

	describe('deleteById', () => {
		it('should call frontController.doDelete()', async () => {
			const { setService: sut, frontController } = makeSut();
			const spyDoDelete = jest.spyOn(frontController, 'doDelete');

			await sut.deleteById({ userId: '123', set: '321' });

			expect(spyDoDelete).toHaveBeenCalledWith({
				url: `/api/protected/user/123/set/321`,
			});
			expect(spyDoDelete).toHaveBeenCalledTimes(1);
		});

		it('should return the data of response', async () => {
			const { setService: sut } = makeSut();
			axios.delete = jest
				.fn()
				.mockResolvedValueOnce({ data: doDeleteSuccessDataResponse });

			const result = await sut.deleteById({
				userId: '123',
				set: '321',
			});

			expect(result).toEqual(doDeleteSuccessDataResponse);
		});

		it('should to throw a error if fetcher throw a error', async () => {
			const { setService: sut, frontController } = makeSut();
			frontController.doDelete = jest
				.fn()
				.mockRejectedValueOnce(new Error('erro'));

			const result = await sut.deleteById({
				userId: '123',
				set: '321',
			});

			expect(result).toEqual(errorMessage);
		});
	});

	describe('changeCategoryById', () => {
		it('should call frontController.doPut()', async () => {
			const { setService: sut, frontController } = makeSut();
			const spyDoPut = jest.spyOn(frontController, 'doPut');

			await sut.changeCategoryById(changeCategoryByIdRequest);

			expect(spyDoPut).toHaveBeenCalledWith({
				url: `/api/protected/user/123/set/321`,
				body: {
					toUpdate: { category: 'new_category' },
					operation: 'changeCategory',
				},
			});
			expect(spyDoPut).toHaveBeenCalledTimes(1);
		});

		it('should return the data of response', async () => {
			const { setService: sut } = makeSut();
			axios.put = jest
				.fn()
				.mockResolvedValueOnce({ data: changeCategoryByIdResponse });

			const result = await sut.changeCategoryById(changeCategoryByIdRequest);

			expect(result).toEqual(changeCategoryByIdResponse);
		});

		it('should to throw a error if fetcher throw a error', async () => {
			const { setService: sut, frontController } = makeSut();
			frontController.doPut = jest.fn().mockRejectedValueOnce(new Error('erro'));

			const result = await sut.changeCategoryById(changeCategoryByIdRequest);

			expect(result).toEqual(errorMessage);
		});
	});

	describe('toggleFavoriteById', () => {
		it('should call frontController.doPut()', async () => {
			const { setService: sut, frontController } = makeSut();
			const spyDoPut = jest.spyOn(frontController, 'doPut');

			await sut.toggleFavoriteById({ userId: '123', set: '321' });

			expect(spyDoPut).toHaveBeenCalledWith({
				url: `/api/protected/user/123/set/321`,
				body: { operation: 'toggleFavorite' },
			});
			expect(spyDoPut).toHaveBeenCalledTimes(1);
		});

		it('should return the data of response', async () => {
			const { setService: sut } = makeSut();
			axios.put = jest
				.fn()
				.mockResolvedValueOnce({ data: toggleFavoriteByIdResponse });

			const result = await sut.toggleFavoriteById({
				set: '321',
				userId: '123',
			});

			expect(result).toEqual(toggleFavoriteByIdResponse);
		});

		it('should to throw a error if fetcher throw a error', async () => {
			const { setService: sut, frontController } = makeSut();
			frontController.doPut = jest.fn().mockRejectedValueOnce(new Error('erro'));

			const result = await sut.toggleFavoriteById({
				set: '321',
				userId: '123',
			});

			expect(result).toEqual(errorMessage);
		});
	});

	describe('create', () => {
		it('should call frontController.doPost()', async () => {
			const { setService: sut, frontController } = makeSut();
			const spyDoPost = jest.spyOn(frontController, 'doPost');

			await sut.create(createRequest);

			expect(spyDoPost).toHaveBeenCalledWith({
				url: `/api/protected/user/123/set`,
				body: {
					set: createRequest,
				},
			});
			expect(spyDoPost).toHaveBeenCalledTimes(1);
		});

		it('should return the data of response', async () => {
			const { setService: sut } = makeSut();
			axios.post = jest.fn().mockResolvedValueOnce({ data: createResponse });

			const result = await sut.create(createRequest);

			expect(result).toEqual(createResponse);
		});

		it('should to throw a error if fetcher throw a error', async () => {
			const { setService: sut, frontController } = makeSut();
			frontController.doPost = jest.fn().mockRejectedValueOnce(new Error('erro'));

			const result = await sut.create(createRequest);

			expect(result).toEqual(errorMessage);
		});
	});
});
