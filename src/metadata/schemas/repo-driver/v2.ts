import { z } from 'zod';
import sourceSchema from '../common/sources';

const addressDriverSplitReceiverSchema = z.object({
  type: z.literal('address'),
  weight: z.number(),
  accountId: z.string(),
});

const repoDriverSplitReceiverSchema = z.object({
  type: z.literal('repoDriver'),
  weight: z.number(),
  accountId: z.string(),
  source: sourceSchema,
});

const repoDriverAccountSplitsSchema = z.object({
  maintainers: z.array(addressDriverSplitReceiverSchema).optional(),
  dependencies: z
    .array(
      z.union([
        repoDriverSplitReceiverSchema,
        addressDriverSplitReceiverSchema,
      ]),
    )
    .optional(),
});

const repoDriverAccountMetadataSchemaV2 = z.object({
  driver: z.literal('repo'),
  describes: z.object({
    driver: z.literal('repo'),
    accountId: z.string(),
  }),
  source: sourceSchema,
  emoji: z.string(),
  color: z.string(),
  description: z.string().optional(),
  splits: repoDriverAccountSplitsSchema,
});

export default repoDriverAccountMetadataSchemaV2;
