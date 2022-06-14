import { contributionSchema } from '@lib/formValidations';
import { NextApiRequest, NextApiResponse } from 'next';
import { CreateEditContribution } from '@models';
import prisma from '@lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getSession({ req });

  switch (req.method) {
    case 'GET': {
      const { blockId } = req.body;
      const data = await getContributions(Number(blockId));
      return res.status(data.status).json(data.data);
    }
    case 'POST': {
      if (!user) {
        return res.status(401).send({ error: true, message: 'Not authorized' });
      }

      const data = await createContribution(req, user.user);
      return res.status(data?.status ?? 500).json(data?.data ?? null);
    }
    default: {
      return res
        .status(405)
        .json({ error: true, message: 'Method Not Allowed' });
    }
  }
}

const getContributions = async (blockId: number) => {
  try {
    const contributions = await prisma.contribution.findMany({
      where: {
        id: Number(blockId),
      },
      orderBy: [{ likes: 'desc' }, { createdAt: 'asc' }],
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      status: 200,
      data: contributions,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

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
