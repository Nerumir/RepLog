import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { BackupPayload } from '@/db/queries/backup';

function backupFileName(exportedAt: number): string {
  const date = new Date(exportedAt).toISOString().slice(0, 10);
  return `replog-sauvegarde-${date}.json`;
}

/** Écrit la sauvegarde dans un fichier temporaire puis ouvre le menu de partage du système pour l'enregistrer où l'utilisateur veut. */
export async function exportBackupToFile(payload: BackupPayload): Promise<void> {
  const file = new File(Paths.cache, backupFileName(payload.exportedAt));
  if (file.exists) file.delete();
  file.create();
  await file.write(JSON.stringify(payload));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Exporter mes données RepLog' });
  }
}

/** Ouvre le sélecteur de fichiers et lit le JSON choisi. Retourne null si l'utilisateur annule. */
export async function pickAndReadBackupFile(): Promise<BackupPayload | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (result.canceled || result.assets.length === 0) return null;

  const file = new File(result.assets[0].uri);
  const content = await file.text();
  return JSON.parse(content) as BackupPayload;
}
