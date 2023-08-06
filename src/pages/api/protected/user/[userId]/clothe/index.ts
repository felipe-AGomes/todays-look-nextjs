import { clotheModelMongo } from '@/models/Mongo/ClotheModelMongo';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.status(400).json({
			status: 'error',
			message: 'Metodo não permitido',
		});
		return;
	}
	const userId = req.query.userId as string;
	try {
		const clothes = await clotheModelMongo.getAllByUserId({ userId });
		res.status(200).json({
			status: 'success',
			message: 'Roupas buscadas com sucesso',
			data: clothes,
		});
	} catch {
		res.status(400).json({
			status: 'error',
			message: 'Erro ao buscar roupas',
		});
	}
}
