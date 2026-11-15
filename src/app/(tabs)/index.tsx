import { Redirect } from 'expo-router';

/** Pas d'onglet "Accueil" : la racine "/" redirige directement vers l'onglet Entraînement. */
export default function TabsIndexRedirect() {
  return <Redirect href="/programs" />;
}
