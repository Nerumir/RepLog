import { and, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { programs, programSessionTemplates, sessionTemplates } from '@/db/schema';
import type { ProgramSource } from '@/domain/types';
import type { SplitType } from '@/domain/splitTypes';

export async function listPrograms() {
  return db.select().from(programs);
}

export async function getProgramWithSessions(programId: number) {
  const [program] = await db.select().from(programs).where(eq(programs.id, programId));
  if (!program) return null;

  const sessions = await db
    .select({
      id: sessionTemplates.id,
      name: sessionTemplates.name,
      defaultRestSeconds: sessionTemplates.defaultRestSeconds,
      orderIndex: programSessionTemplates.orderIndex,
      dayLabel: programSessionTemplates.dayLabel,
    })
    .from(programSessionTemplates)
    .innerJoin(sessionTemplates, eq(sessionTemplates.id, programSessionTemplates.sessionTemplateId))
    .where(eq(programSessionTemplates.programId, programId))
    .orderBy(programSessionTemplates.orderIndex);

  return { ...program, sessions };
}

export interface NewProgramInput {
  name: string;
  splitType: SplitType;
  sessionsPerWeek: number;
  source: ProgramSource;
  notes?: string;
}

export async function createProgram(input: NewProgramInput) {
  const [row] = await db
    .insert(programs)
    .values({ ...input, createdAt: Date.now() })
    .returning();
  return row;
}

export async function attachSessionTemplateToProgram(
  programId: number,
  sessionTemplateId: number,
  orderIndex: number,
  dayLabel?: string,
) {
  await db.insert(programSessionTemplates).values({ programId, sessionTemplateId, orderIndex, dayLabel });
}

/** Retire une séance d'un programme (la séance elle-même n'est pas supprimée, juste détachée). */
export async function removeSessionFromProgram(programId: number, sessionTemplateId: number) {
  await db
    .delete(programSessionTemplates)
    .where(
      and(
        eq(programSessionTemplates.programId, programId),
        eq(programSessionTemplates.sessionTemplateId, sessionTemplateId),
      ),
    );
}

/** Supprime le programme. Les séances qu'il contenait ne sont pas supprimées, juste détachées (cascade). */
export async function deleteProgram(programId: number) {
  await db.delete(programs).where(eq(programs.id, programId));
}
