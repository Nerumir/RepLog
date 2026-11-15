import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { appSettings } from '@/db/schema';
import type { OneRmFormulaId } from '@/domain/oneRepMax';

const SETTINGS_ID = 1;

export type ThemeMode = 'light' | 'dark' | 'system';

export async function getAppSettings() {
  const rows = await db.select().from(appSettings).where(eq(appSettings.id, SETTINGS_ID));
  if (rows[0]) return rows[0];

  await db.insert(appSettings).values({ id: SETTINGS_ID });
  const created = await db.select().from(appSettings).where(eq(appSettings.id, SETTINGS_ID));
  return created[0];
}

export async function updateAppSettings(input: {
  themeMode?: ThemeMode;
  oneRmFormula?: OneRmFormulaId;
  defaultRestSeconds?: number;
  debugModeEnabled?: boolean;
}) {
  await db
    .insert(appSettings)
    .values({ id: SETTINGS_ID, ...input })
    .onConflictDoUpdate({ target: appSettings.id, set: input });
}
