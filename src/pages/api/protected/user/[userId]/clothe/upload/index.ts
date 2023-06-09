import { ClotheData, ExtendedRequest } from '@/@types';
import { clotheModels } from '@/models/clotheModels';
import { uploadImage } from '@/utils/middleware';
import { Request, Response } from 'express';
import { PageConfig } from 'next';
import { createRouter, expressWrapper } from 'next-connect';

const router = createRouter<Request, Response>();

router.use(expressWrapper(uploadImage.single('image')));

router.post(async (req: ExtendedRequest, res) => {
	const userId = req.query?.userId;
	const { originalname: key, location: image } = req.file
		? req.file
		: { originalname: '', location: '' };
	const { category } = req.body ? req.body : { category: '' };

	if (!(typeof userId === 'string')) {
		res.status(400).json({
			error: true,
			message: 'userId não inserido',
		});
		return;
	}
	const data: ClotheData = {
		key,
		category,
		image: image ?? '',
		userId,
	};
	switch (req.method) {
		case 'POST':
			const response = await clotheModels.setNewClothe(data);
			if (response.error) {
				res.status(400).json(response);
				return;
			}
			res.status(200).json(response);
			break;
		default:
			res.status(400).json({
				error: true,
				message: 'Metodo não permitido',
			});
	}
});

export default router.handler({
	onError(err, _, res) {
		res.json({
			error: (err as Error).message,
		});
	},
});

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};
