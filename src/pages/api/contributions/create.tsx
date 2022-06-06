/* import { postPlotTitleSchema } from '@lib/formValidations';
 */ import { validateRoute } from '@lib/validateRoute';
import prisma from '@lib/prisma';
import { CreateEditContribution } from '@models';
import { contributionSchema } from '@lib/formValidations';

export default validateRoute(async (req, res, user) => {
  // Validate Incoming Data before moving on
  try {
    await contributionSchema.validate(req.body, { abortEarly: false });
  } catch (error: any) {
    return res.json({ error: error });
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

    if (contribution) {
      res
        .status(200)
        .json({ contribution: contribution, error: false, message: null });
      return;
    }
  } catch (error: any) {
    throw new Error(error);
  }
  res.status(401).json({ message: 'Something went wrong' });
  return;
});
