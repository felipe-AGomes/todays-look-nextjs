import { userModels } from '@/models/modelMong/userModels';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function register(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'POST':
			const response = await userModels.createUser(req.body);
			if (response.error) {
				res.status(400).json(response);
				return;
			}

			res.status(200).json(response);
			return;
	}
}
