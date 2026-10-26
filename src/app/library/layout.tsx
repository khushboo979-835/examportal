import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Study Library | StudyFree PDF & DDIS',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
