// The deck's prompt records, joined from one module per category.
//
// Each category module owns its own records, so two contributors adding
// prompts in different categories never edit the same file. Add a new
// category by creating data/prompts/<category>.js and importing it here.
import { PROMPTS as coding } from "./coding.js";
import { PROMPTS as writing } from "./writing.js";
import { PROMPTS as research } from "./research.js";
import { PROMPTS as general } from "./general.js";
import { PROMPTS as meta } from "./meta.js";
import { PROMPTS as learning } from "./learning.js";
import { PROMPTS as communication } from "./communication.js";
import { PROMPTS as lifeAdmin } from "./life-admin.js";
import { PROMPTS as reconstruction } from "./reconstruction.js";
import { PROMPTS as agency } from "./agency.js";
import { PROMPTS as evaluation } from "./evaluation.js";
import { PROMPTS as security } from "./security.js";
import { PROMPTS as operations } from "./operations.js";

export const PROMPTS = [
  ...coding,
  ...writing,
  ...research,
  ...general,
  ...meta,
  ...learning,
  ...communication,
  ...lifeAdmin,
  ...reconstruction,
  ...agency,
  ...evaluation,
  ...security,
  ...operations,
];
