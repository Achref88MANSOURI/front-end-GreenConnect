// Redirect this route away since 'Mes Équipements' page was removed
'use client';
import { redirect } from 'next/navigation';

export default function RemovedMyEquipmentPage() {
  redirect('/equipment/browse');
  return null;
}
