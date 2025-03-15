// import { z } from "zod";

// const WebsiteStatusSchema = z.enum(["GOOD", "BAD"]);

// const WebsiteSchema = z.object({
//   id: z.string().uuid().optional(),
//   url: z.string().url(),
//   userId: z.string(),
// //   ticks: z.array(z.lazy(() => WebsiteTickSchema)).optional(),
// });

// const ValidatorSchema = z.object({
//   id: z.string().uuid().optional(),
//   publicKey: z.string(),
//   ip: z.string().ip(),
//   location: z.string(),
//   ticks: z.array(z.lazy(() => WebsiteTickSchema)).optional(),
// });

// const WebsiteTickSchema = z.object({
//   id: z.string().uuid().optional(),
//   websiteId: z.string().uuid(),
//   validatorId: z.string().uuid(),
//   createdAt: z.date().or(z.string().datetime()),
//   status: WebsiteStatusSchema.default("GOOD"),
//   latency: z.number().positive(),
//   website: z.lazy(() => WebsiteSchema).optional(),
//   validator: z.lazy(() => ValidatorSchema).optional(),
// });

// const WebsiteInputSchema = WebsiteSchema.omit({ id: true, ticks: true });
// const ValidatorInputSchema = ValidatorSchema.omit({ id: true, ticks: true });
// const WebsiteTickInputSchema = WebsiteTickSchema.omit({
//   id: true,
//   website: true,
//   validator: true,
// });
