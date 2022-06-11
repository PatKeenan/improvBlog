import { contributionSchema } from '@lib/formValidations';
import { NextApiRequest, NextApiResponse } from 'next';
import { validateToken } from '@lib/validateToken';
import { CreateEditContribution } from '@models';
import prisma from '@lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string];

  switch (req.method) {
    case 'POST': {
      const user = validateToken(token);
      if (!user) {
        return res.status(401).send({ error: true, message: 'Not authorized' });
      }
      const data = await createContribution(req, user);
      return res.status(data?.status ?? 500).json(data?.data ?? null);
    }
    default: {
      return res
        .status(405)
        .json({ error: true, message: 'Method Not Allowed' });
    }
  }
}

const createContribution = async (
  req: NextApiRequest,
  user: any,
): Promise<{ status: number; data: any } | undefined> => {
  // Validate the schema before calling the api
  try {
    await contributionSchema.validate(req.body, { abortEarly: false });
  } catch (error: any) {
    return { status: 409, data: error };
  }
  try {
    const { postId, blockId, content }: CreateEditContribution = req.body;

    const contribution = await prisma.contribution.create({
      data: {
        postId: postId,
        authorId: user.id,
        blockId: blockId,
        content: content,
      },
    });

    return {
      status: 200,
      data: { contribution: contribution, error: false, message: null },
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
