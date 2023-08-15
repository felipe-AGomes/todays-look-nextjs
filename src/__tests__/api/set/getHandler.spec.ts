import setRepository from '@/models/Postgre/SetRepositoryPostgre';
import { setObj } from '@/__tests__/models/SetRepositoryPostgre.spec';
import { handler } from './test/handlerWrapper';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');
describe('getHandler', () => {
	let req: any;
	let res: any;
	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			method: 'GET',
			query: { userId: '1' },
		};
		res = {
			json: jest.fn(function () {
				return this;
			}),
			status: jest.fn(function () {
				return this;
			}),
		};
		setRepository.getAllByUserId = jest
			.fn()
			.mockResolvedValue([{ ...setObj }, { ...setObj, id: 2 }]);
		(getServerSession as jest.Mock).mockResolvedValue(true);
	});

	it('should call setRepository.getAllByUserId()', async () => {
		await handler(req, res);

		expect(setRepository.getAllByUserId).toHaveBeenCalledTimes(1);
		expect(setRepository.getAllByUserId).toHaveBeenCalledWith({ userId: '1' });
	});

	it('should call res.json() and res.status() with a success message', async () => {
		await handler(req, res);

		expect(res.json).toHaveBeenCalledWith({
			status: 'success',
			message: 'Sucesso ao buscar conjuntos',
			data: [setObj, { ...setObj, id: 2 }],
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should return a error message if the method is not allowed', async () => {
		req.method = 'DELETE';

		await handler(req, res);

		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			message: 'Metodo não permitido',
		});
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return a error message if the setRepository.getAllByUserId() return null', async () => {
		setRepository.getAllByUserId = jest.fn().mockResolvedValueOnce(null);

		await handler(req, res);

		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			message: 'Erro ao buscar conjuntos',
		});
		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return a error message if something throw a error', async () => {
		setRepository.getAllByUserId = jest
			.fn()
			.mockRejectedValueOnce(new Error('Error'));

		try {
			await handler(req, res);
		} catch (error) {
			expect(res.json).toHaveBeenCalledWith({
				status: 'error',
				message: 'Erro ao buscar conjuntos',
			});
			expect(res.status).toHaveBeenCalledWith(400);
		}
	});

	it('should call the res.status() and res.json() with a error status if session is undefined', async () => {
		(getServerSession as jest.Mock).mockResolvedValue(false);

		await handler(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			message: 'Usuario precisa estar logado',
		});
	});
});
