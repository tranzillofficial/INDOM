import { notFound } from 'next/navigation';
import { AionExperience } from '../../../components/AionExperience';

export const metadata = { title: 'AION — Your guide to what’s next' };
export default async function AionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  return <AionExperience locale={locale} key={locale}/>;
}
